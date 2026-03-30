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
import { BarChart3, TrendingUp, TrendingDown, Coins, Percent } from 'lucide-react';
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
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold dark:text-white">Bet History Analytics</h2>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">Win Rate</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{winRate.toFixed(1)}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-purple-500 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">Total Staked</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(totalStaked)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-sky-500 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">Total Returns</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-sky-600 dark:text-sky-400">{formatCurrency(totalReturns)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 border-green-500 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            {netProfit >= 0
              ? <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
              : <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">Net Profit</span>
          </div>
          <div className={`text-2xl md:text-3xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm" style={{ height: '320px', minHeight: '280px' }}>
        <Line data={winRateData} options={lineOptions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm" style={{ height: '300px', minHeight: '260px' }}>
          <Bar data={oddsRangeData} options={barOptions} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm" style={{ height: '300px', minHeight: '260px' }}>
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 dark:text-white">Recent Bets</h3>
        <div className="space-y-2">
          {history.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 md:p-4 rounded-lg border-l-4 ${
                entry.won
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-500'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  entry.won ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {entry.won ? 'W' : 'L'}
                </div>
                <div className="min-w-0">
                  <div className="font-medium dark:text-white truncate">
                    {entry.bets.length} {entry.bets.length === 1 ? 'Bet' : 'Bets'} @ {entry.totalOdds.toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 pl-11 sm:pl-0">
                <div className={`font-bold tabular-nums ${
                  entry.won ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {entry.won ? '+' : ''}{formatCurrency(entry.actualReturn - entry.stake)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
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
