import { Line, Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import type { BetHistoryEntry } from '@stake-smart/types';
import { formatCurrency } from '@stake-smart/betting';
import { BarChart3 } from 'lucide-react';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BetHistoryProps {
  history: BetHistoryEntry[];
  onClearHistory: () => void;
}

export function BetHistory({ history, onClearHistory }: BetHistoryProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
        <h3 className="text-xl font-bold mb-2 dark:text-white">No Bet History Yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete bets to see analytics and insights
        </p>
      </div>
    );
  }

  const winRate = (history.filter(e => e.won).length / history.length) * 100;
  const totalStaked = history.reduce((sum, e) => sum + e.stake, 0);
  const totalReturns = history.reduce((sum, e) => sum + e.actualReturn, 0);
  const netProfit = totalReturns - totalStaked;

  const winRateData = {
    labels: history.slice().reverse().map((_, i) => `Bet ${i + 1}`),
    datasets: [
      {
        label: 'Cumulative Win Rate (%)',
        data: history.slice().reverse().map((_, i, arr) => {
          const slice = arr.slice(0, i + 1);
          const wins = slice.filter((_, j) => history[history.length - 1 - j].won).length;
          return (wins / (i + 1)) * 100;
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const oddsRanges = ['1.0-2.0', '2.0-5.0', '5.0-10.0', '10.0+'];
  const oddsRangeData = {
    labels: oddsRanges,
    datasets: [
      {
        label: 'Win Rate by Odds Range (%)',
        data: oddsRanges.map((range) => {
          const [min, max] = range.split('-').map(parseFloat);
          const filtered = history.filter((h) => {
            if (max) return h.totalOdds >= min && h.totalOdds < max;
            return h.totalOdds >= min;
          });
          if (filtered.length === 0) return 0;
          return (filtered.filter(h => h.won).length / filtered.length) * 100;
        }),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'Won',
        data: history
          .filter(h => h.won)
          .map(h => ({ x: h.totalOdds, y: h.actualReturn })),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
      {
        label: 'Lost',
        data: history
          .filter(h => !h.won)
          .map(h => ({ x: h.totalOdds, y: 0 })),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Win Rate Over Time' },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (val) => `${val}%` } },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Win Rate by Odds Range' },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (val) => `${val}%` } },
    },
  };

  const scatterOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Risk vs Reward' },
    },
    scales: {
      x: { title: { display: true, text: 'Total Odds' } },
      y: { title: { display: true, text: 'Return Amount' } },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Bet History Analytics</h2>
        <Button
          onClick={() => setShowConfirmDialog(true)}
          variant="destructive"
          size="sm"
        >
          Clear History
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={onClearHistory}
        title="Clear Bet History?"
        description="This action cannot be undone. All your bet history and analytics will be permanently deleted."
        confirmText="Clear History"
        cancelText="Cancel"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Win Rate</div>
          <div className="text-3xl font-bold dark:text-white">{winRate.toFixed(1)}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Staked</div>
          <div className="text-3xl font-bold dark:text-white">{formatCurrency(totalStaked)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Returns</div>
          <div className="text-3xl font-bold dark:text-white">{formatCurrency(totalReturns)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Profit</div>
          <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(netProfit)}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6" style={{ height: '400px' }}>
        <Line data={winRateData} options={lineOptions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6" style={{ height: '350px' }}>
          <Bar data={oddsRangeData} options={barOptions} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6" style={{ height: '350px' }}>
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 dark:text-white">Recent Bets</h3>
        <div className="space-y-3">
          {history.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium dark:text-white">
                  {entry.bets.length} {entry.bets.length === 1 ? 'Bet' : 'Bets'} @ {entry.totalOdds.toFixed(2)}x
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${entry.won ? 'text-green-500' : 'text-red-500'}`}>
                  {entry.won ? '+' : ''}{formatCurrency(entry.actualReturn - entry.stake)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Staked: {formatCurrency(entry.stake)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
