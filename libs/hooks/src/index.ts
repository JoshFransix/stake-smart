import { useState, useMemo } from 'react';
import type { Bet, BetSlipSummary, RiskLevel } from '@stake-smart/types';
import { calculateSummary, calculateRiskLevel } from '@stake-smart/betting';

export function useBetSlip() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [stake, setStake] = useState(10);

  const summary: BetSlipSummary = useMemo(
    () => calculateSummary(bets, stake),
    [bets, stake]
  );

  const riskLevel: RiskLevel = useMemo(
    () => calculateRiskLevel(bets),
    [bets]
  );

  const addBet = (match: string, odds: number) => {
    const newBet: Bet = {
      id: crypto.randomUUID(),
      match,
      odds,
      selected: true,
    };
    setBets((prev) => [...prev, newBet]);
  };

  const removeBet = (id: string) => {
    setBets((prev) => prev.filter((bet) => bet.id !== id));
  };

  const toggleBet = (id: string) => {
    setBets((prev) =>
      prev.map((bet) =>
        bet.id === id ? { ...bet, selected: !bet.selected } : bet
      )
    );
  };

  const clearBets = () => {
    setBets([]);
  };

  return {
    bets,
    stake,
    setStake,
    summary,
    riskLevel,
    addBet,
    removeBet,
    toggleBet,
    clearBets,
  };
}
