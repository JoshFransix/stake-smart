import type { Bet } from '@stake-smart/types';

export interface BetProbability {
  match: string;
  odds: number;
  impliedProbability: number;
  winChance: string;
}

export function calculateImpliedProbability(odds: number): number {
  return (1 / odds) * 100;
}

export function calculateCombinedProbability(bets: Bet[]): number {
  const selectedBets = bets.filter(b => b.selected);
  if (selectedBets.length === 0) return 0;
  
  const probabilities = selectedBets.map(bet => calculateImpliedProbability(bet.odds) / 100);
  const combined = probabilities.reduce((acc, prob) => acc * prob, 1) * 100;
  
  return combined;
}

export function analyzeBets(bets: Bet[]): BetProbability[] {
  return bets
    .filter(b => b.selected)
    .map(bet => {
      const impliedProbability = calculateImpliedProbability(bet.odds);
      let winChance = 'Very High';
      
      if (impliedProbability < 20) winChance = 'Very Low';
      else if (impliedProbability < 40) winChance = 'Low';
      else if (impliedProbability < 60) winChance = 'Medium';
      else if (impliedProbability < 80) winChance = 'High';
      
      return {
        match: bet.match,
        odds: bet.odds,
        impliedProbability,
        winChance,
      };
    });
}
