/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useLocale } from '../context/locale-context';
import { t as serverT } from '../../lib/i18n';

export function useT() {
  const { locale } = useLocale();

  return (key: string) => {
    return serverT(key, locale);
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
