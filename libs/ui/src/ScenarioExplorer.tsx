import type { BetSlipSummary } from '@stake-smart/types';
import type { Scenario } from '@stake-smart/hooks';
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
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Scenario Explorer
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          See how removing each bet affects your payout
        </span>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, index) => (
          <div 
            key={scenario.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-slide-up"
          >
            <ComparisonCard
              current={currentSummary}
              alternative={scenario.summary}
              label={scenario.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
