'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useJournal } from '@/hooks/useJournal';
import { useInsights } from '@/hooks/useInsights';
import { JournalForm } from '@/components/journal/JournalForm';
import { JournalFeed } from '@/components/journal/JournalFeed';
import { InsightsSummary } from '@/components/insights/InsightsSummary';
import { KeywordCloud } from '@/components/insights/KeywordCloud';
import Spinner from '@/components/ui/Spinner';
import './page.css';

export default function JournalPage() {
  const { user } = useUser();
  const { entries, isLoading: isEntriesLoading, error: entriesError, fetchEntries } = useJournal();
  const { insights, isLoading: isInsightsLoading, fetchInsights } = useInsights();

  // Load entries and insights when the page mounts
  useEffect(() => {
    if (user) {
      fetchEntries(user.username);
      if (user.id) fetchInsights(user.id);
    }
  }, [user]);

  // Refreshes both entries and insights after a new entry is submitted
  function handleEntrySuccess() {
    fetchEntries(user.username);
    if (user.id) fetchInsights(user.id);
  }

  return (
    <div className="journal-page">

      {/* ── New Entry ── */}
      <section className="journal-page__section">
        <h2 className="journal-page__section-title">New Entry</h2>
        <JournalForm onSuccess={handleEntrySuccess} />
      </section>

      {/* ── Previous Entries ── */}
      <section className="journal-page__section">
        <h2 className="journal-page__section-title">Previous Entries</h2>
        <JournalFeed
          entries={entries}
          isLoading={isEntriesLoading}
          error={entriesError}
        />
      </section>

      {/* ── Insights ── */}
      <section className="journal-page__section">
        <h2 className="journal-page__section-title">Insights</h2>
        {isInsightsLoading ? (
          <Spinner size="md" />
        ) : insights ? (
          <>
            <InsightsSummary insights={insights} />
            <div className="journal-page__keywords">
              <h3 className="journal-page__keywords-label">Recent Keywords</h3>
              <KeywordCloud keywords={insights.recentKeywords} />
            </div>
          </>
        ) : (
          <p className="journal-page__empty">Write your first entry to see insights.</p>
        )}
      </section>

    </div>
  );
}
