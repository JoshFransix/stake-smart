import type { BetSlipSummary } from '@stake-smart/types';
import type { Scenario } from '@stake-smart/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { ComparisonCard } from './ComparisonCard';

interface ScenarioExplorerProps {
  currentSummary: BetSlipSummary;
  scenarios: Scenario[];
}

export function ScenarioExplorer({ currentSummary, scenarios }: ScenarioExplorerProps) {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Scenario Explorer
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          See how removing each bet affects your payout
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              layout
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
            >
              <ComparisonCard
                current={currentSummary}
                alternative={scenario.summary}
                label={scenario.label}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}
