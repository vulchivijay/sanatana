/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, loadLocale } from '../../lib/i18n';
import storage from '../../lib/storage';
import { useSearchParams, useRouter } from 'next/navigation';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

// Provide a safe default so server-side rendering or components rendered
// before the client provider mounts won't throw. The client provider will
// replace this value when it hydrates.
const defaultLocaleContext: LocaleContextType = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
};

const LocaleContext = createContext<LocaleContextType>(defaultLocaleContext);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Schedule client flag to avoid synchronous setState inside effect
    setTimeout(() => setIsClient(true), 0);

    // Helper to load locale, persist it, ensure cookie, and refresh server render.
    async function applyLocale(lang: string | null) {
      if (!lang) return;
      try {
        await loadLocale(lang).catch(() => {});
      } catch (e) {
        // ignore load errors — fallback handled below
      }

      // Update React state so client components re-render with the new locale
      setTimeout(() => setLocale(lang), 0);

      // Persist to storage (localStorage abstraction may throw in some envs)
      try {
        storage.setItem("sanatana_dharma_language", lang);
      } catch (e) {
        // ignore storage errors
      }

      // Ensure a cookie exists so server-side rendering picks up the user's preference
      try {
        const cookieMatch = typeof document !== 'undefined' ? document.cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
        const maxAge = 60 * 60 * 24 * 365; // 1 year
        if (!cookieMatch || cookieMatch[1] !== lang) {
          document.cookie = `sanatana_dharma_language=${lang}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
          try { router.refresh(); } catch (e) { /* ignore refresh errors */ }
        }
      } catch (e) {
        // ignore cookie set errors
      }
    }

    // Decide which locale to apply: URL param -> persisted storage -> browser -> default
    (async () => {
      const urlLang = searchParams?.get("lang");
      if (urlLang) {
        await applyLocale(urlLang);
        return;
      }

      try {
        const storedLang = storage.getItem("sanatana_dharma_language");
        if (storedLang) {
          await applyLocale(storedLang);
          return;
        }
      } catch (e) {
        // ignore storage read errors
      }

      // Fallback to browser language if supported, otherwise default
      const supported = SUPPORTED_LOCALES;
      const browserLang = (typeof navigator !== 'undefined' ? (navigator?.language || '') : '').split('-')[0];
      if (browserLang && supported.includes(browserLang)) {
        await applyLocale(browserLang);
      } else {
        await applyLocale(DEFAULT_LOCALE);
      }
    })();
  }, [searchParams]);

  // Ensure the locale JSON is loaded into the client cache so
  // client components using `t(..., locale)` or `useT()` can
  // synchronously read translations after the async load completes.
  useEffect(() => {
    if (!locale) return;
    // fire-and-forget; caching happens inside `loadLocale`.
    try {
      loadLocale(locale).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, [locale]);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  // Return the context value (falls back to `defaultLocaleContext` on the
  // server). This prevents runtime errors during prerender while keeping the
  // client behaviour intact once the `LocaleProvider` hydrates.
  return useContext(LocaleContext);
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
