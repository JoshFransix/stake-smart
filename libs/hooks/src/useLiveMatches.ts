import { useState, useEffect, useCallback } from 'react';
import { fetchLiveOdds } from '@stake-smart/api';
import type { Match } from '@stake-smart/api';

export function useLiveMatches(sport: string = 'soccer_epl') {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLiveOdds(sport);
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sport]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return { matches, loading, error, refetch: loadMatches };
}
