import axios from 'axios';
import type { OddsApiMatch, Match } from './types';

const API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = import.meta.env.VITE_ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';

if (!API_KEY) {
  throw new Error('API Key is not defined in environment variables');
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

let getCacheFunction: ((sport: string) => Match[] | null) | null = null;
let setCacheFunction: ((sport: string, data: Match[]) => void) | null = null;

export function initializeOddsCache(
  getCache: (sport: string) => Match[] | null,
  setCache: (sport: string, data: Match[]) => void
) {
  getCacheFunction = getCache;
  setCacheFunction = setCache;
}

export async function fetchLiveOdds(sport: string = 'soccer_epl', forceRefresh: boolean = false): Promise<Match[]> {
  if (!forceRefresh && getCacheFunction) {
    const cached = getCacheFunction(sport);
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
    
    const matches = data
      .map(match => transformMatch(match))
      .filter((match): match is Match => match !== null);
    
    if (setCacheFunction) {
      setCacheFunction(sport, matches);
    }
    
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

function transformMatch(apiMatch: OddsApiMatch): Match | null {
  const bookmaker = apiMatch.bookmakers[0];
  const h2hMarket = bookmaker?.markets?.find(m => m.key === 'h2h');
  
  const homeOutcome = h2hMarket?.outcomes?.find(o => o.name === apiMatch.home_team);
  const awayOutcome = h2hMarket?.outcomes?.find(o => o.name === apiMatch.away_team);
  const drawOutcome = h2hMarket?.outcomes?.find(o => o.name === 'Draw');

  if (!homeOutcome?.price || !awayOutcome?.price) {
    console.warn(`Skipping match ${apiMatch.home_team} vs ${apiMatch.away_team} - missing odds data`);
    return null;
  }

  return {
    id: apiMatch.id,
    home: apiMatch.home_team,
    away: apiMatch.away_team,
    odds: {
      home: homeOutcome.price,
      away: awayOutcome.price,
      draw: drawOutcome?.price,
    },
    sport: apiMatch.sport_title,
    commenceTime: apiMatch.commence_time,
  };
}
