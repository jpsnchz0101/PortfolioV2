import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  isSystemDefault: boolean;
  toggleTheme: () => void;
  setExplicitTheme: (mode: ThemeMode) => void;
  resetToSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 1. Check local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jps_portfolio_theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      // 2. Default to system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark'; // Fallback / system dark
  });

  const [isSystemDefault, setIsSystemDefault] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('jps_portfolio_theme');
    }
    return true;
  });

  // Apply class and data-theme to HTML root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen to system theme changes if user hasn't overridden
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user is still using system default
      const hasStoredOverride = localStorage.getItem('jps_portfolio_theme');
      if (!hasStoredOverride) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setIsSystemDefault(false);
    localStorage.setItem('jps_portfolio_theme', nextTheme);
  };

  const setExplicitTheme = (mode: ThemeMode) => {
    setTheme(mode);
    setIsSystemDefault(false);
    localStorage.setItem('jps_portfolio_theme', mode);
  };

  const resetToSystemTheme = () => {
    localStorage.removeItem('jps_portfolio_theme');
    setIsSystemDefault(true);
    const systemIsLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(systemIsLight ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isSystemDefault,
        toggleTheme,
        setExplicitTheme,
        resetToSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
