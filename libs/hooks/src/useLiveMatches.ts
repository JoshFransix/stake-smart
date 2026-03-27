import { useState, useEffect, useRef } from 'react';
import { fetchLiveOdds, initializeOddsCache } from '@stake-smart/api';
import type { Match } from '@stake-smart/api';
import { useOddsCacheStore } from './stores/oddsCacheStore';

export function useLiveMatches(sport: string = 'soccer_epl') {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const { getCache, setCache } = useOddsCacheStore();

  useEffect(() => {
    initializeOddsCache(getCache, setCache);
  }, [getCache, setCache]);

  const loadMatches = async (forceRefresh: boolean = false) => {
    if (loadingRef.current && !forceRefresh) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      const data = await fetchLiveOdds(sport, forceRefresh);
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadMatches();
  }, [sport]);

  return { 
    matches, 
    loading, 
    error, 
    refetch: () => loadMatches(true) 
  };
}
