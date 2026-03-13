'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatDate, capitalize } from '@/utils/format';
import { analyzeEntry } from '@/services/journal.service';
import './JournalCard.css';

// Displays a single journal entry.
// When emotion is 'no-analysis', shows an Analyze button. Clicking it calls the
// /api/journal/:id/analyze endpoint and updates the card with the returned analysis.
// Props:
//   entry — a journal entry object from the API
export function JournalCard({ entry: initialEntry }) {
  const [entry, setEntry] = useState(initialEntry);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  const hasAnalysis = entry.emotion && entry.emotion !== 'no-analysis';

  // Calls the analyze endpoint and updates local entry state with the result.
  async function handleAnalyze() {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      const updated = await analyzeEntry(entry.id);
      setEntry(updated);
    } catch (err) {
      setAnalyzeError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <article className="journal-card">

      {/* ── Header: ambience + date ── */}
      <header className="journal-card__header">
        <span className="journal-card__ambience">{capitalize(entry.ambience)}</span>
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
          {entry.summary && entry.summary !== 'no-analysis' && (
            <p className="journal-card__summary">{entry.summary}</p>
          )}

          {/* ── Keywords ── */}
          {entry.keywords?.length > 0 && (
            <div className="journal-card__keywords">
              {entry.keywords.map((kw) => (
                <span key={kw} className="journal-card__keyword">{kw}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="journal-card__no-analysis">
          {analyzeError && (
            <p className="journal-card__analyze-error">{analyzeError}</p>
          )}
          <button
            className="journal-card__analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      )}
    </article>
  );
}
