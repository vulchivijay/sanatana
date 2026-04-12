/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useState, useEffect, Fragment } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LazyImage from './lazyimage';

/* ── Types ── */
interface NavLink {
  href: string;
  label: string;
}

/* ── Section config — ordered as they should appear in the footer ── */
const SECTION_CONFIG: { key: string; icon: string; iconBg: string; basePath: string }[] = [
  { key: 'vedas', icon: '📕', iconBg: 'bg-gray-700', basePath: '/vedas' },
  { key: 'upanishads', icon: '📜', iconBg: 'bg-gray-600', basePath: '/upanishads' },
  { key: 'puranas', icon: '📖', iconBg: 'bg-gray-700', basePath: '/puranas' },
  // itihasa rendered separately via ItihasaColumn
  { key: 'philosophy', icon: '🧘', iconBg: 'bg-gray-600', basePath: '/philosophy' },
  { key: 'science', icon: '🔬', iconBg: 'bg-gray-700', basePath: '/vedic-philosophy' },
  { key: 'others', icon: '✨', iconBg: 'bg-gray-700', basePath: '' },
];

const INITIAL_VISIBLE = 5;

/* ── Normalize both array-based and object-based nav into a flat link list ── */
function normalizeNavLinks(nav: unknown, basePath: string): NavLink[] {
  if (Array.isArray(nav)) {
    return nav
      .filter((item: Record<string, unknown>) => item?.name && typeof item.name === 'string')
      .map((item: Record<string, unknown>) => ({
        href: `${basePath}/${(item.name as string).toLowerCase().replace(/\s+/g, '')}`,
        label: item.name as string,
      }));
  }
  if (nav && typeof nav === 'object') {
    return Object.entries(nav as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string')
      .map(([key, val]) => ({
        href: basePath ? `${basePath}/${key}` : `/${key}`,
        label: val as string,
      }));
  }
  return [];
}

/* ── Single nav column with optional "Show more / less" toggle ── */
function NavColumn({ title, links, icon, iconBg }: {
  title: string;
  links: NavLink[];
  icon: string;
  iconBg: string;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const normalize = (p?: string) => {
    if (!p) return '/';
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  if (!title || links.length === 0) return null;

  const hasMore = links.length > INITIAL_VISIBLE;
  const visible = expanded ? links : links.slice(0, INITIAL_VISIBLE);

  return (
    // 
    <div className="flex flex-col gap-1 bg-white rounded-xl shadow-xl p-3 animate-fadeInUp">
      <p className="mb-2 flex items-center text-md sm:text-base font-semibold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-xl">
        <span className={`inline-flex h-9 w-9 p-1.5 rounded-full shadow-lg mr-3 ${iconBg} text-md sm:text-base text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse`}>
          {icon}
        </span>
        {title}
      </p>
      <div className="mb-1 h-1 w-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-gradient-x" />
      {visible.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm transition-all duration-300 rounded-xl px-2 my-1 ${isActive(href) ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl animate-pulse' : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900'} animate-fadeIn`}
          onClick={e => { if (isActive(href)) e.preventDefault(); }}
        >
          {label}
        </Link>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="mt-1 flex items-center gap-1 px-2 text-md sm:text-base text-indigo-700 hover:text-pink-600 transition-all duration-300 cursor-pointer animate-fadeIn"
          aria-expanded={expanded}
        >
          {/* ${links.length - INITIAL_VISIBLE} */}
          {expanded ? 'Show less' : `Show more`}
          <svg
            className={`h-4 w-4 rounded transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ── Itihasa column — epics with collapsible sub-lists ── */
function ItihasaColumn({ section }: { section: Record<string, unknown> }) {
  const pathname = usePathname();
  const iconBg = SECTION_CONFIG[4].iconBg;
  const [expandedEpic, setExpandedEpic] = useState<string | null>(null);

  const normalize = (p?: string) => {
    if (!p) return '/';
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  if (!section || !Array.isArray(section.nav)) return null;

  const title = (section.title as string) || 'Epics';
  const epics = section.nav as Record<string, unknown>[];

  /* Derive a display name and sub-items for each epic entry */
  const epicEntries = epics.map((epic) => {
    const name = (epic.name as string) || (epic.chapters_list ? 'Bhagavad Gita' : 'Epic');
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const href = `/itihasa/${slug}`;

    // Collect sub-items from kandas, parvas (if object), or chapters_list
    const subNav: Record<string, string> =
      (epic.kandas as Record<string, string>) ||
      (epic.chapters_list as Record<string, string>) ||
      {};

    return { name, slug, href, subNav, hasSubItems: Object.keys(subNav).length > 0 };
  });

  return (
    // 
    <div className="flex flex-col gap-1 bg-white rounded-xl shadow-xl p-3 animate-fadeInUp">
      <p className="mb-2 flex items-center text-md sm:text-base font-semibold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-xl">
        <span className={`inline-flex h-9 w-9 p-1.5 rounded-full shadow-lg mr-3 ${iconBg} text-md sm:text-base text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse`}>
          ⚔️
        </span>
        {title}
      </p>
      <div className="mb-1 h-1 w-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-gradient-x" />
      {epicEntries.map(({ name, slug, href, subNav, hasSubItems }) => (
        <div key={slug} className="flex flex-col">
          <div className="flex items-center gap-1">
            <Link
              href={href}
              className={`text-sm transition-all duration-300 rounded-xl px-2 my-1 ${isActive(href) ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl animate-pulse' : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900'} animate-fadeIn`}
              onClick={e => { if (isActive(href)) e.preventDefault(); }}
            >
              {name}
            </Link>
            {hasSubItems && (
              <button
                type="button"
                onClick={() => setExpandedEpic(prev => prev === slug ? null : slug)}
                className="mt-1 inline-flex items-center justify-center rounded-xl h-6 w-6 text-indigo-700 hover:text-pink-600 hover:bg-indigo-100 transition-all duration-300 cursor-pointer"
                aria-expanded={expandedEpic === slug}
                aria-label={`Toggle ${name} sub-items`}
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${expandedEpic === slug ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
          {hasSubItems && expandedEpic === slug && (
            <div className="ml-2 mt-1 flex flex-col gap-1 border-l-2 border-indigo-200/40 pl-3">
              {Object.entries(subNav).map(([subKey, subLabel]) => {
                const subHref = `${href}/${subKey}`;
                return (
                  <Link
                    key={subKey}
                    href={subHref}
                    className={`text-sm transition-all duration-300 rounded-xl my-1 ${isActive(subHref) ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white shadow animate-pulse' : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900'}`}
                    onClick={e => { if (isActive(subHref)) e.preventDefault(); }}
                  >
                    {subLabel}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const shared = useLocaleSection('sharable-strings');
  const footer = shared?.footer || {};
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const normalize = (p?: string) => {
    if (!p) return '/';
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  return (
    <>
      <footer className="w-full relative bg-amber-600 overflow-hidden">
        <div className="hidden h-1 w-full bg-linear-to-r from-amber-600 via-amber-500 to-yellow-400" />
        {/* Decorative background blurs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="hidden absolute -left-32 -top-10 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/30 via-pink-200/30 to-amber-200/30 blur-3xl animate-pulse" />
          <div className="hidden absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-gradient-to-br from-pink-300/30 via-amber-200/30 to-indigo-300/30 blur-3xl animate-pulse" />
          <div className="hidden absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-b-full bg-gradient-to-r from-indigo-200/40 via-pink-100/40 to-amber-100/40 blur-2xl animate-pulse" />
          <div className="hidden absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" />
        </div>

        <div className="relative mx-auto max-w-7xl z-10">
          {/* ─── Hero CTA Section ─── */}
          <section className="content-wrapper text-center py-6 md:py-12">
            <div className="mx-auto max-w-xl rounded-md bg-white backdrop-blur-sm shadow-sm my-6 p-4">
              <h6 className="text-2xl/8 md:text-3xl/12 font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {footer.title}
              </h6>
            </div>

            <p className="mx-auto max-w-5xl text-md sm:text-base mt-6 px-4 leading-relaxed text-gray-200">
              {footer.quote} {footer.quotesource}
            </p>

            {/* CTA Buttons */}
            <div className="w-full text-center flex flex-col md:flex-row md:justify-center gap-4 my-6">
              <Link
                href="/contact"
                className="group relative md:inline-flex px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white text-md sm:text-base rounded-full shadow-md font-medium transition transform hover:-translate-y-0.5 no-underline overflow-hidden">
                <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {footer.contact || 'Contact'}
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/donate"
                className="group md:inline-flex px-6 py-3 bg-white/60 backdrop-blur-sm border border-amber-200 text-amber-700 text-md sm:text-base font-medium rounded-full shadow-sm hover:bg-white/60 transition transform hover:-translate-y-0.5 no-underline">
                <span className="flex items-center justify-center gap-2">
                  {footer.donate || 'Donate'}
                  <svg className="h-4 w-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
              </Link>
            </div>
          </section>

          {/* ─── Ornamental Divider ─── */}
          <div className="flex items-center justify-center gap-3 px-4">
            <div className="h-px flex-1 max-w-100 bg-linear-to-r from-transparent to-amber-200/60" />
            <span className="text-md sm:text-base text-gray-700" aria-hidden="true">✦</span>
            <div className="h-px flex-1 max-w-100 bg-linear-to-l from-transparent to-amber-200/60" />
          </div>

          {/* ─── Navigation Columns ─── */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
            <nav className="grid gap-6 sm:grid-cols-2 md:grid-cols-4" aria-label="Footer navigation">
              {SECTION_CONFIG.map(({ key, icon, iconBg, basePath: configBase }) => {
                const section = footer[key];
                if (!section || typeof section !== 'object') return null;
                const title = section.title || key;
                const bp = (typeof section.basePath === 'string')
                  ? (section.basePath as string)
                  : (configBase && String(configBase).length > 0 ? configBase : '');
                const links = normalizeNavLinks(section.nav, bp);

                // Insert ItihasaColumn after puranas
                return (
                  <Fragment key={key}>
                    <NavColumn
                      title={title}
                      links={links}
                      icon={icon}
                      iconBg={iconBg}
                    />
                    {key === 'puranas' && footer.itihasa && (
                      <ItihasaColumn key="itihasa" section={footer.itihasa} />
                    )}
                  </Fragment>
                );
              })}
            </nav>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="border-t border-gray-100">
            {/* Disclaimer + Socials */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 py-6">
              <div className="space-y-2">
                <small className="text-xs leading-relaxed text-gray-100">
                  {footer.disclaimer}<br />{footer.contentchange}
                </small>
              </div>
              <div className="text-center">
                {footer.shareMessage && (
                  <small className="text-xs text-gray-100">{footer.shareMessage}</small>
                )}
                <nav role="list" className="flex justify-center md:justify-end gap-1" aria-label="Social links">
                  <Link
                    role="listitem"
                    aria-label="Share this page on Facebook"
                    href={currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-3 px-2 sm:py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline"
                  >
                    <LazyImage src="/images/svg/facebook.svg" alt="facebook" width={25} height={25} className="inline-block" />
                  </Link>
                  <Link
                    role="listitem"
                    aria-label="Visit us on Instagram"
                    href="https://www.instagram.com/vulchivijay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-3 px-2 sm:py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline"
                  >
                    <LazyImage src="/images/svg/instagram.svg" alt="instagram" width={25} height={25} className="inline-block" />
                  </Link>
                  <Link
                    role="listitem"
                    aria-label="Share this page on X"
                    href={currentUrl ? `https://x.com/intent/tweet?url=${encodeURIComponent(currentUrl)}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-2 py-1 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(146,64,14,0.12)] no-underline"
                  >
                    <LazyImage src="/images/svg/x.svg" alt="x" width={25} height={25} className="inline-block" />
                  </Link>
                </nav>
              </div>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-4">
                  <Link href="/privacy-policy" className={`text-xs transition-colors duration-200 no-underline ${isActive('/privacy-policy') ? 'text-gray-100 underline' : 'text-gray-200 hover:text-gray-300'} `}>{footer.privacy}</Link>
                  <span className="text-gray-200">·</span>
                  <Link href="/terms-of-service" className={`text-xs transition-colors duration-200 no-underline ${isActive('/terms-of-service') ? 'text-gray-100 underline' : 'text-gray-200 hover:text-gray-300'} `}>{footer.terms}</Link>
                </div>
                <small className="text-xs text-gray-100">{footer.copyright}</small>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom ornamental bar */}
        <div className="h-1 w-full bg-linear-to-r from-gray-700 via-gray-500 to-gray-400" />
      </footer>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
