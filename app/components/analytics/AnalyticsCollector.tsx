/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect } from 'react';
import storage from '../../../lib/storage';
import { usePathname } from 'next/navigation';

export default function AnalyticsCollector() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // Only run client-side when configured to use mongo collector via NEXT_PUBLIC var
      if (process.env.NEXT_PUBLIC_ANALYTICS_BACKEND !== 'mongo') return;

      const path = pathname || window.location.pathname;
      const key = `analytics_posted:${path}`;

      // Post once per session (now persisted) for each path
      if (storage.getItem(key)) return;

      const payload = {
        path,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent || null,
        locale: navigator.language || null,
      };

      // fire-and-forget
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.ok) storage.setItem(key, String(Date.now()));
        })
        .catch(() => {
          /* ignore errors */
        });
    } catch (err) {
      // noop
    }
  }, [pathname]);

  return null;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
