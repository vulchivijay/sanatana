/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useT } from '../../hooks/useT';

interface SectionGradientProps {
  gradient?: string;
}

export default function ShivaStotram({ gradient = "from-black-100 to-black-800" }: SectionGradientProps) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const t = useT();

  return (
    <section ref={ref} className={clsx("image-shiva-wrapper relative w-full min-h-[calc(100vh-90px)] flex flex-col md:flex-row items-center justify-end text-center overflow-hidden")} style={{ backgroundImage: `url(/images/lord-shiva.png)` }}>
      <div className={clsx("absolute inset-0 h-full z-0", `bg-linear-to-r ${gradient}`)} style={{ opacity: 0.85 }} />
      <div className={clsx("relative z-1 md:right-20 bg-white md:w-3xl md:transition-all md:rounded-2xl md:shadow-2xl p-6", inView ? "opacity-100" : "opacity-0")}>
        <h4 className="text-2xl/10! md:text-3xl/12! multi-text-color">
          {Array.isArray(t('home.shiva.heading')) ? (
            (t('home.shiva.heading') as string[]).map((s, i) => <span key={i}>{s}</span>)
          ) : (
            <span>{t('home.shiva.heading')}</span>
          )}
        </h4>
        <p className="text-md md:text-lg/6 mt-5">{t('home.shiva.transliteration')}</p>
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */