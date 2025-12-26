/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useT } from "../../hooks/useT";
import SVGComponent from "../waves/wave";
import Image from "next/image";
import Link from "next/link";

export default function MainSlider() {
  const t = useT();

  // Full width slider with video and auto-play
  const slides = t("home.slides") || [];
  const heroTopicsRaw = t("home.topics");
  const heroButtons = t("home.buttons") || { explore: 'Explore', learnMore: 'Learn More' };
  const heroSubtitles = Array.isArray(heroTopicsRaw)
    ? heroTopicsRaw
    : (heroTopicsRaw ? String(heroTopicsRaw).split(/\s*[,;]\s*/).filter(Boolean) : []);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const preloadedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-run slider unless paused (hover or touch)
  useEffect(() => {
    if (isPaused) return;
    autoRunRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (autoRunRef.current) clearInterval(autoRunRef.current);
    };
  }, [isPaused, slides.length]);

  // Preload all slide images once so returning to home shows images reliably
  useEffect(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    slides.forEach((s: any) => {
      try {
        const img = new window.Image();
        img.src = s.imgSrc || s.image || '';
      } catch (e) {
        // ignore
      }
    });
  }, [slides]);

  // Touch navigation handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(() => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const dx = touchEndX.current - touchStartX.current;
      if (Math.abs(dx) > 40) {
        if (dx > 0) prevSlide();
        else nextSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  }, []);

  const nextSlide = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prevSlide = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  return (
    <section
      className="main-slider gradient-background relative w-full md:h-full md:flex md:items-center md:justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd} >
      <div className="relative w-full md:min-h-[calc(100vh-90px)] md:flex md:items-center md:justify-center overflow-hidden">
        {slides.map((slide: any, idx: number) => (
          <div key={idx} className={`md:absolute md:top-0 w-full md:mx-auto md:w-6xl md:h-full flex-col md:flex-row md:items-center md:justify-center transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ pointerEvents: idx === current ? 'auto' : 'none', display: idx === current ? 'flex' : 'none' }}>
            {slide.placementImage === 'left' ? (
              <div className="relative md:absolute md:z-20 md:left-0 md:bottom-0 mx-auto w-80 md:w-1/3 md:min-h-[calc(100vh-120px)] md:aspect-video">
                <Image src={slide.imgSrc} fill alt={`Slide ${idx + 1}`} className="relative! md:absolute! object-contain" priority={idx === current} loading={idx === current ? 'eager' : 'lazy'} />
              </div>
            ) : ''}
            {slide.sankritTitle && heroSubtitles && (
              <div className={`slider-content relative md:absolute ${slide.placementImage === 'left' ? 'md:right-0' : 'md:left-0'} md:w-2/3 md:z-10`}>
                <p className="text-2xl/10! md:text-3xl/12! font-semibold!">{slide.sankritTitle}</p>
                <p>{slide.englishTitle}</p>
                <p>{slide.subtitle}</p>
                <div className="mt-10 flex flex-row gap-4">
                  <Link href="/scriptures/gita" className="button inline-block rounded-md! shadow-sm bg-amber-300 hover:bg-amber-400 no-underline">
                    {heroButtons.explore}
                  </Link>
                  <Link href="/stotrasmantras/shiva" className="button inline-block rounded-md! shadow-sm bg-white/75 hover:bg-white no-underline">
                    {heroButtons.learnMore}
                  </Link>
                </div>
              </div>)}
            {slide.placementImage === 'right' ? (
              <div className="relative md:absolute md:z-20 md:right-0 md:bottom-0 mx-auto w-80 md:w-1/3 md:min-h-[calc(100vh-120px)] md:aspect-video">
                <Image src={slide.imgSrc} fill alt={`Slide ${idx + 1}`} className="relative! md:absolute! object-contain" priority={idx === current} loading={idx === current ? 'eager' : 'lazy'} />
              </div>
            ) : ''}
          </div>
        ))}
        <button onClick={prevSlide} className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-amber-400 hover:bg-amber-200 no-underline rounded-md! shadow-md cursor-pointer">&#8592;</button>
        <button onClick={nextSlide} className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-amber-400 hover:bg-amber-200 no-underline rounded-md! shadow-md cursor-pointer">&#8594;</button>
      </div>
      <div className="slider-dots absolute z-20 left-0 bottom-10 w-full text-center flex justify-center gap-2">
        {slides.map((_: any, idx: number) => (
          <button
            key={idx}
            className={`rounded-md! bg-amber-400 border-2 ${idx === current ? ' border-black' : 'bg-white no-underline'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      <div className="hidden md:flex md:absolute md:z-0 md:left-0 md:bottom-0 md:w-full">
        <SVGComponent />
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
