// src/context/ThemeProvider.jsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const THEME_KEY = 'theme'; // allowed values: 'dark' | 'light'
const TRANSITION_MS = 300;

/** Normalize any stored/passed value to 'dark' or 'light' */
function normalizeTheme(t) {
  return t === 'dark' ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return normalizeTheme(stored);
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStoredTheme());

  const applyTheme = useCallback((t) => {
    const resolved = normalizeTheme(t);

    // brief transition helper (same as before)
    try {
      document.documentElement.classList.add('theme-transition');
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
        document.body.classList.remove('theme-transition');
      }, TRANSITION_MS);
    } catch (e) {
      // ignore
    }

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // set + persist (always store a normalized value)
  const setTheme = useCallback(
    (next) => {
      const normalized = normalizeTheme(next);
      try {
        localStorage.setItem(THEME_KEY, normalized);
      } catch {}
      setThemeState(normalized);
      applyTheme(normalized);
    },
    [applyTheme]
  );

  // cycleTheme now toggles only between 'light' and 'dark'
  const cycleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    // apply stored theme once on mount
    applyTheme(theme);

    // sync across tabs (normalize any incoming value)
    function onStorage(e) {
      if (e.key === THEME_KEY) {
        const newTheme = normalizeTheme(e.newValue);
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    }
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
    // run only once (we intentionally don't depend on applyTheme/theme to avoid repeated runs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
