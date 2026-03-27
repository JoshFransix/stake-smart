import axios from 'axios';
import type { OddsApiMatch, Match } from './types';

const API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = import.meta.env.VITE_ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';
const CACHE_DURATION = 10 * 60 * 1000;

if (!API_KEY) {
  throw new Error('API Key is not defined in environment variables');
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

interface CacheEntry {
  data: Match[];
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

function getCacheKey(sport: string): string {
  return `odds_${sport}`;
}

function getFromCache(sport: string): Match[] | null {
  const cacheKey = getCacheKey(sport);
  
  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && Date.now() - memoryEntry.timestamp < CACHE_DURATION) {
    console.log(`[Cache] Memory hit for ${sport}`);
    return memoryEntry.data;
  }
  
  try {
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      const entry: CacheEntry = JSON.parse(stored);
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        console.log(`[Cache] LocalStorage hit for ${sport}`);
        memoryCache.set(cacheKey, entry);
        return entry.data;
      }
    }
  } catch (error) {
    console.warn('[Cache] Failed to read from localStorage:', error);
  }
  
  return null;
}

function saveToCache(sport: string, data: Match[]): void {
  const cacheKey = getCacheKey(sport);
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
  };
  
  memoryCache.set(cacheKey, entry);
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[Cache] Failed to write to localStorage:', error);
  }
}

export async function fetchLiveOdds(sport: string = 'soccer_epl', forceRefresh: boolean = false): Promise<Match[]> {
  if (!forceRefresh) {
    const cached = getFromCache(sport);
    if (cached) {
      return cached;
    }
  }
  
  try {
    console.log(`[API] Fetching live odds for ${sport}`);
    const { data } = await apiClient.get<OddsApiMatch[]>(`/sports/${sport}/odds/`, {
      params: {
        regions: 'uk,us',
        markets: 'h2h',
        oddsFormat: 'decimal',
      },
    });
    
    const matches = data.map(match => transformMatch(match));
    saveToCache(sport, matches);
    return matches;
  } catch (error) {
    console.error('Failed to fetch odds:', error);
    throw error;
  }
}

export async function fetchAvailableSports() {
  try {
    const { data } = await apiClient.get('/sports/');
    return data;
  } catch (error) {
    console.error('Failed to fetch sports:', error);
    throw error;
  }
}

function transformMatch(apiMatch: OddsApiMatch): Match {
  const bookmaker = apiMatch.bookmakers[0];
  const h2hMarket = bookmaker?.markets?.find(m => m.key === 'h2h');
  
  const homeOutcome = h2hMarket?.outcomes?.find(o => o.name === apiMatch.home_team);
  const awayOutcome = h2hMarket?.outcomes?.find(o => o.name === apiMatch.away_team);
  const drawOutcome = h2hMarket?.outcomes?.find(o => o.name === 'Draw');

  return {
    id: apiMatch.id,
    home: apiMatch.home_team,
    away: apiMatch.away_team,
    odds: {
      home: homeOutcome?.price || 2.0,
      away: awayOutcome?.price || 2.0,
      draw: drawOutcome?.price,
    },
    sport: apiMatch.sport_title,
    commenceTime: apiMatch.commence_time,
  };
}
