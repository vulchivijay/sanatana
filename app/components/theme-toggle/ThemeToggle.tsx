/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useTheme } from '../../context/theme-context';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="rounded-md! shadow-md inline-flex items-center bg-amber-300 hover:bg-amber-400 cursor-pointer"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
      onClick={toggle}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
          <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="2" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </button>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
