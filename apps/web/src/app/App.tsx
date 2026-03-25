import { useState } from "react";
import { useBetSlip, useDarkMode, useScenarios } from "@stake-smart/hooks";
import {
  BetList,
  Summary,
  StakeInput,
  DarkModeToggle,
  ScenarioExplorer,
  ProbabilityAnalyzer,
} from "@stake-smart/ui";
import { analyzeBets, calculateCombinedProbability } from "@stake-smart/betting";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const {
    bets,
    stake,
    setStake,
    summary,
    riskLevel,
    addBet,
    toggleBet,
    removeBet,
    clearBets,
  } = useBetSlip();
  const { isDark, toggle } = useDarkMode();
  const scenarios = useScenarios(bets, stake);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const probabilities = analyzeBets(bets);
  const combinedProbability = calculateCombinedProbability(bets);

  const handleAddBet = (match: string, odds: number) => {
    const success = addBet(match, odds);
    if (!success) {
      setToastMessage(`"${match}" is already in your bet slip!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const sampleBets = [
    { match: "Arsenal vs Chelsea", odds: 2.5 },
    { match: "Man City vs Liverpool", odds: 3.2 },
    { match: "Barcelona vs Real Madrid", odds: 1.8 },
    { match: "Bayern vs Dortmund", odds: 2.1 },
    { match: "PSG vs Lyon", odds: 1.6 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Stake Smart
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              AI-powered bet analysis with real-time scenario simulation
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </header>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bet Slip
                </h2>
                {bets.length > 0 && (
                  <button
                    onClick={clearBets}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 
                             transition-colors duration-150 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <BetList bets={bets} onToggle={toggleBet} onRemove={removeBet} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Sample Bet
              </h3>
              <div className="flex flex-wrap gap-2">
                {sampleBets.map((bet, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddBet(bet.match, bet.odds)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded 
                             hover:bg-blue-700 active:bg-blue-800 
                             transition-colors duration-150 hover:shadow-md"
                  >
                    {bet.match} ({bet.odds})
                  </motion.button>
                ))}
              </div>
            </div>

            <ProbabilityAnalyzer 
              probabilities={probabilities}
              combinedProbability={combinedProbability}
            />

            <ScenarioExplorer
              currentSummary={summary}
              scenarios={scenarios}
            />
          </div>

          <div className="space-y-6">
            <StakeInput value={stake} onChange={setStake} />
            <Summary summary={summary} riskLevel={riskLevel} />
          </div>
        </div>
      </div>
    </div>
  );
}
