// src/components/ThemeToggle.jsx
import React, { useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';

// Compact theme toggle for mobile navigation
function ThemeToggleImpl({ className = '' }) {
  const { isDark, cycleTheme, currentTheme, isTransitioning } = useTheme();
  const reduced = useReducedMotion();
  const isToggling = useRef(false);

  // Smooth knob animation
  const x = useMotionValue(isDark ? 28 : 0);
  const xSpring = useSpring(x, { 
    stiffness: reduced ? 1000 : 600, 
    damping: reduced ? 50 : 30, 
    mass: 0.8 
  });

  React.useEffect(() => { 
    x.set(isDark ? 28 : 0); 
  }, [isDark, x]);

  const onToggle = () => {
    if (isToggling.current) return;
    isToggling.current = true;
    cycleTheme();
    setTimeout(() => (isToggling.current = false), reduced ? 50 : 300);
  };

  const accentPrimary = currentTheme?.vars?.['--accent-primary'] || '#6366f1';
  const accentSecondary = currentTheme?.vars?.['--accent-secondary'] || '#8b5cf6';

  return (
    <button
      onClick={onToggle}
      type="button"
      aria-label={`Toggle theme, current: ${currentTheme?.label || (isDark ? 'dark' : 'light')}`}
      aria-pressed={isDark}
      role="switch"
      className={`inline-flex items-center ${className}`}
      disabled={isTransitioning}
    >
      <div
        className="w-16 h-9 rounded-full p-1 cursor-pointer select-none relative overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))'
            : 'linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.04))',
          border: '1px solid var(--glass-border)',
          WebkitTapHighlightColor: 'transparent',
          willChange: 'transform',
          transform: 'translateZ(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Background glow */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: isDark
                ? `radial-gradient(600px circle at 20% 50%, ${accentPrimary}20, transparent 40%)`
                : `radial-gradient(600px circle at 80% 50%, ${accentPrimary}25, transparent 40%)`,
              filter: 'blur(6px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Track gradient */}
        <div 
          className="absolute inset-1 rounded-full"
          style={{
            background: isDark
              ? `linear-gradient(90deg, ${accentSecondary}15, ${accentPrimary}20)`
              : `linear-gradient(90deg, ${accentPrimary}10, ${accentSecondary}15)`,
            opacity: 0.6,
          }}
        />

        {/* Knob */}
        <motion.div
          style={{ x: xSpring }}
          whileTap={reduced ? undefined : { scale: 0.95 }}
          className="w-7 h-7 rounded-full shadow-lg flex items-center justify-center absolute top-1 left-1 z-10"
          animate={{
            backgroundColor: isDark ? 'var(--bg-secondary)' : '#ffffff',
            boxShadow: isDark 
              ? `0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px ${accentPrimary}30`
              : `0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px ${accentPrimary}20`,
            transition: { duration: reduced ? 0 : 0.3 },
          }}
        >
          {/* Icon transition */}
          <AnimatePresence initial={false} mode="wait">
            {isDark ? (
              <motion.span 
                key="moon"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8, rotate: -30 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: 30 }}
                transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
              >
                <FiMoon size={14} color={accentPrimary} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span 
                key="sun"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8, rotate: 30 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: -30 }}
                transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
              >
                <FiSun size={14} color="#f59e0b" strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Transition ripple */}
        {isTransitioning && !reduced && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ 
              background: `radial-gradient(circle, ${accentPrimary}40, transparent 70%)`,
            }}
          />
        )}
      </div>
    </button>
  );
}

const ThemeToggle = React.memo(ThemeToggleImpl);
export default ThemeToggle;