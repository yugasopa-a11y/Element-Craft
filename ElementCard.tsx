import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, RotateCcw, Info } from 'lucide-react';
import { BASE_ELEMENTS, generateCombination } from './lib/elementData';
import { 
  loadGameState, 
  saveGameState, 
  resetGameState, 
  isElementDiscovered,
  addDiscoveredElement,
  type Element,
  type HistoryEntry 
} from './lib/storage';
import { Workspace } from './components/Workspace';
import { Inventory } from './components/Inventory';
import { HistoryLog } from './components/HistoryLog';
import { AchievementBadge } from './components/AchievementBadge';
import { DiscoveryAnimation } from './components/DiscoveryAnimation';

function App() {
  const [gameState, setGameState] = useState(() => loadGameState());
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [isCombining, setIsCombining] = useState(false);
  const [newDiscovery, setNewDiscovery] = useState<Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showInfo, setShowInfo] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [combinationError, setCombinationError] = useState<string | null>(null);
  
  // Initialize with base elements if first time
  useEffect(() => {
    if (gameState.discoveredElements.length === 0) {
      const initialState = {
        ...gameState,
        discoveredElements: BASE_ELEMENTS.map(el => ({
          ...el,
          discoveredAt: Date.now()
        })),
        totalDiscoveries: 4
      };
      setGameState(initialState);
      saveGameState(initialState);
    }
  }, []);
  
  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    if (gameState.discoveredElements.length > 0) {
      saveGameState(gameState);
    }
  }, [gameState]);
  
  const handleSelectElement = (element: Element) => {
    if (selectedElements.length >= 2) {
      setSelectedElements([element]);
    } else if (!selectedElements.some(e => e.name === element.name)) {
      setSelectedElements([...selectedElements, element]);
    }
    setCombinationError(null);
  };
  
  const handleRemoveElement = (index: number) => {
    setSelectedElements(selectedElements.filter((_, i) => i !== index));
    setCombinationError(null);
  };
  
  const handleClear = () => {
    setSelectedElements([]);
    setCombinationError(null);
  };
  
  const handleCombine = async () => {
    if (selectedElements.length !== 2 || isCombining) return;
    
    setIsCombining(true);
    setCombinationError(null);
    
    const [element1, element2] = selectedElements;
    const result = generateCombination(element1.name, element2.name);
    
    // Simulate API delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!result) {
      setCombinationError(`"${element1.name}" and "${element2.name}" cannot logically combine.`);
      setIsCombining(false);
      return;
    }
    
    // Check if already discovered
    const alreadyDiscovered = isElementDiscovered(gameState, result.name);
    
    if (!alreadyDiscovered) {
      // Add to discovered elements
      const newElement: Element = {
        ...result,
        parents: [element1.name, element2.name],
        discoveredAt: Date.now()
      };
      
      setNewDiscovery(newElement);
      
      setGameState(prevState => addDiscoveredElement(prevState, newElement, [element1.name, element2.name]));
      
      // Sync with server
      try {
        await fetch('/api/elements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: result.name,
            description: result.description,
            emoji: result.emoji,
            category: result.category,
            rarity: result.rarity,
            parents: [element1.name, element2.name]
          })
        });
      } catch (error) {
        console.error('Failed to sync with server:', error);
      }
    } else {
      // Just update the history
      const newHistory: HistoryEntry = {
        result: result.name,
        parents: [element1.name, element2.name],
        timestamp: Date.now()
      };
      setGameState(prevState => ({
        ...prevState,
        history: [newHistory, ...prevState.history].slice(0, 50)
      }));
      
      // Show message that it's already discovered
      setCombinationError(`You already discovered "${result.name}"!`);
    }
    
    setSelectedElements([]);
    setIsCombining(false);
  };
  
  const handleReset = () => {
    resetGameState();
    const initialState = {
      discoveredElements: BASE_ELEMENTS.map(el => ({
        ...el,
        discoveredAt: Date.now()
      })),
      combinations: [],
      history: [],
      totalDiscoveries: 4
    };
    setGameState(initialState);
    setSelectedElements([]);
    setSearchQuery('');
    setShowResetConfirm(false);
  };
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      <DiscoveryAnimation 
        element={newDiscovery} 
        onComplete={() => setNewDiscovery(null)} 
      />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-5xl"
              >
                🔮
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Element Craft
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Combine elements to discover the universe
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Discovery Counter */}
              <div className="text-right px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Discoveries</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {gameState.totalDiscoveries}
                </div>
              </div>
              
              {/* Achievements Badge */}
              <AchievementBadge totalDiscoveries={gameState.totalDiscoveries} />
              
              <div className="w-px h-10 bg-gray-300 dark:bg-gray-600" />
              
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="How to Play"
              >
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Toggle Theme"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title="Reset Progress"
              >
                <RotateCcw className="w-5 h-5 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">🎮</span>
                How to Play
              </h2>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">1</span>
                  <span className="pt-1">Start with 4 base elements: Water, Fire, Earth, Air</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">2</span>
                  <span className="pt-1">Click or drag 2 elements to the workspace</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">3</span>
                  <span className="pt-1">Click "Combine" to create new elements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">4</span>
                  <span className="pt-1">Discover all 171+ possible elements!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center font-bold">5</span>
                  <span className="pt-1">Some combinations may not work - experiment!</span>
                </li>
              </ul>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-8 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Let's Play! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Reset Confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Reset Progress?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This will delete all your discovered elements and progress. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Workspace and History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Combination Error */}
            <AnimatePresence>
              {combinationError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3"
                >
                  <span className="text-2xl">💡</span>
                  <span>{combinationError}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Workspace
              selectedElements={selectedElements}
              onCombine={handleCombine}
              onClear={handleClear}
              onRemoveElement={handleRemoveElement}
              onAddElement={handleSelectElement}
              isCombining={isCombining}
            />
            
            <HistoryLog history={gameState.history} />
          </div>
          
          {/* Right Column - Inventory */}
          <div>
            <Inventory
              elements={gameState.discoveredElements}
              onSelectElement={handleSelectElement}
              selectedElements={selectedElements}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
        <p className="mb-2">🔮 Combine elements to discover the universe • Built with AI-powered logic</p>
        <p className="text-xs opacity-60">171+ elements to discover • Endless combinations</p>
      </footer>
    </div>
  );
}

export default App;