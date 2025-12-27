"use client";
import { useEffect, useState } from 'react';

/**
 * Hook that resolves to true when it's safe to start loading non-critical assets.
 * Strategy:
 *  - If `document.readyState === 'complete'` -> true immediately
 *  - Otherwise wait for `requestIdleCallback` (preferred) or `window.load` / timeout fallback
 */
export default function useDeferAssets(): boolean {
  const [ready, setReady] = useState<boolean>(() => typeof document !== 'undefined' ? document.readyState === 'complete' : false);

  useEffect(() => {
    if (ready) return;
    if (typeof window === 'undefined') return;

    let idleId: number | null = null;
    const onLoad = () => setReady(true);

    if (document.readyState === 'complete') {
      setReady(true);
      return;
    }

    if ('requestIdleCallback' in (window as any)) {
      const w = window as any;
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      w.addEventListener('load', onLoad, { once: true });
      return () => {
        if (idleId != null) {
          try { (window as any).cancelIdleCallback(idleId); } catch (_) { }
        }
        (window as any).removeEventListener('load', onLoad);
      };
    }

    (window as any).addEventListener('load', onLoad, { once: true });
    const fallback = (globalThis as any).setTimeout(() => setReady(true), 2000);
    return () => {
      (window as any).removeEventListener('load', onLoad);
      (globalThis as any).clearTimeout(fallback);
    };
  }, [ready]);

  return ready;
}
