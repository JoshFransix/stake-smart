import type { BetSlipSummary, RiskLevel } from "@stake-smart/types";
import { formatCurrency, formatOdds } from "@stake-smart/betting";
import clsx from "clsx";

interface SummaryProps {
  summary: BetSlipSummary;
  riskLevel: RiskLevel;
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
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Selected Bets
          </span>
          <span className="font-semibold text-gray-900 dark:text-white transition-all duration-300">
            {summary.selectedCount}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Odds</span>
          <span className="font-semibold text-gray-900 dark:text-white transition-all duration-300">
            {formatOdds(summary.totalOdds)}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              Potential Payout
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300">
              {formatCurrency(summary.potentialPayout)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
          <span className={clsx("font-semibold transition-colors duration-300", getRiskColor(riskLevel))}>
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
