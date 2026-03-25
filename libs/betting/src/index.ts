import type { Bet, BetSlipSummary, RiskLevel } from '@stake-smart/types';

export function calculateSummary(bets: Bet[], stake: number): BetSlipSummary {
  const selectedBets = bets.filter((bet) => bet.selected);
  const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialPayout = stake * totalOdds;

  return {
    totalOdds,
    potentialPayout,
    selectedCount: selectedBets.length,
  };
}

export function calculateRiskLevel(bets: Bet[]): RiskLevel {
  const selectedBets = bets.filter((bet) => bet.selected);
  
  if (selectedBets.length === 0) return 'Low';
  
  const avgOdds = selectedBets.reduce((sum, bet) => sum + bet.odds, 0) / selectedBets.length;
  
  if (avgOdds < 2) return 'Low';
  if (avgOdds < 4) return 'Medium';
  return 'High';
}
