import { JournalCard } from './JournalCard';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Renders the full list of journal entries with loading, error, and empty states.
// Props:
//   entries    — array of journal entry objects
//   isLoading  — shows a centered spinner while entries are being fetched
//   error      — shows an ErrorMessage if the fetch failed
//   onAnalyzed — forwarded to each JournalCard; called after analysis completes
export function JournalFeed({ entries, isLoading, error, onAnalyzed }) {

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '8px', padding: '60px 24px', textAlign: 'center',
        border: '1px dashed var(--border)', borderRadius: '14px',
        background: 'var(--surface)',
      }}>
        <p style={{ fontSize: '28px', margin: 0 }}>📖</p>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>No entries yet</p>
        <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0 }}>Write your first entry to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {entries.map((entry) => (
        <JournalCard key={entry.id} entry={entry} onAnalyzed={onAnalyzed} />
      ))}
    </div>
  );
}
