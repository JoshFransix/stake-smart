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
