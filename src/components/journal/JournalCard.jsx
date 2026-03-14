"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { Badge } from "@/components/ui/Badge";
import { formatDate, capitalize } from "@/utils/format";
import { analyzeEntry } from "@/services/journal.service";
import "./JournalCard.css";

// Displays a single journal entry.
// When emotion is 'no-analysis', shows an Analyze button. Clicking it calls the
// /api/journal/:id/analyze endpoint and updates the card with the returned analysis.
// Props:
//   entry — a journal entry object from the API
export function JournalCard({ entry: initialEntry }) {
  const [entry, setEntry] = useState(initialEntry);
  const [streamState, setStreamState] = useState("idle"); // 'idle' | 'streaming' | 'error'
  const [streamBuffer, setStreamBuffer] = useState("");
  const [analyzeError, setAnalyzeError] = useState(null);

  const hasAnalysis = entry.emotion && entry.emotion !== "no-analysis";

  // Opens the SSE stream to the analyze endpoint and updates card state progressively.
  // onChunk accumulates the summary prose tokens into streamBuffer for the live preview.
  // onDone swaps in the full updated entry, transitioning to the structured analysis view.
  // onError surfaces the message and re-enables the Analyze button.
  async function handleAnalyze() {
    setStreamState("streaming");
    setStreamBuffer("");
    setAnalyzeError(null);

    await analyzeEntry(entry.id, {
      onChunk(text) {
        // flushSync forces React 19 to re-render synchronously for each chunk,
        // bypassing automatic batching so the text visibly types in word by word.
        flushSync(() => {
          setStreamBuffer((prev) => prev + text);
        });
      },
      onDone(updatedEntry) {
        setEntry(updatedEntry);
        setStreamState("idle");
      },
      onError(message) {
        setAnalyzeError(message);
        setStreamState("error");
      },
    });
  }

  return (
    <article className="journal-card">
      {/* ── Header: ambience + date ── */}
      <header className="journal-card__header">
        <span className="journal-card__ambience">
          {capitalize(entry.ambience)}
        </span>
        <time className="journal-card__date" dateTime={entry.createdAt}>
          {formatDate(entry.createdAt)}
        </time>
      </header>

      {/* ── Journal text ── */}
      <p className="journal-card__text">{entry.text}</p>

      {/* ── AI analysis section ── */}
      {hasAnalysis ? (
        <div className="journal-card__analysis">
          {/* ── Emotion badge ── */}
          <div className="journal-card__emotion-row">
            <span className="journal-card__analysis-label">Emotion</span>
            <Badge emotion={entry.emotion} />
          </div>

          {/* ── Summary ── */}
          {entry.summary && entry.summary !== "no-analysis" && (
            <p className="journal-card__summary">{entry.summary}</p>
          )}

          {/* ── Keywords ── */}
          {entry.keywords?.length > 0 && (
            <div className="journal-card__keywords">
              {entry.keywords.map((kw) => (
                <span key={kw} className="journal-card__keyword">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : streamState === "streaming" ? (
        // ── Streaming in progress ──
        <div className="journal-card__streaming">
          <p className="journal-card__stream-text">
            {streamBuffer}
            <span className="journal-card__cursor" aria-hidden="true" />
          </p>
        </div>
      ) : (
        // ── No analysis yet / error ──
        <div className="journal-card__no-analysis">
          {analyzeError && (
            <p className="journal-card__analyze-error">{analyzeError}</p>
          )}
          <button
            className="journal-card__analyze-btn"
            onClick={handleAnalyze}
            disabled={streamState === "streaming"}
          >
            Analyze
          </button>
        </div>
      )}
    </article>
  );
}
