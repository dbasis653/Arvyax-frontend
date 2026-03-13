import apiFetch from '@/services/api';
import { API_ROUTES } from '@/constants/api.constants';

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

// Runs LLM analysis on an existing entry by id and persists the results.
// Returns the updated entry object with emotion, summary, keywords, and analyzedAt populated.
// Throws RateLimitError (429), NotFoundError (404), or ExternalServiceError (502).
async function analyzeEntry(id) {
  return apiFetch(API_ROUTES.JOURNAL_ANALYZE_BY_ID(id), {
    method: 'POST',
  });
}

export { createEntry, getEntries, analyzeText, getInsights, analyzeEntry };
