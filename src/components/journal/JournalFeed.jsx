import { JournalCard } from './JournalCard';
import Spinner from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import './JournalFeed.css';

// Renders the full list of journal entries with loading, error, and empty states.
// Props:
//   entries   — array of journal entry objects
//   isLoading — shows a centered spinner while entries are being fetched
//   error     — shows an ErrorMessage if the fetch failed
export function JournalFeed({ entries, isLoading, error }) {

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="journal-feed__center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="journal-feed__center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  // ── Empty state ──
  if (entries.length === 0) {
    return (
      <div className="journal-feed__empty">
        <p className="journal-feed__empty-title">No entries yet</p>
        <p className="journal-feed__empty-hint">Write your first entry to get started.</p>
      </div>
    );
  }

  // ── Entries list ──
  return (
    <div className="journal-feed">
      {entries.map((entry) => (
        <JournalCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
