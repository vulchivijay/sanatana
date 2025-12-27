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
      // Avoid calling setState synchronously inside an effect — schedule it.
      setTimeout(() => setReady(true), 0);
      return;
    }

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      w.addEventListener('load', onLoad, { once: true });
      return () => {
        if (idleId != null) {
          try { w.cancelIdleCallback?.(idleId); } catch (_) { }
        }
        w.removeEventListener('load', onLoad);
      };
    }

    w.addEventListener('load', onLoad, { once: true });
    const fallback = globalThis.setTimeout(() => setReady(true), 2000);
    return () => {
      w.removeEventListener('load', onLoad);
      globalThis.clearTimeout(fallback);
    };
  }, [ready]);

  return ready;
}
