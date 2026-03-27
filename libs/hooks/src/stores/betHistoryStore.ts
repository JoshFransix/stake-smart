import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BetHistoryEntry, Bet } from '@stake-smart/types';

export interface BetHistoryStore {
  history: BetHistoryEntry[];
  addEntry: (
    bets: Bet[],
    stake: number,
    totalOdds: number,
    potentialPayout: number,
    won: boolean,
    actualReturn: number
  ) => void;
  clearHistory: () => void;
  deleteEntry: (id: string) => void;
}

export const useBetHistoryStore = create<BetHistoryStore>()(
  persist(
    (set) => ({
      history: [],
      
      addEntry: (bets, stake, totalOdds, potentialPayout, won, actualReturn) => {
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
        set((state) => ({ history: [entry, ...state.history] }));
      },
      
      clearHistory: () => set({ history: [] }),
      
      deleteEntry: (id) =>
        set((state) => ({
          history: state.history.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: 'stake-smart-history',
    }
  )
);
