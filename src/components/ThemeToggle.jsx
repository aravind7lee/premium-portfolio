// src/components/ThemeToggle.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';

/**
 * ThemeToggle (two-state)
 * - Default: light
 * - Click toggles between light <-> dark
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, cycleTheme, isDark } = useTheme();

  // two-state knob X (same geometry as before)
  const knobX = theme === 'dark' ? 28 : 0;
  const Icon = theme === 'dark' ? FiMoon : FiSun;

  return (
    <button
      onClick={() => cycleTheme()}
      aria-label={`Toggle theme, current: ${theme}`}
      title={`Theme: ${theme}`}
      className={`inline-flex items-center ${className}`}
    >
      <div
        className="w-16 h-9 rounded-full p-1 cursor-pointer select-none relative"
        style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <motion.div
          layout
          initial={false}
          animate={{ x: knobX }}
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          whileTap={{ scale: 0.96 }}
          className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center absolute top-1 left-1"
          style={{
            background: isDark ? '#0b1220' : '#fff',
            boxShadow: isDark ? '0 6px 18px rgba(142,55,235,0.12)' : '0 6px 18px rgba(0,0,0,0.08)'
          }}
        >
          <Icon style={{ color: isDark ? '#8E37EB' : '#111827' }} />
        </motion.div>
      </div>
    </button>
  );
}
