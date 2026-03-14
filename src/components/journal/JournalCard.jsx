"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { Badge } from "@/components/ui/Badge";
import { formatDate, capitalize } from "@/utils/format";
import { analyzeEntry } from "@/services/journal.service";

// Displays a single journal entry as a card.
// When emotion is 'no-analysis', shows an Analyze button that streams AI analysis inline.
// Props:
//   entry      — a journal entry object from the API
//   onAnalyzed — optional callback fired after analysis completes (used to refresh insights)
export function JournalCard({ entry: initialEntry, onAnalyzed }) {
  const [entry, setEntry]           = useState(initialEntry);
  const [streamState, setStreamState] = useState("idle"); // 'idle' | 'streaming' | 'error'
  const [streamBuffer, setStreamBuffer] = useState("");
  const [analyzeError, setAnalyzeError] = useState(null);

  const hasAnalysis = entry.emotion && entry.emotion !== "no-analysis";

  // Opens SSE stream to the analyze endpoint; updates card state progressively.
  async function handleAnalyze() {
    setStreamState("streaming");
    setStreamBuffer("");
    setAnalyzeError(null);

    await analyzeEntry(entry.id, {
      onChunk(text) {
        flushSync(() => setStreamBuffer((prev) => prev + text));
      },
      onDone(updatedEntry) {
        setEntry(updatedEntry);
        setStreamState("idle");
        onAnalyzed?.();
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
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {capitalize(entry.ambience)}
        </span>
        <time style={{ fontSize: '12px', color: 'var(--text)' }} dateTime={entry.createdAt}>
          {formatDate(entry.createdAt)}
        </time>
      </header>

      {/* ── Journal text ── */}
      <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-h)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
        {entry.text}
      </p>

      {/* ── AI analysis section ── */}
      {hasAnalysis ? (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* ── Emotion badge ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Emotion</span>
            <Badge emotion={entry.emotion} />
          </div>

          {/* ── Summary ── */}
          {entry.summary && entry.summary !== "no-analysis" && (
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
              {entry.summary}
            </p>
          )}

          {/* ── Keywords ── */}
          {entry.keywords?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {entry.keywords.map((kw) => (
                <span key={kw} style={{
                  fontSize: '12px',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  background: 'var(--tint)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                }}>
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

      ) : streamState === "streaming" ? (
        // ── Streaming in progress ──
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
            {streamBuffer}
            <span style={{ color: 'var(--accent)', animation: 'blink 0.8s step-start infinite', marginLeft: '2px' }}>|</span>
          </p>
        </div>

      ) : (
        // ── No analysis yet / error ──
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          {analyzeError && (
            <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>{analyzeError}</p>
          )}
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={streamState === "streaming"}
          >
            ✦ Analyze
          </button>
        </div>
      )}
    </article>
  );
}
