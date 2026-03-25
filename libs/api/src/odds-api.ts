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

export async function fetchLiveOdds(sport: string = 'soccer_epl'): Promise<Match[]> {
  try {
    const { data } = await apiClient.get<OddsApiMatch[]>(`/sports/${sport}/odds/`, {
      params: {
        regions: 'uk,us',
        markets: 'h2h',
        oddsFormat: 'decimal',
      },
    });
    
    return data.map(match => transformMatch(match));
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
