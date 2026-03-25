import type { BetSlipSummary } from '@stake-smart/types';
import clsx from 'clsx';

interface ComparisonCardProps {
  current: BetSlipSummary;
  alternative: BetSlipSummary;
  label: string;
}

export function ComparisonCard({ current, alternative, label }: ComparisonCardProps) {
  const oddsDiff = alternative.totalOdds - current.totalOdds;
  const payoutDiff = alternative.potentialPayout - current.potentialPayout;
  const isIncrease = payoutDiff > 0;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {label}
        </span>
        <span
          className={clsx(
            'text-xs font-semibold px-2 py-1 rounded',
            isIncrease
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isIncrease ? '+' : ''}{payoutDiff.toFixed(2)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-blue-700 dark:text-blue-300">Total Odds</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-600 line-through">
              {current.totalOdds.toFixed(2)}
            </span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              {alternative.totalOdds.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-blue-700 dark:text-blue-300">Potential Payout</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-600 line-through">
              ${current.potentialPayout.toFixed(2)}
            </span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              ${alternative.potentialPayout.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
