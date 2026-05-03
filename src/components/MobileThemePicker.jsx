// src/components/MobileThemePicker.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';

const PALETTE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

function MobileThemeSwatch({ theme, isActive, onSelect, reduced }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(theme.id)}
      aria-label={`${theme.label} theme`}
      className="relative outline-none cursor-pointer flex flex-col items-center gap-1"
      style={{ padding: '8px' }}
      whileHover={reduced ? {} : { scale: 1.1 }}
      whileTap={reduced ? {} : { scale: 0.9 }}
    >
      {/* Large touch-friendly color circle */}
      <div 
        className="w-12 h-12 rounded-full relative overflow-hidden"
        style={{
          background: theme.preview[0],
          boxShadow: isActive 
            ? `0 0 0 3px ${theme.preview[1]}80, 0 4px 12px ${theme.preview[1]}40`
            : '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${theme.preview[1]}80 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${theme.preview[2]}60 0%, transparent 60%)`,
          }}
        />
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-white"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Theme emoji only */}
      <span style={{
        fontSize: '12px',
        color: isActive ? theme.preview[1] : 'var(--color-text-muted)',
        transition: 'color 0.2s ease',
      }}>
        {theme.icon}
      </span>
    </motion.button>
  );
}

export default function MobileThemePicker({ className = '' }) {
  const { 
    themeId, 
    themes, 
    setTheme, 
    currentTheme,
    isTransitioning 
  } = useTheme();
  
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const toggle = useCallback(() => setOpen(s => !s), []);
  const close = useCallback(() => setOpen(false), []);

  const handleSelect = useCallback((id) => {
    setTheme(id);
    setOpen(false);
  }, [setTheme]);

  // Close handlers
  useEffect(() => {
    if (!open) return;
    
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    
    const onOutside = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        close();
      }
    };
    
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [open, close]);

  const panelVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: -20,
    },
    visible: {
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0, 
      scale: 0.9, 
      y: -10,
      transition: { duration: reduced ? 0 : 0.15 },
    },
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Mobile trigger button */}
      <motion.button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Theme picker"
        aria-expanded={open}
        className="relative flex items-center gap-2 p-2 rounded-lg outline-none cursor-pointer"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          transition: 'all 0.2s ease',
          minWidth: '44px', // Touch-friendly minimum
          minHeight: '44px',
        }}
        whileHover={reduced ? {} : { scale: 1.05 }}
        whileTap={reduced ? {} : { scale: 0.95 }}
      >
        {/* Current theme dot */}
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.preview[1]}, ${currentTheme.preview[2]})`,
            boxShadow: `0 0 8px ${currentTheme.preview[1]}60`,
          }}
        >
          <span style={{ fontSize: '10px' }}>{currentTheme.icon}</span>
        </div>

        {/* Transition indicator */}
        {isTransitioning && !reduced && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ background: `radial-gradient(circle, ${currentTheme.preview[1]}30, transparent)` }}
          />
        )}
      </motion.button>

      {/* Mobile theme panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="mobile-theme-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 mt-2 z-[99999]"
            style={{
              width: '280px',
              maxWidth: '90vw',
              borderRadius: '20px',
              padding: '16px',
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Mobile header */}
            <div className="mb-4 text-center">
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: 0,
                letterSpacing: '0.5px',
              }}>
                Choose Theme
              </h3>
            </div>

            {/* Mobile grid - 3 columns, larger touch targets */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              justifyItems: 'center',
            }}>
              {themes.map((theme) => (
                <MobileThemeSwatch
                  key={theme.id}
                  theme={theme}
                  isActive={themeId === theme.id}
                  onSelect={handleSelect}
                  reduced={reduced}
                />
              ))}
            </div>

            {/* Mobile footer */}
            <div className="mt-4 pt-3 border-t text-center" style={{
              borderColor: 'var(--glass-border)',
            }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
              }}>
                Tap to switch theme
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}