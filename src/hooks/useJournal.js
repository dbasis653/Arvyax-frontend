'use client';

import { useState, useCallback } from 'react';
import { createEntry, getEntries } from '@/services/journal.service';

// Manages journal entries state and exposes actions for fetching and submitting.
// Returns:
//   entries        — array of journal entry objects, newest first
//   isLoading      — true while fetching the entries list
//   isSubmitting   — true while a new entry is being created
//   error          — error message string from the last failed operation, or null
//   fetchEntries   — async function(username): loads all entries for the user
//   submitEntry    — async function({ ambience, text }): creates a new entry and
//                    prepends it to entries on success
//   clearError     — clears the error state (call before a new submission attempt)
export function useJournal() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetches all entries for the given username and replaces the entries list.
  // Separate loading flag (isLoading) so the feed and the form can show
  // independent loading states.
  const fetchEntries = useCallback(async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEntries(username);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Creates a new journal entry via the API and prepends it to the entries list
  // so the UI updates immediately without a full re-fetch.
  // The returned entry may have null emotion/summary/keywords if the LLM failed
  // on the backend — this is expected and handled in JournalCard.
  // Throws so the form page can react (e.g. show a specific error message).
  const submitEntry = useCallback(async ({ username, ambience, text }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newEntry = await createEntry({ username, ambience, text });
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    entries,
    isLoading,
    isSubmitting,
    error,
    fetchEntries,
    submitEntry,
    clearError,
  };
}
