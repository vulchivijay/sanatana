/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import storage from '../../lib/storage';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    try {
      const stored = storage.getItem('sd_theme');
      const initial: Theme = (stored as Theme) || 'system';
      setTimeout(() => setThemeState(initial), 0);
    } catch (e) {
      setTimeout(() => setThemeState('system'), 0);
    }
  }, []);

  useEffect(() => {
    function apply(t: Theme) {
      const root = document.documentElement;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = t === 'dark' || (t === 'system' && prefersDark);

      // Keep compatibility with Tailwind's `dark` class while also toggling
      // explicit theme classes that control --theme-* variables.
      root.classList.remove('theme-dark', 'theme-light');
      if (isDark) {
        root.classList.add('dark');
        root.classList.add('theme-dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('theme-light');
      }
    }
    apply(theme);
    try {
      storage.setItem('sd_theme', theme);
    } catch (err) {
      // ignore
    }
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
  }

  function toggle() {
    setThemeState((s) => (s === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
