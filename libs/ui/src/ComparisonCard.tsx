import type { BetSlipSummary } from '@stake-smart/types';
import { formatCurrency, formatOdds } from '@stake-smart/betting';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {label}
        </span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className={clsx(
            'text-xs font-semibold px-2 py-1 rounded',
            isIncrease
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isIncrease ? '+' : ''}{formatCurrency(payoutDiff).replace('$', '')}
        </motion.span>
      </div>

      <div className="space-y-2 text-sm">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex justify-between"
        >
          <span className="text-blue-700 dark:text-blue-300">Total Odds</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-600 line-through">
              {formatOdds(current.totalOdds)}
            </span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-semibold text-blue-900 dark:text-blue-100"
            >
              {formatOdds(alternative.totalOdds)}
            </motion.span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-between"
        >
          <span className="text-blue-700 dark:text-blue-300">Potential Payout</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-600 line-through">
              {formatCurrency(current.potentialPayout)}
            </span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-semibold text-blue-900 dark:text-blue-100"
            >
              {formatCurrency(alternative.potentialPayout)}
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
