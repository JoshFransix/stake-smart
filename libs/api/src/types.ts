export interface OddsApiMatch {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

export interface Match {
  id: string;
  home: string;
  away: string;
  odds: {
    home: number;
    away: number;
    draw?: number;
  };
  sport: string;
  commenceTime: string;
}
