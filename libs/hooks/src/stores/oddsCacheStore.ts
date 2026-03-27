import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Match } from '@stake-smart/api';

const CACHE_DURATION = 10 * 60 * 1000;

interface CacheEntry {
  data: Match[];
  timestamp: number;
}

interface OddsCacheStore {
  cache: Record<string, CacheEntry>;
  getCache: (sport: string) => Match[] | null;
  setCache: (sport: string, data: Match[]) => void;
  clearCache: () => void;
}

export const useOddsCacheStore = create<OddsCacheStore>()(
  persist(
    (set, get) => ({
      cache: {},
      
      getCache: (sport: string) => {
        const entry = get().cache[sport];
        if (!entry) return null;
        
        const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
        if (isExpired) {
          set((state) => {
            const newCache = { ...state.cache };
            delete newCache[sport];
            return { cache: newCache };
          });
          return null;
        }
        
        return entry.data;
      },
      
      setCache: (sport: string, data: Match[]) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [sport]: {
              data,
              timestamp: Date.now(),
            },
          },
        }));
      },
      
      clearCache: () => set({ cache: {} }),
    }),
    {
      name: 'odds-cache',
    }
  )
);
