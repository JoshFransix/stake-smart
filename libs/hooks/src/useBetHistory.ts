import { useState, useEffect, useCallback } from 'react';
import type { BetHistoryEntry, Bet } from '@stake-smart/types';

const STORAGE_KEY = 'stake-smart-history';

export function useBetHistory() {
  const [history, setHistory] = useState<BetHistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save bet history:', error);
    }
  }, [history]);

  const addEntry = useCallback((
    bets: Bet[],
    stake: number,
    totalOdds: number,
    potentialPayout: number,
    won: boolean,
    actualReturn: number
  ) => {
    const entry: BetHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
      bets,
      stake,
      totalOdds,
      potentialPayout,
      won,
      actualReturn,
    };
    
    setHistory((prev) => [entry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return {
    history,
    addEntry,
    clearHistory,
    deleteEntry,
  };
}
