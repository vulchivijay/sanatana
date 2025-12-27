/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useT } from '../../hooks/useT';

// Usage: <SectionImg imgSrc="/your-image.jpg"><h2>Title</h2><p>Content...</p></SectionImg>
interface SectionImgProps {
  gradient?: string;
}

export default function KrishnaStotramBgImg({ gradient = "from-blue-950 to-black-100" }: SectionImgProps) {
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
    <section ref={ref} className={clsx("image-krishna-wrapper relative w-full min-h-[calc(100vh-90px)] flex flex-col md:flex-row items-center justify-end md:justify-start text-center overflow-hidden")} style={{ opacity: 0.85, backgroundImage: `url(/images/lord-krishna.png)` }}>
      <div className={clsx("absolute inset-0 h-full z-0", `bg-gradient-to-r ${gradient}`)} style={{ opacity: 0.85 }} />
      <div className={clsx("relative z-1 md:left-20 bg-white md:w-3xl md:transition-all md:rounded-2xl md:shadow-2xl p-3", inView ? "opacity-100" : "opacity-0")}>
        <h6 className="text-2xl/10! md:text-3xl/12! multi-text-color">
          {Array.isArray(t('home.krishnaBg.heading')) ? (
            (t('home.krishnaBg.heading') as string[]).map((ln, i) => <span key={i}>{ln} </span>)
          ) : (
            <span>{t('home.krishnaBg.heading')}</span>
          )}
        </h6>
        <p>{t('home.krishnaBg.transliteration')}</p>
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
