import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Wand2 } from 'lucide-react';
import type { Element } from '../lib/storage';
import { ElementCard } from './ElementCard';
import { useState, useRef } from 'react';

interface WorkspaceProps {
  selectedElements: Element[];
  onCombine: () => void;
  onClear: () => void;
  onRemoveElement: (index: number) => void;
  onAddElement: (element: Element) => void;
  isCombining: boolean;
}

export function Workspace({ 
  selectedElements, 
  onCombine, 
  onClear, 
  onRemoveElement,
  onAddElement,
  isCombining 
}: WorkspaceProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the workspace area
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragOver(false);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const elementData = e.dataTransfer.getData('application/json');
      if (elementData) {
        const element = JSON.parse(elementData) as Element;
        onAddElement(element);
      }
    } catch (error) {
      console.error('Failed to parse dropped element:', error);
    }
  };
  
  return (
    <div 
      ref={workspaceRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 min-h-[500px] flex flex-col relative overflow-hidden
        transition-all duration-300
        ${isDragOver ? 'ring-4 ring-purple-500 ring-opacity-50 bg-purple-50 dark:bg-purple-900/20' : ''}
      `}
    >
      {/* Background pattern when empty */}
      {selectedElements.length === 0 && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, #8B5CF6 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Workspace
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedElements.length}/2 elements selected
            </p>
          </div>
        </div>
        
        {selectedElements.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onClear}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <X className="w-5 h-5" />
            Clear All
          </motion.button>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="popLayout">
          {selectedElements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-gray-400 dark:text-gray-500 max-w-md"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <Wand2 className="w-24 h-24 mx-auto opacity-30" />
              </motion.div>
              <p className="text-2xl font-semibold mb-2 text-gray-600 dark:text-gray-300">
                Drag & Drop Elements Here
              </p>
              <p className="text-lg">
                Select 2 elements to combine them
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    👆
                  </div>
                  <span>Click from inventory</span>
                </div>
                <div className="text-gray-400">or</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    ✋
                  </div>
                  <span>Drag & drop</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {selectedElements.map((element, index) => (
                <motion.div
                  key={element.name}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 180, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative"
                >
                  <div className="absolute -top-3 -right-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveElement(index);
                      }}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ElementCard
                    element={element}
                    onClick={() => onRemoveElement(index)}
                    isSelected={true}
                  />
                </motion.div>
              ))}
              
              {selectedElements.length === 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCombine}
                    disabled={isCombining}
                    className={`
                      px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl
                      flex items-center gap-3
                      ${isCombining 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600'
                      }
                      text-white transition-all
                    `}
                  >
                    {isCombining ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="w-6 h-6" />
                        </motion.div>
                        Combining...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Combine!
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {selectedElements.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center mt-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Select one more element to combine</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}