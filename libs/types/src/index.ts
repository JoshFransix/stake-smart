export interface Bet {
  id: string;
  match: string;
  odds: number;
  selected: boolean;
}

export interface BetSlipSummary {
  totalOdds: number;
  potentialPayout: number;
  selectedCount: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface BetHistoryEntry {
  id: string;
  timestamp: number;
  bets: Bet[];
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  won: boolean;
  actualReturn: number;
}
