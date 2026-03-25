import { useBetSlip, useDarkMode } from '@stake-smart/hooks';
import { BetList, Summary, StakeInput, DarkModeToggle } from '@stake-smart/ui';

export default function App() {
  const { bets, stake, setStake, summary, riskLevel, addBet, toggleBet, removeBet, clearBets } = useBetSlip();
  const { isDark, toggle } = useDarkMode();

  const sampleBets = [
    { match: 'Arsenal vs Chelsea', odds: 2.5 },
    { match: 'Man City vs Liverpool', odds: 3.2 },
    { match: 'Barcelona vs Real Madrid', odds: 1.8 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Stake Smart
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore risk vs reward when combining bets
            </p>
          </div>
          <DarkModeToggle isDark={isDark} onToggle={toggle} />
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bet Slip
                </h2>
                {bets.length > 0 && (
                  <button
                    onClick={clearBets}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
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
                  <button
                    key={i}
                    onClick={() => addBet(bet.match, bet.odds)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {bet.match} ({bet.odds})
                  </button>
                ))}
              </div>
            </div>
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
