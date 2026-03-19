import { motion } from 'framer-motion';
import { Trophy, Target, Star, Zap } from 'lucide-react';

interface AchievementsProps {
  totalDiscoveries: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export function Achievements({ totalDiscoveries }: AchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-discovery',
      name: 'First Steps',
      description: 'Discover your first element',
      icon: <Star className="w-5 h-5" />,
      unlocked: totalDiscoveries >= 1
    },
    {
      id: 'ten-elements',
      name: 'Apprentice',
      description: 'Discover 10 elements',
      icon: <Target className="w-5 h-5" />,
      unlocked: totalDiscoveries >= 10,
      progress: totalDiscoveries,
      target: 10
    },
    {
      id: 'fifty-elements',
      name: 'Alchemist',
      description: 'Discover 50 elements',
      icon: <Zap className="w-5 h-5" />,
      unlocked: totalDiscoveries >= 50,
      progress: totalDiscoveries,
      target: 50
    },
    {
      id: 'hundred-elements',
      name: 'Master',
      description: 'Discover 100 elements',
      icon: <Trophy className="w-5 h-5" />,
      unlocked: totalDiscoveries >= 100,
      progress: totalDiscoveries,
      target: 100
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Achievements
      </h2>
      
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: achievements.indexOf(achievement) * 0.1 }}
            className={`
              p-4 rounded-xl border-2 transition-all
              ${achievement.unlocked 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400' 
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg
                ${achievement.unlocked ? 'bg-yellow-400 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500'}
              `}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 dark:text-white">
                  {achievement.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </div>
                {achievement.progress !== undefined && achievement.target && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.min(achievement.progress, achievement.target)} / {achievement.target}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(Math.min(achievement.progress, achievement.target) / achievement.target) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  ✅
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}