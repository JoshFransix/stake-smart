import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveMatches } from '@stake-smart/hooks';
import type { Match } from '@stake-smart/api';
import clsx from 'clsx';
import { Button } from './Button';
interface LiveMatchesProps {
  onAddBet: (match: string, odds: number) => void;
}

export function LiveMatches({ onAddBet }: LiveMatchesProps) {
  const [selectedSport, setSelectedSport] = useState('soccer_epl');
  const { matches, loading, error, refetch } = useLiveMatches(selectedSport);

  const sports = [
    { key: 'soccer_epl', name: 'Premier League' },
    { key: 'soccer_spain_la_liga', name: 'La Liga' },
    { key: 'soccer_germany_bundesliga', name: 'Bundesliga' },
    { key: 'basketball_nba', name: 'NBA' },
  ];

  const formatMatchName = (match: Match, outcome: 'home' | 'away' | 'draw') => {
    if (outcome === 'draw') return `${match.home} vs ${match.away} - Draw`;
    const winner = outcome === 'home' ? match.home : match.away;
    return `${match.home} vs ${match.away} - ${winner} Win`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Live Matches
        </h2>
        <Button
          onClick={refetch}
          disabled={loading}
          variant="ghost"
          size="sm"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {sports.map((sport) => (
          <button
            key={sport.key}
            onClick={() => setSelectedSport(sport.key)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors',
              selectedSport === sport.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {sport.name}
          </button>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                   rounded-lg p-4 text-red-800 dark:text-red-200"
        >
          {error}
        </motion.div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-24"
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {!loading && matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {matches.slice(0, 5).map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                         rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {match.home} vs {match.away}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {match.sport} • {formatDate(match.commenceTime)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddBet(formatMatchName(match, 'home'), match.odds.home)}
                    className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300
                             hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm 
                             transition-colors duration-150 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="font-medium">{match.home}</div>
                    <div className="text-xs opacity-75">{match.odds.home.toFixed(2)}</div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddBet(formatMatchName(match, 'away'), match.odds.away)}
                    className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300
                             hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm 
                             transition-colors duration-150 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="font-medium">{match.away}</div>
                    <div className="text-xs opacity-75">{match.odds.away.toFixed(2)}</div>
                  </motion.button>

                  {match.odds.draw && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddBet(formatMatchName(match, 'draw'), match.odds.draw!)}
                      className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                               hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm 
                               transition-colors duration-150 border border-gray-200 dark:border-gray-600
                               col-span-2"
                    >
                      <div className="font-medium">Draw</div>
                      <div className="text-xs opacity-75">{match.odds.draw.toFixed(2)}</div>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && matches.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          No matches available at the moment
        </motion.div>
      )}
    </div>
  );
}
