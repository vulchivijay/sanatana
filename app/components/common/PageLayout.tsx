'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import StructuredData from '../structured-data/StructuredData';
import WordCount from '@components/wordcount';
import SimilarCategories from '@/app/components/SimilarCategories';

import Breadcrumbs from '../breadcrumbs';
type BreadcrumbItem = { label?: string; labelKey?: string; href?: string };

type Props = {
  metaKey?: string;
  title?: React.ReactNode;
  titleColor?: string;
  titleBorder?: string;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  locale?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function PageLayout(
  { metaKey,
    title,
    titleColor,
    titleBorder,
    description,
    breadcrumbs,
    className,
    children,
    locale
  }: Props) {

  const pathname = usePathname() || '/';
  const segments = pathname.split('/').filter(Boolean);
  const hasLocalePrefix = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(segments[0] || '') && segments.length > 1;
  const contentSegments = hasLocalePrefix ? segments.slice(1) : segments;
  const primarySegment = contentSegments[0] || '';
  const excludedPrimarySegments = new Set(['', 'about', 'contact', 'donate', 'privacy']);
  const hasPolicyOrPrivacySegment = contentSegments.some((segment) =>
    segment.includes('policy') || segment.includes('privacy')
  );
  const showSimilarCategories =
    !excludedPrimarySegments.has(primarySegment) && !hasPolicyOrPrivacySegment;

  const [panelOpen, setPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close panel on route change
  useEffect(() => {
    setPanelOpen(false);
  }, [pathname]);

  // Close panel on Escape key
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const togglePanel = useCallback(() => setPanelOpen((prev) => !prev), []);

  const wrapper = `${className || ' content-wrapper'}`;
  const h2Color = `${titleColor || 'from-pink-600 via-amber-500 to-rose-500'}`;
  const h2Border = `${titleBorder || 'border-pink-300'}`;
  return (
    <>
      <StructuredData metakey={metaKey ? metaKey : 'home'} />
      <main className={`px-3 ${wrapper} min-h-[80vh] shadow-sm border-l-2 border-r-2 border-amber-100 animate-fadeInUp`}>
        <div className="w-full text-md sm:text-base leading-relaxed font-normal">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-md sm:text-base leading-relaxed font-normal">
            <Breadcrumbs items={breadcrumbs} locale={locale} />
            <WordCount />
          </div>
          {/* Hero Header Section */}
          <div className="relative my-6 overflow-hidden text-md sm:text-base leading-relaxed font-normal animate-fadeInUp">
            <div className="px-4 py-5 text-md sm:text-base leading-relaxed font-normal">
              <div className="text-center text-md sm:text-base leading-relaxed font-normal">
                <div className="inline-block relative text-md sm:text-base leading-relaxed font-normal">
                  {title && (<h1 className={`bg-clip-text bg-gradient-to-r ${h2Color} px-8 py-2 text-lg sm:text-xl md:text-2xl font-extrabold drop-shadow-lg animate-gradient-x`}>
                    {title}
                  </h1>)}
                  <div className={`absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 ${h2Border} rounded-tl-3xl animate-fadeIn`}></div>
                  <div className={`absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 ${h2Border} rounded-br-3xl animate-fadeIn delay-100`}></div>
                </div>
              </div>
              {description && (
                <div className="max-w-3xl mx-auto text-md sm:text-base leading-relaxed font-normal pt-10 animate-fadeIn delay-200">
                  <p className="text-center text-rose-700 italic px-4 text-md sm:text-base leading-relaxed font-normal">
                    &ldquo;{description}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
          {children}
        </div>
      </main>
      {/* ─── Floating Similar-Categories Toggle ─── */}
      {isMounted && showSimilarCategories && (
        <>
          {/* Toggle tab — fixed right edge */}
          <button
            type="button"
            onClick={togglePanel}
            aria-label={panelOpen ? 'Close explore panel' : 'Open explore panel'}
            className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-2xl border-[#d8a25a]/60 px-1 py-3 bg-amber-500 shadow-[−4px_4px_20px_rgba(166,61,23,0.14)] transition-all duration-300 hover:shadow-[−6px_6px_24px_rgba(166,61,23,0.20)] focus:outline-none focus:ring-2 focus:ring-[#d97706]/50 cursor-pointer"
          >
            <span className="flex flex-col items-center gap-1 text-md leading-relaxed font-normal">
              <svg
                className={`h-5 w-5 text-[#ffffff] transition-transform duration-300 ${panelOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="uppercase text-[#ffffff] [writing-mode:vertical-lr] text-md sm:text-base leading-relaxed font-normal">
                Explore
              </span>
            </span>
          </button>

          {/* Backdrop overlay */}
          {panelOpen && (
            <div
              className="fixed inset-0 z-40 bg-[#5b2d12]/20 backdrop-blur-[2px] transition-opacity duration-300 text-md sm:text-base leading-relaxed font-normal"
              onClick={() => setPanelOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Slide-in panel */}
          <aside className={`fixed right-0 top-0 z-50 flex h-full w-85 max-w-[85vw] flex-col border-l border-[#d8a25a]/40 bg-linear-to-b from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] shadow-[−12px_0_40px_rgba(166,61,23,0.12)] transition-transform duration-300 ease-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-label="Explore related topics">
            {/* Panel header */}
            <div className="flex items-center justify-between border-[#d8a25a]/30 px-5 py-4 text-md sm:text-base leading-relaxed font-normal">
              <div className="flex items-center gap-2 text-md sm:text-base leading-relaxed font-normal">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7a2e1f] text-[#fff4df] text-md sm:text-base leading-relaxed font-normal">✦</span>
                <span className="uppercase text-[#7a2e1f] text-md sm:text-base leading-relaxed font-normal">Explore</span>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close explore panel"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-[#d8a25a]/40 bg-[#fffaf2] text-[#7a2e1f] transition-all duration-200 hover:bg-[#fde7c7] hover:shadow-[0_2px_8px_rgba(146,64,14,0.12)]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Accent bar */}
            <div className="h-0.5 w-full text-md sm:text-base leading-relaxed font-normal" />

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-5 text-md sm:text-base leading-relaxed font-normal">
              <SimilarCategories />
            </div>

            {/* Bottom ornament */}
            <div className="h-0.5 w-full text-md sm:text-base leading-relaxed font-normal" />
          </aside>
        </>
      )}
    </>
  );
}

