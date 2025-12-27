/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const timerRef = useRef<number | null>(null);
  const incRef = useRef<number | null>(null);
  const spinnerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (incRef.current) window.clearInterval(incRef.current);
      if (spinnerTimerRef.current) window.clearTimeout(spinnerTimerRef.current);
    };
  }, []);

  // Start progress when user clicks a same-origin link (capture phase)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      try {
        const target = e.target as HTMLElement;
        const anchor = target.closest && (target.closest('a') as HTMLAnchorElement | null);
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        // ignore external or hash-only links
        if (href.startsWith('http') && !href.startsWith(location.origin)) return;
        if (href.startsWith('#')) return;

        // start progress
        if (timerRef.current) window.clearTimeout(timerRef.current);
        if (incRef.current) window.clearInterval(incRef.current);
        if (spinnerTimerRef.current) window.clearTimeout(spinnerTimerRef.current);
        setVisible(true);
        setShowSpinner(false);
        setProgress(6);
        // show spinner if navigation takes longer than 600ms
        spinnerTimerRef.current = window.setTimeout(() => setShowSpinner(true), 600) as unknown as number;
        // slowly increment to simulate progress (faster increments)
        incRef.current = window.setInterval(() => {
          setProgress((p) => Math.min(90, p + 6 + Math.random() * 4));
        }, 150) as unknown as number;
      } catch (err) {
        // ignore
      }
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Complete progress when pathname changes (navigation finished)
  useEffect(() => {
    if (!visible) return;
    // set to 100%
    if (incRef.current) window.clearInterval(incRef.current);
    if (spinnerTimerRef.current) window.clearTimeout(spinnerTimerRef.current);
    // schedule state updates to avoid synchronous setState-in-effect
    setTimeout(() => {
      setShowSpinner(true);
      setProgress(100);
    }, 0);
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
      setShowSpinner(false);
    }, 350) as unknown as number;
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <div aria-hidden style={{ position: 'fixed', left: 0, top: 0, right: 0, height: 4, zIndex: 9999 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, rgb(86 86 86), rgb(75 46 46))', transition: 'width 180ms linear' }} />
      </div>
      {showSpinner && (
        <div aria-hidden style={{ position: 'fixed', right: 6, top: 6, zIndex: 10000 }}>
          <div style={{ width: 24, height: 24, borderRadius: 9999, border: '4px solid rgba(255,255,255,1)', borderTopColor: '#ff9933', animation: 'tp-spin 800ms linear infinite' }} />
        </div>
      )}
      <style>{`@keyframes tp-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
