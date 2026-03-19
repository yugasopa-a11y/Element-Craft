import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap } from 'lucide-react';
import type { Element } from '../lib/storage';

interface DiscoveryAnimationProps {
  element: Element | null;
  onComplete: () => void;
}

// Particle component for explosion effect
function Particle({ delay, x, y, color }: { delay: number; x: number; y: number; color: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
      animate={{ 
        scale: [0, 1, 0], 
        opacity: [1, 1, 0],
        x: [0, x],
        y: [0, y]
      }}
      transition={{ 
        delay, 
        duration: 1.5,
        times: [0, 0.5, 1]
      }}
      className={`absolute w-4 h-4 rounded-full ${color}`}
    />
  );
}

// Floating sparkle around the element
function FloatingSparkle({ delay, angle, distance }: { delay: number; angle: number; distance: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 360]
      }}
      transition={{ 
        delay,
        duration: 2,
        repeat: Infinity,
        repeatDelay: 0.5
      }}
      className="absolute"
      style={{
        left: `calc(50% + ${Math.cos(angle) * distance}px)`,
        top: `calc(50% + ${Math.sin(angle) * distance}px)`
      }}
    >
      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
    </motion.div>
  );
}

// Confetti particle
function Confetti({ delay }: { delay: number }) {
  const colors = ['bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const rotation = Math.random() * 360;
  const xEnd = (Math.random() - 0.5) * 400;
  const yEnd = (Math.random() - 0.5) * 400;
  
  return (
    <motion.div
      initial={{ 
        scale: 0, 
        opacity: 1, 
        x: 0, 
        y: 0,
        rotate: 0
      }}
      animate={{ 
        scale: [0, 1, 0.5, 0],
        opacity: [1, 1, 0.5, 0],
        x: [0, xEnd],
        y: [0, yEnd],
        rotate: [0, rotation, rotation + 360]
      }}
      transition={{ 
        delay,
        duration: 2.5,
        ease: 'easeOut'
      }}
      className={`absolute w-3 h-3 ${color}`}
    />
  );
}

// Ring effect
function Ring({ delay, size, color }: { delay: number; size: number; color: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ 
        scale: [0, size],
        opacity: [0.8, 0]
      }}
      transition={{ 
        delay,
        duration: 1.5,
        ease: 'easeOut'
      }}
      className={`absolute inset-0 rounded-full border-4 ${color}`}
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    />
  );
}

export function DiscoveryAnimation({ element, onComplete }: DiscoveryAnimationProps) {
  if (!element) return null;
  
  const isLegendary = element.rarity === 'legendary';
  const isRare = element.rarity === 'rare';
  
  // Generate confetti
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: 0.3 + (i * 0.02)
  }));
  
  // Generate particles
  const particles = [
    { x: -100, y: -80, color: 'bg-purple-500' },
    { x: 100, y: -80, color: 'bg-pink-500' },
    { x: -100, y: 80, color: 'bg-blue-500' },
    { x: 100, y: 80, color: 'bg-yellow-500' },
    { x: 0, y: -120, color: 'bg-green-500' },
    { x: 0, y: 120, color: 'bg-red-500' },
    { x: -140, y: 0, color: 'bg-indigo-500' },
    { x: 140, y: 0, color: 'bg-teal-500' },
  ];
  
  // Generate floating sparkles
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: 0.5 + (i * 0.15),
    angle: (i / 8) * Math.PI * 2,
    distance: 120
  }));
  
  return (
    <AnimatePresence>
      {element && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden"
        >
          {/* Confetti */}
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((c) => (
              <Confetti key={c.id} delay={c.delay} />
            ))}
          </div>
          
          {/* Explosion particles */}
          <div className="absolute pointer-events-none">
            {particles.map((p, i) => (
              <Particle 
                key={i} 
                delay={0.2 + (i * 0.05)} 
                x={p.x} 
                y={p.y} 
                color={p.color} 
              />
            ))}
          </div>
          
          {/* Expanding rings */}
          <div className="absolute pointer-events-none">
            <Ring delay={0.3} size={2} color="border-purple-400" />
            <Ring delay={0.5} size={3} color="border-pink-400" />
            <Ring delay={0.7} size={4} color="border-blue-400" />
          </div>
          
          {/* Main card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl z-10 overflow-hidden"
          >
            {/* Background glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className={`absolute inset-0 rounded-3xl -z-10 ${
                isLegendary 
                  ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500' 
                  : isRare
                  ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400'
              }`}
              style={{ filter: 'blur(40px)' }}
            />
            
            {/* Floating sparkles around element */}
            <div className="relative h-48 mb-6">
              {sparkles.map((s) => (
                <FloatingSparkle
                  key={s.id}
                  delay={s.delay}
                  angle={s.angle}
                  distance={s.distance}
                />
              ))}
              
              {/* Main element emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.3, 1],
                  rotate: [0, 10, -10, 5, 0]
                }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.8,
                  times: [0, 0.3, 0.5, 0.7, 1]
                }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="text-9xl drop-shadow-2xl"
                >
                  {element.emoji}
                </motion.div>
                
                {/* Glow behind emoji */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className={`absolute inset-0 -z-10 rounded-full ${
                    isLegendary
                      ? 'bg-yellow-400'
                      : isRare
                      ? 'bg-blue-400'
                      : 'bg-purple-400'
                  }`}
                  style={{ filter: 'blur(20px)' }}
                />
              </motion.div>
            </div>
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Title */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                className="flex items-center justify-center gap-3 mb-3"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-7 h-7 text-yellow-500" />
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  New Discovery!
                </h3>
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-7 h-7 text-yellow-500" />
                </motion.div>
              </motion.div>
              
              {/* Element name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-4xl font-bold text-gray-800 dark:text-white mb-3"
              >
                {element.name}
              </motion.div>
              
              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-5"
              >
                {element.description}
              </motion.div>
              
              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="flex items-center justify-center gap-3"
              >
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  isLegendary
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    : isRare
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                }`}>
                  {element.category}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 ${
                  isLegendary
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    : isRare
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                }`}>
                  {isLegendary && <Zap className="w-4 h-4" />}
                  {element.rarity}
                </div>
              </motion.div>
              
              {/* Continue button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={onComplete}
                className="mt-6 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Continue Exploring! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
