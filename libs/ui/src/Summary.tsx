import type { BetSlipSummary, RiskLevel } from "@stake-smart/types";
import { formatCurrency, formatOdds } from "@stake-smart/betting";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import clsx from "clsx";

interface SummaryProps {
  summary: BetSlipSummary;
  riskLevel: RiskLevel;
}

function AnimatedNumber({ value, format }: { value: number; format?: (n: number) => string }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => 
    format ? format(current) : current.toFixed(0)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function Summary({ summary, riskLevel }: SummaryProps) {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "Low":
        return "text-green-600 dark:text-green-400";
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "High":
        return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <motion.div
      layout
      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Selected Bets
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            <AnimatedNumber value={summary.selectedCount} />
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Odds</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            <AnimatedNumber value={summary.totalOdds} format={(n) => n.toFixed(2)} />
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Potential Payout
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              <AnimatedNumber 
                value={summary.potentialPayout} 
                format={(n) => formatCurrency(n)} 
              />
            </span>
          </div>
        </div>

        <motion.div 
          className="flex justify-between items-center"
          animate={{ 
            scale: [1, 1.05, 1],
            transition: { duration: 0.3 }
          }}
          key={riskLevel}
        >
          <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
          <span className={clsx("font-semibold", getRiskColor(riskLevel))}>
            {riskLevel}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
