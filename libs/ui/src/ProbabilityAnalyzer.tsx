import { motion } from 'framer-motion';
import type { BetProbability } from '@stake-smart/betting';
import clsx from 'clsx';

interface ProbabilityAnalyzerProps {
  probabilities: BetProbability[];
  combinedProbability: number;
}

export function ProbabilityAnalyzer({ probabilities, combinedProbability }: ProbabilityAnalyzerProps) {
  if (probabilities.length === 0) return null;

  const getChanceColor = (chance: string) => {
    switch (chance) {
      case 'Very Low': return 'text-red-600 dark:text-red-400';
      case 'Low': return 'text-orange-600 dark:text-orange-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'High': return 'text-green-600 dark:text-green-400';
      case 'Very High': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                 border border-purple-200 dark:border-purple-800 rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
          AI Probability Analysis
        </h3>
      </div>

      <div className="space-y-3 mb-4">
        {probabilities.map((prob, index) => (
          <motion.div
            key={prob.match}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded p-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{prob.match}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prob.impliedProbability}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    className={clsx(
                      "h-2 rounded-full",
                      prob.impliedProbability < 40 ? "bg-red-500" :
                      prob.impliedProbability < 60 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                  {prob.impliedProbability.toFixed(1)}%
                </span>
              </div>
            </div>
            <span className={clsx("text-xs font-semibold ml-3", getChanceColor(prob.winChance))}>
              {prob.winChance}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: probabilities.length * 0.1 + 0.3 }}
        className="border-t border-purple-200 dark:border-purple-700 pt-4"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
            Combined Win Probability
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: probabilities.length * 0.1 + 0.5 }}
            className={clsx(
              "text-2xl font-bold",
              combinedProbability < 10 ? "text-red-600 dark:text-red-400" :
              combinedProbability < 30 ? "text-orange-600 dark:text-orange-400" :
              "text-green-600 dark:text-green-400"
            )}
          >
            {combinedProbability.toFixed(2)}%
          </motion.span>
        </div>
        <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
          The probability of all selected bets winning together
        </p>
      </motion.div>
    </motion.div>
  );
}
