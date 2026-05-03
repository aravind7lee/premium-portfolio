// src/components/ThemePicker.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';

const PALETTE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const CHECK_ICON = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function CompactThemeSwatch({ theme, isActive, onSelect, onPreview, onPreviewEnd, reduced }) {
  const handleMouseEnter = () => onPreview(theme.id);
  const handleMouseLeave = () => onPreviewEnd();

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(theme.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      aria-label={`${theme.label} theme`}
      className="relative group outline-none cursor-pointer"
      style={{
        padding: '6px',
        borderRadius: '12px',
        background: isActive ? `${theme.preview[1]}15` : 'transparent',
        border: isActive ? `1.5px solid ${theme.preview[1]}40` : '1.5px solid transparent',
        transition: 'all 0.2s ease',
      }}
      whileHover={reduced ? {} : { scale: 1.05 }}
      whileTap={reduced ? {} : { scale: 0.95 }}
    >
      {/* Color preview circle */}
      <div 
        className="w-8 h-8 rounded-full relative overflow-hidden"
        style={{
          background: theme.preview[0],
          boxShadow: isActive 
            ? `0 0 0 2px ${theme.preview[1]}60, 0 2px 8px ${theme.preview[1]}30`
            : '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${theme.preview[1]}70 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${theme.preview[2]}50 0%, transparent 60%)`,
          }}
        />
        
        {/* Active check */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-white"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
          >
            {CHECK_ICON}
          </motion.div>
        )}
      </div>

      {/* Compact label */}
      <div className="mt-1 text-center">
        <span style={{
          fontSize: '9px',
          fontWeight: 600,
          color: isActive ? theme.preview[1] : 'var(--color-text-muted)',
          display: 'block',
          lineHeight: 1.2,
        }}>
          {theme.icon}
        </span>
      </div>
    </motion.button>
  );
}

export default function ThemePicker({ className = '' }) {
  const { 
    themeId, 
    themes, 
    setTheme, 
    previewTheme, 
    cancelPreview, 
    currentTheme,
    isPreviewActive,
    isTransitioning 
  } = useTheme();
  
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const toggle = useCallback(() => setOpen(s => !s), []);
  
  const close = useCallback(() => {
    setOpen(false);
    if (isPreviewActive) cancelPreview();
  }, [isPreviewActive, cancelPreview]);

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
      scale: 0.9, 
      y: -10,
    },
    visible: {
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0, 
      scale: 0.95, 
      y: -5,
      transition: { duration: reduced ? 0 : 0.15 },
    },
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Compact trigger button */}
      <motion.button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Theme picker"
        aria-expanded={open}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg outline-none cursor-pointer group"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          transition: 'all 0.2s ease',
        }}
        whileHover={reduced ? {} : { scale: 1.02 }}
        whileTap={reduced ? {} : { scale: 0.98 }}
      >
        {/* Icon */}
        <span style={{ color: 'var(--accent-primary)' }}>
          {PALETTE_ICON}
        </span>

        {/* Current theme dot */}
        <div 
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.preview[1]}, ${currentTheme.preview[2]})`,
            boxShadow: `0 0 4px ${currentTheme.preview[1]}80`,
          }}
        />

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

      {/* Compact theme panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="theme-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 mt-2 z-[99999]"
            style={{
              width: '200px',
              borderRadius: '16px',
              padding: '12px',
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Compact header */}
            <div className="mb-3 text-center">
              <h3 style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: 0,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                Themes
              </h3>
            </div>

            {/* Compact grid - 3 columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              justifyItems: 'center',
            }}>
              {themes.map((theme) => (
                <CompactThemeSwatch
                  key={theme.id}
                  theme={theme}
                  isActive={themeId === theme.id}
                  onSelect={handleSelect}
                  onPreview={previewTheme}
                  onPreviewEnd={cancelPreview}
                  reduced={reduced}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}