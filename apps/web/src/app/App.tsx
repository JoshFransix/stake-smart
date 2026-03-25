import { useBetSlip } from "@stake-smart/hooks";

export default function App() {
  const { bets, summary, riskLevel, addBet } = useBetSlip();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Stake Smart
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Smart Bet Slip Simulator
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => addBet("Arsenal vs Chelsea", 2.5)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Sample Bet
          </button>

          <div className="text-gray-900 dark:text-white">
            <p>Bets: {bets.length}</p>
            <p>Total Odds: {summary.totalOdds.toFixed(2)}</p>
            <p>Potential Payout: ${summary.potentialPayout.toFixed(2)}</p>
            <p>Risk Level: {riskLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
