import { useState } from "react";
import { useBetSlip, useDarkMode, useScenarios } from "@stake-smart/hooks";
import {
  BetList,
  Summary,
  StakeInput,
  DarkModeToggle,
  ScenarioExplorer,
  ProbabilityAnalyzer,
  ScrollToTop,
  LiveMatches,
  Toast,
} from "@stake-smart/ui";
import { analyzeBets, calculateCombinedProbability, formatCurrency } from "@stake-smart/betting";
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
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [isExpanded, setIsExpanded] = useState(false);

  const probabilities = analyzeBets(bets);
  const combinedProbability = calculateCombinedProbability(bets);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddBet = (match: string, odds: number) => {
    const success = addBet(match, odds);
    if (!success) {
      showToast(`"${match}" is already in your bet slip!`, 'error');
    } else {
      showToast(`Added "${match}" to your bet slip`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <ScrollToTop />
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Stake Smart
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Advanced bet analysis with real-time odds and scenario simulation
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </header>

        <div className="grid lg:grid-cols-3 gap-6 pb-24 lg:pb-8">
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

            <LiveMatches onAddBet={handleAddBet} />

            <ProbabilityAnalyzer 
              probabilities={probabilities}
              combinedProbability={combinedProbability}
            />

            <ScenarioExplorer
              currentSummary={summary}
              scenarios={scenarios}
            />
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <StakeInput value={stake} onChange={setStake} />
              <Summary summary={summary} riskLevel={riskLevel} />
            </div>
          </div>

          <motion.div 
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
            initial={false}
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 
                          backdrop-blur-lg border-t-2 border-gray-200 dark:border-gray-700 
                          shadow-2xl" />
            
            <div className="relative w-full">
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -top-8 left-1/2 -translate-x-1/2 
                         bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg
                         border-2 border-b-0 border-gray-200 dark:border-gray-700
                         rounded-t-xl
                         px-6 py-2
                         text-gray-500 dark:text-gray-400 
                         hover:text-gray-700 dark:hover:text-gray-200
                         transition-colors duration-200
                         shadow-lg"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Potential Payout
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(summary.potentialPayout)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-3">
                      <StakeInput value={stake} onChange={setStake} />
                      <Summary summary={summary} riskLevel={riskLevel} compact={true} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
