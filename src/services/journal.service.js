import apiFetch from '@/services/api';
import { API_BASE_URL, API_ROUTES } from '@/constants/api.constants';

// Creates a new journal entry without LLM analysis.
// Returns the entry object with emotion and summary set to 'no-analysis'.
// Throws ValidationError (400), NotFoundError (404).
async function createEntry({ username, ambience, text }) {
  return apiFetch(API_ROUTES.JOURNAL, {
    method: 'POST',
    body: JSON.stringify({ username, ambience, text }),
  });
}

// Fetches all journal entries for a given username, newest first.
// Returns an array of entry objects.
// Throws NotFoundError (404) if the user does not exist.
async function getEntries(username) {
  return apiFetch(API_ROUTES.JOURNAL_BY_USER(username));
}

// Runs standalone LLM analysis on arbitrary text without creating a journal entry.
// Returns { emotion, summary, keywords }.
// Throws RateLimitError (429) if the rate limit is hit, ExternalServiceError (502) if Groq fails.
async function analyzeText(text) {
  return apiFetch(API_ROUTES.JOURNAL_ANALYZE, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

// Fetches aggregate insights for a user by their userId (not username).
// Returns { totalEntries, topEmotion, mostUsedAmbience, recentKeywords }.
// Throws NotFoundError (404) if the user does not exist.
async function getInsights(userId) {
  return apiFetch(API_ROUTES.INSIGHTS(userId));
}

// Streams LLM analysis for an existing entry via SSE (Server-Sent Events).
// Opens POST /api/journal/:id/analyze and reads the response body as a stream.
// Cannot use apiFetch here — apiFetch calls response.json() which consumes the stream.
// onChunk(text): called for each token chunk as the model streams
// onDone(entry): called with the full updated entry when the stream completes
// onError(message): called on network failure, HTTP error, or mid-stream error event
async function analyzeEntry(id, { onChunk, onDone, onError }) {
  const url = `${API_BASE_URL}${API_ROUTES.JOURNAL_ANALYZE_BY_ID(id)}`;

  // 1. Open the SSE connection
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    onError('Could not connect to server. Check your internet connection.');
    return;
  }

  // 2. Handle HTTP-level errors that fire before SSE headers (429, 404, 400, etc.)
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message || message;
    } catch { /* ignore parse errors */ }
    onError(message);
    return;
  }

  // 3. Read the SSE stream line by line, buffering incomplete lines across chunks
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep the last incomplete line for the next iteration

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        let event;
        try { event = JSON.parse(raw); } catch { continue; }

        if (event.type === 'chunk') {
          onChunk(event.text);
          // Yield to the browser's paint cycle after each chunk so flushSync
          // commits in JournalCard are actually painted one by one, not batched
          // into a single frame when multiple SSE events arrive in one TCP packet.
          await new Promise((r) => setTimeout(r, 0));
        } else if (event.type === 'done') onDone(event.entry);
        else if (event.type === 'error') onError(event.message);
      }
    }
  } catch {
    onError('Stream interrupted unexpectedly.');
  }
}

export { createEntry, getEntries, analyzeText, getInsights, analyzeEntry };
