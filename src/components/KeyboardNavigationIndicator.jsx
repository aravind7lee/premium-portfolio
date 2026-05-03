import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCommand, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';
import { useNavigate } from 'react-router-dom';

const KeyboardNavigationIndicator = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showIndicator, setShowIndicator] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts = [
    { key: 'H', action: 'Home', path: '/' },
    { key: 'A', action: 'About', path: '/about' },
    { key: 'P', action: 'Projects', path: '/projects' },
    { key: 'S', action: 'Skills', path: '/skills' },
    { key: 'C', action: 'Contact', path: '/contact' },
    { key: 'Q', action: 'Quick Actions', special: true },
    { key: 'T', action: 'Toggle Theme', special: true },
    { key: '?', action: 'Show Help', special: true },
    { key: 'ESC', action: 'Close Menu', special: true }
  ];

  useEffect(() => {
    // Show indicator on first visit
    const hasSeenIndicator = localStorage.getItem('hasSeenKeyboardIndicator');
    if (!hasSeenIndicator) {
      setTimeout(() => {
        setShowIndicator(true);
        localStorage.setItem('hasSeenKeyboardIndicator', 'true');
      }, 2000);

      setTimeout(() => {
        setShowIndicator(false);
      }, 8000);
    }

    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      // Don't trigger if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case 'h':
          e.preventDefault();
          navigate('/');
          break;
        case 'a':
          e.preventDefault();
          navigate('/about');
          break;
        case 'p':
          e.preventDefault();
          navigate('/projects');
          break;
        case 's':
          e.preventDefault();
          navigate('/skills');
          break;
        case 'c':
          e.preventDefault();
          navigate('/contact');
          break;
        case '?':
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;
        case 'escape':
          setShowHelp(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return (
    <>
      {/* Initial Indicator */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 z-40"
          >
            <motion.div
              className={`relative px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl max-w-sm ${
                isDark
                  ? 'bg-gray-900/90 border-white/10'
                  : 'bg-white/90 border-gray-200/50'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowIndicator(false)}
                className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-white/10 text-white/60'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                aria-label="Close"
              >
                <FiX className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
                >
                  <FiCommand className="w-5 h-5 text-white" />
                </motion.div>

                <div className="flex-1">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Keyboard Navigation
                  </h3>
                  <p className={`text-xs mb-3 ${
                    isDark ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    Use keyboard shortcuts to navigate faster!
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {shortcuts.slice(0, 5).map((shortcut) => (
                      <kbd
                        key={shortcut.key}
                        className={`px-2 py-1 rounded-lg text-xs font-mono ${
                          isDark
                            ? 'bg-white/10 text-white/80'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {shortcut.key}
                      </kbd>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowIndicator(false);
                      setShowHelp(true);
                    }}
                    className="mt-3 text-xs font-medium text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    View all shortcuts →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
            >
              <div className={`relative rounded-3xl backdrop-blur-xl border shadow-2xl overflow-hidden ${
                isDark
                  ? 'bg-gray-900/95 border-white/10'
                  : 'bg-white/95 border-gray-200/50'
              }`}>
                {/* Header */}
                <div className="relative px-8 py-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                        <FiCommand className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className={`text-2xl font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          Keyboard Shortcuts
                        </h2>
                        <p className={`text-sm ${
                          isDark ? 'text-white/60' : 'text-gray-600'
                        }`}>
                          Navigate faster with these shortcuts
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowHelp(false)}
                      className={`p-2 rounded-xl transition-colors ${
                        isDark
                          ? 'hover:bg-white/10 text-white/60'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      aria-label="Close"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Shortcuts List */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-2xl border ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-white/80' : 'text-gray-700'
                        }`}>
                          {shortcut.action}
                        </span>

                        <kbd className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold ${
                          shortcut.special
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                            : isDark
                            ? 'bg-white/10 text-white'
                            : 'bg-white text-gray-900 border border-gray-300'
                        }`}>
                          {shortcut.key}
                        </kbd>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer Note */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`mt-6 p-4 rounded-2xl border ${
                      isDark
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <p className={`text-sm ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      💡 <strong>Pro Tip:</strong> Press <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono">?</kbd> anytime to view this help menu
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      <motion.button
        onClick={() => setShowHelp(true)}
        className={`fixed bottom-6 left-6 z-40 p-3 rounded-xl backdrop-blur-xl border shadow-lg ${
          isDark
            ? 'bg-gray-900/80 border-white/10 text-white/60 hover:text-white'
            : 'bg-white/80 border-gray-200/50 text-gray-600 hover:text-gray-900'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <FiCommand className="w-5 h-5" />
      </motion.button>
    </>
  );
};

export default KeyboardNavigationIndicator;
