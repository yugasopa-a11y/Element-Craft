import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import type { HistoryEntry } from '../lib/storage';

interface HistoryLogProps {
  history: HistoryEntry[];
}

export function HistoryLog({ history }: HistoryLogProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-500" />
        Recent Discoveries
      </h2>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 dark:text-gray-500 py-4"
            >
              No discoveries yet. Start combining elements!
            </motion.div>
          ) : (
            history.map((entry, index) => (
              <motion.div
                key={entry.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {entry.parents[0]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {entry.parents[1]}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-bold text-green-600 dark:text-green-400 truncate">
                  {entry.result}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                  {formatTime(entry.timestamp)}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}