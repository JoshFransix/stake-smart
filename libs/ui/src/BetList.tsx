import type { Bet } from "@stake-smart/types";
import { AnimatePresence } from "framer-motion";
import { BetCard } from "./BetCard";

interface BetListProps {
  bets: Bet[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function BetList({ bets, onToggle, onRemove }: BetListProps) {
  if (bets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No bets added yet. Add your first bet to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {bets.map((bet) => (
          <BetCard
            key={bet.id}
            bet={bet}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
