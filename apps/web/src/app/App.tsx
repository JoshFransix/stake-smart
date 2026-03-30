import { useState } from "react";
import { useBetSlip, useDarkMode, useScenarios, useBetHistoryStore } from "@stake-smart/hooks";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import {
  BetList,
  Summary,
  StakeInput,
  DarkModeToggle,
  ScenarioExplorer,
  ProbabilityAnalyzer,
  ScrollToTop,
  LiveMatches,
  BetHistory,
  Button,
} from "@stake-smart/ui";
import { toast, Toaster } from "sonner";
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
  const { history, addEntry, clearHistory } = useBetHistoryStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'betslip' | 'history'>('betslip');

  const probabilities = analyzeBets(bets);
  const combinedProbability = calculateCombinedProbability(bets);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast.info(message);
    }
  };

  const handleAddBet = (match: string, odds: number) => {
    const success = addBet(match, odds);
    if (!success) {
      showToast(`"${match}" is already in your bet slip!`, 'error');
    } else {
      showToast(`Added "${match}" to your bet slip`, 'success');
    }
  };

  const handleCompleteBet = (won: boolean) => {
    if (bets.filter(b => b.selected).length === 0) {
      showToast('Please select at least one bet', 'error');
      return;
    }

    const actualReturn = won ? summary.potentialPayout : 0;
    addEntry(bets, stake, summary.totalOdds, summary.potentialPayout, won, actualReturn);
    clearBets();
    showToast(
      won ? 'Winning bet recorded!' : 'Bet recorded',
      won ? 'success' : 'info'
    );
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <ScrollToTop />
      <Toaster position="top-right" richColors closeButton />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <img
              src={isDark ? "/logo-dark.svg" : "/logo.svg"}
              alt="Stake Smart"
              className="h-12 w-auto md:h-14"
            />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Advanced bet analysis with real-time odds and scenario simulation
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </header>

        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('betslip')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'betslip'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Bet Slip
            {activeTab === 'betslip' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'history'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            History
            {history.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                {history.length}
              </span>
            )}
            {activeTab === 'history' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
        </div>

        {activeTab === 'betslip' && (
          <div className="grid lg:grid-cols-3 gap-6 pb-24 lg:pb-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Bet Slip
                  </h2>
                  {bets.length > 0 && (
                    <Button
                      onClick={clearBets}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                <BetList bets={bets} onToggle={toggleBet} onRemove={removeBet} />
                
                {bets.filter(b => b.selected).length > 0 && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => handleCompleteBet(true)}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      size="lg"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Won
                    </Button>
                    <Button
                      onClick={() => handleCompleteBet(false)}
                      variant="destructive"
                      className="flex-1"
                      size="lg"
                    >
                      <TrendingDown className="w-4 h-4" />
                      Lost
                    </Button>
                  </div>
                )}
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
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
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
        )}

        {activeTab === 'history' && (
          <div className="pb-8">
            <BetHistory history={history} onClearHistory={clearHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
