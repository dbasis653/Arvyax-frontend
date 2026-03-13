'use client';

import { useState, useCallback } from 'react';
import { getInsights } from '@/services/journal.service';

// Fetches and holds aggregate insights for the current user.
// Returns:
//   insights       — { totalEntries, topEmotion, mostUsedAmbience, recentKeywords } or null
//   isLoading      — true while the request is in flight
//   error          — error message string if the request failed, or null
//   fetchInsights  — async function(userId): loads insights for the given userId
export function useInsights() {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetches insights from the backend using the user's id (not username).
  // Replaces any previously loaded insights.
  const fetchInsights = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInsights(userId);
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { insights, isLoading, error, fetchInsights };
}
