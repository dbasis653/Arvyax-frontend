'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useJournal } from '@/hooks/useJournal';
import { useInsights } from '@/hooks/useInsights';
import { JournalForm } from '@/components/journal/JournalForm';
import { JournalFeed } from '@/components/journal/JournalFeed';
import { InsightsSummary } from '@/components/insights/InsightsSummary';
import { KeywordCloud } from '@/components/insights/KeywordCloud';
import { Spinner } from '@/components/ui/Spinner';

export default function JournalPage() {
  const { user } = useUser();
  const { entries, isLoading: isEntriesLoading, error: entriesError, fetchEntries } = useJournal();
  const { insights, isLoading: isInsightsLoading, fetchInsights } = useInsights();

  useEffect(() => {
    if (user) {
      fetchEntries(user.username);
      if (user.id) fetchInsights(user.id);
    }
  }, [user]);

  function handleEntrySuccess() {
    fetchEntries(user.username);
    if (user.id) fetchInsights(user.id);
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

      {/* ── New Entry ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 className="section-heading">New Entry</h2>
        <JournalForm onSuccess={handleEntrySuccess} />
      </section>

      {/* ── Previous Entries ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 className="section-heading">Previous Entries</h2>
        <JournalFeed
          entries={entries}
          isLoading={isEntriesLoading}
          error={entriesError}
          onAnalyzed={() => { if (user?.id) fetchInsights(user.id); }}
        />
      </section>

      {/* ── Insights ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 className="section-heading">Insights</h2>
        {isInsightsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <Spinner size="md" />
          </div>
        ) : insights ? (
          <>
            <InsightsSummary insights={insights} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Recent Keywords
              </h3>
              <KeywordCloud keywords={insights.recentKeywords} />
            </div>
          </>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text)', fontStyle: 'italic', margin: 0 }}>
            Write your first entry to see insights.
          </p>
        )}
      </section>

    </div>
  );
}
