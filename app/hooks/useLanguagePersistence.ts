/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE } from "../../lib/i18n";
import storage from "../../lib/storage";

const LANGUAGE_STORAGE_KEY = "sanatana_dharma_language";

export function useLanguagePersistence() {
  const [language, setLanguage] = useState<string>(DEFAULT_LOCALE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStoredLanguage, setHasStoredLanguage] = useState<boolean>(false);

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedLanguage = storage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLanguage) {
          setTimeout(() => setLanguage(storedLanguage), 0);
          setTimeout(() => setHasStoredLanguage(true), 0);
        } else {
          // No stored language — use the app default locale rather than
          // automatically switching to the browser language. This ensures
          // the UI respects `DEFAULT_LOCALE` unless the user has
          // explicitly chosen a different language.
          setTimeout(() => setLanguage(DEFAULT_LOCALE), 0);
          setTimeout(() => setHasStoredLanguage(false), 0);
        }
      } catch (e) {
        setTimeout(() => setLanguage(DEFAULT_LOCALE), 0);
      }
      setTimeout(() => setIsLoaded(true), 0);
    }
  }, []);

  // Save language to localStorage
  const saveLanguage = (lang: string) => {
    setLanguage(lang);
    try {
      storage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setHasStoredLanguage(true);
    } catch (e) {
      // ignore storage errors
    }
  };

  return { language, saveLanguage, isLoaded, hasStoredLanguage };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
