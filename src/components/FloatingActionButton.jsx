import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiMail, FiPhone, FiGithub, FiLinkedin, FiArrowUp, FiDownload } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';
import { Link } from 'react-router-dom';

const FloatingActionButton = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const startY = window.scrollY;
    // Calculate duration: longer for longer pages, but capped between 800ms and 2000ms
    const duration = Math.max(800, Math.min(startY / 3, 2000));
    const startTime = performance.now();

    // Easing function: easeInOutQuart for a very smooth start and end
    const easeInOutQuart = (t) => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuart(progress);
      
      window.scrollTo(0, startY * (1 - easeProgress));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const actions = [
    {
      icon: FiMail,
      label: 'Email',
      href: 'mailto:aravindrajaa03@gmail.com',
      color: 'from-purple-500 to-pink-500',
      external: true
    },
    {
      icon: FiPhone,
      label: 'Call',
      href: 'tel:9384605406',
      color: 'from-green-500 to-emerald-500',
      external: true
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      href: 'https://github.com/aravind7lee',
      color: 'from-gray-600 to-gray-800',
      external: true
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/aravind042',
      color: 'from-blue-500 to-blue-700',
      external: true
    },
    {
      icon: FiDownload,
      label: 'Resume',
      href: '/Aravind R-Updated-Resume.pdf',
      color: 'from-orange-500 to-red-500',
      download: true
    }
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className={`fixed bottom-20 sm:bottom-28 right-4 sm:right-6 z-40 p-2.5 sm:p-4 rounded-lg sm:rounded-2xl backdrop-blur-xl border shadow-2xl ${
              isDark
                ? 'bg-gray-900/80 border-white/10 text-white hover:bg-gray-800/80'
                : 'bg-white/80 border-gray-200/50 text-gray-900 hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FiArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        {/* Action Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-14 sm:bottom-20 right-0 flex flex-col gap-2 sm:gap-3"
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 400,
                        damping: 25
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: 10, 
                      scale: 0.5,
                      transition: { delay: (actions.length - index) * 0.03 }
                    }}
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3"
                  >
                    {/* Label */}
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap backdrop-blur-xl border shadow-lg ${
                        isDark
                          ? 'bg-gray-900/90 border-white/10 text-white'
                          : 'bg-white/90 border-gray-200/50 text-gray-900'
                      }`}
                    >
                      {action.label}
                    </motion.span>

                    {/* Action Button */}
                    {action.external ? (
                      <a
                        href={action.href}
                        target={action.download ? undefined : "_blank"}
                        rel={action.download ? undefined : "noopener noreferrer"}
                        download={action.download}
                        className={`p-2.5 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-2xl`}
                        aria-label={action.label}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    ) : (
                      <Link
                        to={action.href}
                        className={`p-2.5 sm:p-4 rounded-lg sm:rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-2xl`}
                        aria-label={action.label}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3 sm:p-4 rounded-lg sm:rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-white/10'
              : 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-200/50'
          }`}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          aria-label={isOpen ? 'Close menu' : 'Open quick actions'}
          aria-expanded={isOpen}
        >
          {/* Glow Effect - static, no infinite loop */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30"
            style={{ filter: 'blur(12px)', opacity: isOpen ? 0.6 : 0.2, transition: 'opacity 0.3s ease' }}
          />

          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10"
          >
            {isOpen ? (
              <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <FiPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </motion.div>

          {/* Ripple Effect */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white/30 rounded-2xl"
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Keyboard Shortcut */}
      <KeyboardShortcut onToggle={() => setIsOpen(prev => !prev)} />
    </>
  );
};

// Keyboard Shortcut Handler
const KeyboardShortcut = ({ onToggle }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'q' || e.key === 'Q') {
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          onToggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggle]);

  return null;
};

export default FloatingActionButton;
