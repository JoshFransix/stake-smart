import { useMemo } from 'react';
import type { Bet, BetSlipSummary } from '@stake-smart/types';
import { calculateSummary } from '@stake-smart/betting';

export interface Scenario {
  id: string;
  label: string;
  summary: BetSlipSummary;
  modifiedBets: Bet[];
}

export function useScenarios(bets: Bet[], stake: number) {
  const scenarios = useMemo(() => {
    const selectedBets = bets.filter(b => b.selected);
    const scenarios: Scenario[] = [];

    selectedBets.forEach(bet => {
      const modifiedBets = bets.map(b => 
        b.id === bet.id ? { ...b, selected: false } : b
      );
      
      scenarios.push({
        id: bet.id,
        label: `Without ${bet.match}`,
        summary: calculateSummary(modifiedBets, stake),
        modifiedBets,
      });
    });

    return scenarios;
  }, [bets, stake]);

  return scenarios;
}
