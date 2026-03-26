import type { Bet } from "@stake-smart/types";
import { formatOdds } from "@stake-smart/betting";
import { motion } from "framer-motion";
import clsx from "clsx";
import { forwardRef } from "react";

interface BetCardProps {
  bet: Bet;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const BetCard = forwardRef<HTMLDivElement, BetCardProps>(
  function BetCard({ bet, onToggle, onRemove }, ref) {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.95 }}
        transition={{
          layout: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
        className={clsx(
          "p-4 rounded-lg border",
          bet.selected
            ? "bg-white dark:bg-gray-800 border-blue-500 shadow-sm"
            : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60",
        )}
      >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <motion.input
              whileTap={{ scale: 0.9 }}
              type="checkbox"
              checked={bet.selected}
              onChange={() => onToggle(bet.id)}
              className="w-4 h-4 rounded cursor-pointer transition-colors"
            />
            <h3 className="font-medium text-gray-900 dark:text-white">
              {bet.match}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Odds: {formatOdds(bet.odds)}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRemove(bet.id)}
          className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm 
                     transition-colors duration-150 hover:underline"
        >
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
});
