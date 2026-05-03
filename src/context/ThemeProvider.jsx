// src/context/ThemeProvider.jsx
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Professional color palettes with proper contrast ratios and visual hierarchy
export const THEMES = [
  {
    id: 'midnight',
    label: 'Midnight Pro',
    icon: '🌙',
    category: 'Dark',
    preview: ['#0a0e1a', '#6366f1', '#8b5cf6'],
    description: 'Deep professional dark theme',
    vars: {
      // Text hierarchy
      '--color-text': '#f8fafc',
      '--color-text-rgb': '248, 250, 252',
      '--color-text-secondary': '#cbd5e1',
      '--color-text-muted': '#64748b',
      '--color-text-disabled': '#475569',
      
      // Backgrounds with proper depth
      '--bg-primary': '#0a0e1a',
      '--bg-secondary': '#0f172a',
      '--bg-tertiary': '#1e293b',
      '--bg-from': '#0a0e1a',
      '--bg-via': '#0f172a',
      '--bg-to': '#1e293b',
      
      // Glass morphism
      '--glass-bg': 'rgba(248, 250, 252, 0.03)',
      '--glass-border': 'rgba(248, 250, 252, 0.08)',
      '--glass-hover': 'rgba(248, 250, 252, 0.06)',
      
      // Panel system
      '--panel-bg': 'rgba(15, 23, 42, 0.8)',
      '--panel-border': 'rgba(99, 102, 241, 0.12)',
      '--panel-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      
      // Brand colors
      '--accent-primary': '#6366f1',
      '--accent-secondary': '#8b5cf6',
      '--accent-tertiary': '#06b6d4',
      '--accent-success': '#10b981',
      '--accent-warning': '#f59e0b',
      '--accent-error': '#ef4444',
      
      // Interactive states
      '--hover-bg': 'rgba(99, 102, 241, 0.1)',
      '--active-bg': 'rgba(99, 102, 241, 0.15)',
      '--focus-ring': 'rgba(99, 102, 241, 0.5)',
      
      // Navigation
      '--nav-bg': 'rgba(10, 14, 26, 0.85)',
      '--nav-border': 'rgba(248, 250, 252, 0.06)',
    },
    dark: true,
  },
  {
    id: 'daylight',
    label: 'Daylight Pro',
    icon: '☀️',
    category: 'Light',
    preview: ['#ffffff', '#6366f1', '#8b5cf6'],
    description: 'Clean professional light theme',
    vars: {
      // Text hierarchy
      '--color-text': '#0f172a',
      '--color-text-rgb': '15, 23, 42',
      '--color-text-secondary': '#334155',
      '--color-text-muted': '#64748b',
      '--color-text-disabled': '#94a3b8',
      
      // Backgrounds
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--bg-tertiary': '#f1f5f9',
      '--bg-from': '#ffffff',
      '--bg-via': '#f8fafc',
      '--bg-to': '#f1f5f9',
      
      // Glass morphism
      '--glass-bg': 'rgba(255, 255, 255, 0.7)',
      '--glass-border': 'rgba(15, 23, 42, 0.08)',
      '--glass-hover': 'rgba(15, 23, 42, 0.04)',
      
      // Panel system
      '--panel-bg': 'rgba(255, 255, 255, 0.9)',
      '--panel-border': 'rgba(99, 102, 241, 0.12)',
      '--panel-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      
      // Brand colors
      '--accent-primary': '#6366f1',
      '--accent-secondary': '#8b5cf6',
      '--accent-tertiary': '#06b6d4',
      '--accent-success': '#10b981',
      '--accent-warning': '#f59e0b',
      '--accent-error': '#ef4444',
      
      // Interactive states
      '--hover-bg': 'rgba(99, 102, 241, 0.08)',
      '--active-bg': 'rgba(99, 102, 241, 0.12)',
      '--focus-ring': 'rgba(99, 102, 241, 0.5)',
      
      // Navigation
      '--nav-bg': 'rgba(255, 255, 255, 0.9)',
      '--nav-border': 'rgba(15, 23, 42, 0.06)',
    },
    dark: false,
  },
  {
    id: 'slate',
    label: 'Slate Studio',
    icon: '🎨',
    category: 'Dark',
    preview: ['#0f1419', '#7c3aed', '#06b6d4'],
    description: 'Modern developer workspace',
    vars: {
      '--color-text': '#e2e8f0',
      '--color-text-rgb': '226, 232, 240',
      '--color-text-secondary': '#cbd5e1',
      '--color-text-muted': '#64748b',
      '--color-text-disabled': '#475569',
      
      '--bg-primary': '#0f1419',
      '--bg-secondary': '#1e293b',
      '--bg-tertiary': '#334155',
      '--bg-from': '#0f1419',
      '--bg-via': '#1e293b',
      '--bg-to': '#334155',
      
      '--glass-bg': 'rgba(226, 232, 240, 0.04)',
      '--glass-border': 'rgba(226, 232, 240, 0.08)',
      '--glass-hover': 'rgba(226, 232, 240, 0.06)',
      
      '--panel-bg': 'rgba(30, 41, 59, 0.85)',
      '--panel-border': 'rgba(124, 58, 237, 0.15)',
      '--panel-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      
      '--accent-primary': '#7c3aed',
      '--accent-secondary': '#06b6d4',
      '--accent-tertiary': '#8b5cf6',
      '--accent-success': '#10b981',
      '--accent-warning': '#f59e0b',
      '--accent-error': '#ef4444',
      
      '--hover-bg': 'rgba(124, 58, 237, 0.1)',
      '--active-bg': 'rgba(124, 58, 237, 0.15)',
      '--focus-ring': 'rgba(124, 58, 237, 0.5)',
      
      '--nav-bg': 'rgba(15, 20, 25, 0.9)',
      '--nav-border': 'rgba(226, 232, 240, 0.06)',
    },
    dark: true,
  },
  {
    id: 'ocean',
    label: 'Ocean Depth',
    icon: '🌊',
    category: 'Dark',
    preview: ['#0c1821', '#0ea5e9', '#06b6d4'],
    description: 'Deep blue professional theme',
    vars: {
      '--color-text': '#e0f2fe',
      '--color-text-rgb': '224, 242, 254',
      '--color-text-secondary': '#bae6fd',
      '--color-text-muted': '#7dd3fc',
      '--color-text-disabled': '#0284c7',
      
      '--bg-primary': '#0c1821',
      '--bg-secondary': '#164e63',
      '--bg-tertiary': '#0e7490',
      '--bg-from': '#0c1821',
      '--bg-via': '#164e63',
      '--bg-to': '#0e7490',
      
      '--glass-bg': 'rgba(224, 242, 254, 0.04)',
      '--glass-border': 'rgba(224, 242, 254, 0.1)',
      '--glass-hover': 'rgba(224, 242, 254, 0.06)',
      
      '--panel-bg': 'rgba(22, 78, 99, 0.8)',
      '--panel-border': 'rgba(14, 165, 233, 0.2)',
      '--panel-shadow': '0 25px 50px -12px rgba(6, 182, 212, 0.3)',
      
      '--accent-primary': '#0ea5e9',
      '--accent-secondary': '#06b6d4',
      '--accent-tertiary': '#0284c7',
      '--accent-success': '#10b981',
      '--accent-warning': '#f59e0b',
      '--accent-error': '#ef4444',
      
      '--hover-bg': 'rgba(14, 165, 233, 0.12)',
      '--active-bg': 'rgba(14, 165, 233, 0.18)',
      '--focus-ring': 'rgba(14, 165, 233, 0.5)',
      
      '--nav-bg': 'rgba(12, 24, 33, 0.9)',
      '--nav-border': 'rgba(224, 242, 254, 0.08)',
    },
    dark: true,
  },
  {
    id: 'forest',
    label: 'Forest Code',
    icon: '🌲',
    category: 'Dark',
    preview: ['#0f1b0f', '#22c55e', '#10b981'],
    description: 'Nature-inspired coding theme',
    vars: {
      '--color-text': '#ecfdf5',
      '--color-text-rgb': '236, 253, 245',
      '--color-text-secondary': '#d1fae5',
      '--color-text-muted': '#86efac',
      '--color-text-disabled': '#4ade80',
      
      '--bg-primary': '#0f1b0f',
      '--bg-secondary': '#14532d',
      '--bg-tertiary': '#166534',
      '--bg-from': '#0f1b0f',
      '--bg-via': '#14532d',
      '--bg-to': '#166534',
      
      '--glass-bg': 'rgba(236, 253, 245, 0.04)',
      '--glass-border': 'rgba(236, 253, 245, 0.1)',
      '--glass-hover': 'rgba(236, 253, 245, 0.06)',
      
      '--panel-bg': 'rgba(20, 83, 45, 0.8)',
      '--panel-border': 'rgba(34, 197, 94, 0.2)',
      '--panel-shadow': '0 25px 50px -12px rgba(16, 185, 129, 0.3)',
      
      '--accent-primary': '#22c55e',
      '--accent-secondary': '#10b981',
      '--accent-tertiary': '#059669',
      '--accent-success': '#16a34a',
      '--accent-warning': '#f59e0b',
      '--accent-error': '#ef4444',
      
      '--hover-bg': 'rgba(34, 197, 94, 0.12)',
      '--active-bg': 'rgba(34, 197, 94, 0.18)',
      '--focus-ring': 'rgba(34, 197, 94, 0.5)',
      
      '--nav-bg': 'rgba(15, 27, 15, 0.9)',
      '--nav-border': 'rgba(236, 253, 245, 0.08)',
    },
    dark: true,
  },
  {
    id: 'minimal',
    label: 'Minimal Light',
    icon: '⚪',
    category: 'Light',
    preview: ['#fafafa', '#18181b', '#71717a'],
    description: 'Ultra-clean minimal design',
    vars: {
      '--color-text': '#18181b',
      '--color-text-rgb': '24, 24, 27',
      '--color-text-secondary': '#3f3f46',
      '--color-text-muted': '#71717a',
      '--color-text-disabled': '#a1a1aa',
      
      '--bg-primary': '#fafafa',
      '--bg-secondary': '#f4f4f5',
      '--bg-tertiary': '#e4e4e7',
      '--bg-from': '#fafafa',
      '--bg-via': '#f4f4f5',
      '--bg-to': '#e4e4e7',
      
      '--glass-bg': 'rgba(255, 255, 255, 0.8)',
      '--glass-border': 'rgba(24, 24, 27, 0.06)',
      '--glass-hover': 'rgba(24, 24, 27, 0.03)',
      
      '--panel-bg': 'rgba(255, 255, 255, 0.95)',
      '--panel-border': 'rgba(24, 24, 27, 0.08)',
      '--panel-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      
      '--accent-primary': '#18181b',
      '--accent-secondary': '#71717a',
      '--accent-tertiary': '#a1a1aa',
      '--accent-success': '#22c55e',
      '--accent-warning': '#f59e0b',
      '--accent-error': '#ef4444',
      
      '--hover-bg': 'rgba(24, 24, 27, 0.05)',
      '--active-bg': 'rgba(24, 24, 27, 0.08)',
      '--focus-ring': 'rgba(24, 24, 27, 0.3)',
      
      '--nav-bg': 'rgba(250, 250, 250, 0.95)',
      '--nav-border': 'rgba(24, 24, 27, 0.06)',
    },
    dark: false,
  },
];

