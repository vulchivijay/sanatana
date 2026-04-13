/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, t as translate } from '@lib/i18n';
import { LANGUAGE_COOKIE_MAX_AGE_SECONDS, LANGUAGE_STORAGE_KEY } from '@lib/constants';
import storage from '@lib/storage';
import { useSearchParams, useRouter } from 'next/navigation';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, localeOverride?: string) => string;
  isLoading: boolean;
};

// Provide a safe default so server-side rendering or components rendered
// before the client provider mounts won't throw. The client provider will
// replace this value when it hydrates.
const defaultLocaleContext: LocaleContextType = {
  locale: DEFAULT_LOCALE,
  setLocale: () => { },
  t: (key: string, localeOverride?: string) =>
    String(translate(key, localeOverride ?? DEFAULT_LOCALE)),
  isLoading: true,
};

const LocaleContext = createContext<LocaleContextType>(defaultLocaleContext);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  // Start with loading state as true since we need to load namespace files
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Helper to load locale, persist it, ensure cookie, and refresh server render.
    async function applyLocale(lang: string | null) {
      if (!lang) return;
      console.debug('[LocaleProvider] applyLocale start', lang);
      setIsLoading(true);

      // Locale loading is now handled by useLocaleSection/context
      console.debug('[LocaleProvider] applyLocale loaded', lang);

      // Update React state so client components re-render with the new locale
      setTimeout(() => {
        setLocale(lang);
        setIsLoading(false);
      }, 0);

      // Persist to storage (localStorage abstraction may throw in some envs)
      try {
        storage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch (e) {
        // ignore storage errors
      }

      // Ensure a cookie exists so server-side rendering picks up the user's preference
      try {
        const cookieMatch = typeof document !== 'undefined' ? document.cookie.match(new RegExp(`${LANGUAGE_STORAGE_KEY}=([^;]+)`)) : null;
        if (!cookieMatch || cookieMatch[1] !== lang) {
          document.cookie = `${LANGUAGE_STORAGE_KEY}=${lang}; Path=/; Max-Age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
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
        const storedLang = storage.getItem(LANGUAGE_STORAGE_KEY);
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
  // Locale loading is now handled by useLocaleSection/context

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: (key: string, localeOverride?: string) =>
          String(translate(key, localeOverride ?? locale)),
        isLoading,
      }}
    >
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