const ThemeContext = createContext();
const THEME_KEY = 'portfolio-theme-pro';
const TRANSITION_DURATION = 600;

function getSystemPreference() {
  if (typeof window === 'undefined') return 'midnight';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnight' : 'daylight';
}

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && THEMES.find(t => t.id === stored)) return stored;
  } catch {}
  return getSystemPreference();
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const transitionRef = useRef(null);
  const previewRef = useRef(null);

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const activeTheme = previewId ? THEMES.find(t => t.id === previewId) || currentTheme : currentTheme;

  const applyThemeVars = useCallback((theme, animate = true) => {
    const root = document.documentElement;

    if (animate) {
      setIsTransitioning(true);
      root.classList.add('theme-switching');
      clearTimeout(transitionRef.current);
      transitionRef.current = setTimeout(() => {
        root.classList.remove('theme-switching');
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }

    // Apply all CSS variables
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Set dark mode class and data attribute
    if (theme.dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme.id);
  }, []);

  const setTheme = useCallback((id, animate = true) => {
    const theme = THEMES.find(t => t.id === id);
    if (!theme || id === themeId) return;
    
    try { 
      localStorage.setItem(THEME_KEY, id); 
    } catch {}
    
    setThemeId(id);
    setPreviewId(null); // Clear any preview
    applyThemeVars(theme, animate);
  }, [themeId, applyThemeVars]);

  // Preview theme on hover (no persist)
  const previewTheme = useCallback((id) => {
    if (id === themeId) return; // Don't preview current theme
    
    const theme = THEMES.find(t => t.id === id);
    if (!theme) return;
    
    setPreviewId(id);
    clearTimeout(previewRef.current);
    applyThemeVars(theme, false);
  }, [themeId, applyThemeVars]);

  // Cancel preview and restore current theme
  const cancelPreview = useCallback(() => {
    if (!previewId) return;
    
    setPreviewId(null);
    clearTimeout(previewRef.current);
    previewRef.current = setTimeout(() => {
      applyThemeVars(currentTheme, false);
    }, 50); // Small delay to prevent flicker
  }, [previewId, currentTheme, applyThemeVars]);

  // Legacy toggle for backward compatibility
  const cycleTheme = useCallback(() => {
    const darkThemes = THEMES.filter(t => t.dark);
    const lightThemes = THEMES.filter(t => !t.dark);
    
    if (currentTheme.dark) {
      // Switch to first light theme
      setTheme(lightThemes[0]?.id || 'daylight');
    } else {
      // Switch to first dark theme
      setTheme(darkThemes[0]?.id || 'midnight');
    }
  }, [currentTheme, setTheme]);

  // Apply theme on mount
  useEffect(() => {
    applyThemeVars(currentTheme, false);
  }, []); // eslint-disable-line

  // System preference listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        const stored = localStorage.getItem(THEME_KEY);
        if (!stored) {
          setTheme(e.matches ? 'midnight' : 'daylight', true);
        }
      } catch {}
    };
    
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setTheme]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        const theme = THEMES.find(t => t.id === e.newValue);
        if (theme && e.newValue !== themeId) {
          setThemeId(e.newValue);
          applyThemeVars(theme, true);
        }
      }
    };
    
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [themeId, applyThemeVars]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      clearTimeout(transitionRef.current);
      clearTimeout(previewRef.current);
    };
  }, []);

  const value = {
    // Current state
    theme: themeId,
    themeId,
    currentTheme,
    activeTheme,
    themes: THEMES,
    isDark: currentTheme.dark,
    
    // Preview state
    previewId,
    isPreviewActive: !!previewId,
    
    // Transition state
    isTransitioning,
    
    // Actions
    setTheme,
    cycleTheme,
    previewTheme,
    cancelPreview,
    
    // Utilities
    getThemeById: (id) => THEMES.find(t => t.id === id),
    getThemesByCategory: (category) => THEMES.filter(t => t.category === category),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

// Theme utilities
export const themeUtils = {
  isDarkTheme: (themeId) => THEMES.find(t => t.id === themeId)?.dark || false,
  getThemeAccent: (themeId) => THEMES.find(t => t.id === themeId)?.vars['--accent-primary'] || '#6366f1',
  getThemePreview: (themeId) => THEMES.find(t => t.id === themeId)?.preview || ['#000', '#6366f1', '#8b5cf6'],
};