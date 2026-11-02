/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { usePathname } from 'next/navigation';
import { useLocale } from '@app/context/locale-context';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LazyImage from './lazyimage';
import ThemeToggle from './ThemeToggle';

const LanguageDropdown = dynamic(() => import("./language-dropdown"), { ssr: false });

/* ── Types ── */
interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];  // sub-items (kandas, chapters, etc.)
}

interface NavSection {
  key: string;
  title: string;
  basePath: string;
  items: NavItem[];
}

/* ── Route mapping (JSON key → actual route prefix) ── */
const ROUTE_MAP: Record<string, string> = {
  // map logical keys to routes
  philosophy: '/vedic-philosophy',
  science: '/vedic-science',
};

/* ── Section ordering & icons ── */
const SECTION_ORDER = ['vedas', 'upanishads', 'puranas', 'itihasa', 'philosophy', 'science'];
const AVAILABLE_VEDIC_SCIENCE_SLUGS = new Set(['astronomy', 'mathematics', 'medicine']);
const SECTION_ICONS: Record<string, string> = {
  vedas: '📕',
  upanishads: '📜',
  puranas: '📖',
  itihasa: '⚔️',
  philosophy: '🧘',
  science: '🔬',
};

/* ── Normalize header JSON into ordered NavSection[] ── */
function buildNavSections(header: Record<string, unknown>): NavSection[] {
  const sections: NavSection[] = [];

  for (const key of SECTION_ORDER) {
    const section = header[key];
    if (!section || typeof section !== 'object') continue;

    const sec = section as Record<string, unknown>;
    const title = (sec.title as string) || key;
    const basePath = (sec.basePath as string) || ROUTE_MAP[key] || `/${key}`;
    const nav = sec.nav;

    const items: NavItem[] = [];

    if (Array.isArray(nav)) {
      // Array nav (vedas, itihasa)
      for (const entry of nav) {
        if (!entry || typeof entry !== 'object') continue;
        const e = entry as Record<string, unknown>;
        const name = (e.name as string) || (e.chapters_list ? 'Bhagavad Gita' : '');
        if (!name) continue;
        let slug = name.toLowerCase().replace(/\s+/g, '-');
        // Special-case: exported route for Bhagavad Gita uses 'bhagavadgita' (no hyphen)
        if (slug === 'bhagavad-gita' || /\bbhagavad\b/.test(slug) && /gita/.test(slug)) {
          slug = 'bhagavadgita';
        }
        const href = `${basePath}/${slug}`;

        // Collect sub-items
        const subNav: Record<string, string> =
          (e.kandas as Record<string, string>) ||
          (e.chapters_list as Record<string, string>) ||
          {};
        const children: NavItem[] = Object.entries(subNav).map(([subKey, subLabel]) => ({
          href: `${href}/${subKey}`,
          label: subLabel,
        }));

        items.push({ href, label: name, children: children.length > 0 ? children : undefined });
      }
    } else if (nav && typeof nav === 'object') {
      // Object nav (upanishads, puranas, philosophy, science)
      for (const [slug, label] of Object.entries(nav as Record<string, unknown>)) {
        if (typeof label !== 'string') continue;
        if (key === 'science' && !AVAILABLE_VEDIC_SCIENCE_SLUGS.has(slug)) continue;
        items.push({ href: `${basePath}/${slug}`, label });
      }
    }

    if (items.length > 0) {
      sections.push({ key, title, basePath, items });
    }
  }
  return sections;
}

/* ── Desktop dropdown item (inline sub-list, no flyout) ── */
function DesktopNavItem({ item, isActive, onToggleSub, isSubOpen }: {
  item: NavItem;
  isActive: (h: string) => boolean;
  onToggleSub: (href: string) => void;
  isSubOpen: boolean;
}) {
  const submenuPos = 'right-full mr-2';
  const itemActive = isActive(item.href) || (item.children && item.children.some(ch => isActive(ch.href)));
  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        className={`group/item flex items-center gap-4 px-6 py-3 whitespace-nowrap transition-all duration-300 ${itemActive ? 'bg-linear-to-r from-indigo-100 via-pink-100 to-rose-50 text-indigo-900 font-semibold' : 'text-gray-600 hover:bg-linear-to-r hover:from-indigo-100 hover:via-pink-100 hover:to-rose-50 hover:text-indigo-900 hover:shadow-xl'}`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-indigo-400/20 to-pink-400/20 text-sm text-indigo-700 transition-colors duration-200 group-hover/item:bg-linear-to-br group-hover/item:from-indigo-600 group-hover/item:to-pink-600 group-hover/item:text-white shadow-md">
          ◈
        </span>
        <span className="text-sm transition-all duration-300 tracking-wide">{item.label}</span>
      </Link>
    );
  }

  // Has children → click chevron to expand inline sub-list
  return (
    <div className="group" onMouseEnter={() => onToggleSub(item.href)} onMouseLeave={() => onToggleSub(item.href)}>
      <div className={`flex items-center justify-between gap-3 px-4 py-2 transition-all duration-200 rounded-xl ${itemActive ? 'bg-linear-to-r from-indigo-100 via-pink-100 to-rose-50' : 'hover:bg-linear-to-r hover:from-indigo-100 hover:via-pink-100 hover:to-rose-50 hover:shadow-lg'}`}>
        <Link href={item.href} className="flex items-center gap-3 flex-1 px-2 whitespace-nowrap">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm transition-colors duration-200 ${isSubOpen ? 'bg-linear-to-br from-indigo-600 to-pink-600 text-white shadow-lg' : 'bg-linear-to-br from-indigo-400/20 to-pink-400/20 text-indigo-700'}`}>
            ◈
          </span>
          <span className={`text-sm font-semibold transition-colors duration-200 ${itemActive ? 'text-indigo-700' : 'text-gray-700'}`}>
            {item.label}
          </span>
        </Link>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSub(item.href); }}
          className="p-2 rounded-xl hover:bg-indigo-100 hover:shadow transition-colors cursor-pointer"
          aria-expanded={isSubOpen}
          aria-label={`Toggle ${item.label} sub-items`}
        >
          <svg
            className={`h-4 w-4 text-indigo-600 transition-transform duration-300 ${isSubOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Flyout submenu — opens RTL when dropdown anchored to right */}
      {isSubOpen && (
        <div className={`${submenuPos} absolute top-0 w-max min-w-48 bg-linear-to-br from-white/90 to-indigo-50 rounded-2xl shadow-xl p-3 space-y-2 z-30 transform transition-all duration-300 ${isSubOpen ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none -translate-x-1'}`}>
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-transform duration-200 hover:bg-linear-to-r hover:from-indigo-100 hover:via-pink-100 hover:to-rose-50 hover:-translate-x-1 hover:text-indigo-900 hover:shadow-lg ${isActive(child.href) ? 'bg-linear-to-r from-indigo-200 via-pink-200 to-rose-100 text-indigo-900 font-semibold' : 'text-gray-700'}`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-indigo-400 to-pink-400 shrink-0" />
              <span className="text-sm whitespace-nowrap font-medium">{child.label}</span>
            </Link>
          ))}
        </div>
      )
      }
    </div >
  );
}

/* ── Desktop dropdown for a section ── */
function DesktopDropdown({ section, isActive }: {
  section: NavSection;
  isActive: (h: string) => boolean;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [openSubItem, setOpenSubItem] = useState<string | null>(null);
  const icon = SECTION_ICONS[section.key] || '✨';

  const sectionActive = section.items.some(item => isActive(item.href) || (item.children && item.children.some(ch => isActive(ch.href))));

  // Reset open sub-item when dropdown closes (mouse leaves)
  const handleMouseLeave = () => { setOpenSubItem(null); };

  const toggleSub = (href: string) => {
    setOpenSubItem(prev => prev === href ? null : href);
  };

  return (
    <div ref={triggerRef} className="relative group" onMouseLeave={handleMouseLeave}>
      <Link href={section.basePath} className={`flex items-center gap-1 px-1 py-1 rounded-md text-sm cursor-pointer transition-all duration-200 hover:bg-white/50 ${sectionActive ? 'text-primary-700 font-semibold' : 'text-gray-900 hover:text-primary-600'}`}>
        <span className="text-sm">{icon}</span>
        {section.title}
        <svg className="ml-0.5 h-3.5 w-3.5 text-amber-500 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {/* Dropdown panel - always anchor to right so submenus fly left */}
      <div className={`absolute pt-3 w-max min-w-48 max-h-[80vh] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-20 right-0 origin-top-right`}>

        <div className="overflow-y-auto max-h-[75vh] rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="h-1 w-full bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
          <div className="py-2">
            {section.items.map((item) => {
              // Special-case: show `itihasa` sublists inline as a toggle inside the panel
              if (section.key === 'itihasa') {
                const childOpen = openSubItem === item.href;
                const itemActive = isActive(item.href) || (item.children && item.children.some(ch => isActive(ch.href)));
                return (
                  <div key={item.href} className="px-3">
                    <div className={`flex items-center justify-between gap-3 py-2 px-3 rounded-xl transition-all duration-300 ${itemActive ? 'bg-linear-to-r from-indigo-100 via-pink-100 to-rose-50 shadow-lg' : 'hover:bg-linear-to-r hover:from-indigo-100 hover:via-pink-100 hover:to-rose-50 hover:shadow'} `}>
                      <Link href={item.href} className={`flex-1 text-sm ${itemActive ? 'text-indigo-800' : 'text-gray-700 hover:text-indigo-900'}`}>
                        {item.label}
                      </Link>
                      {item.children && item.children.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleSub(item.href)}
                          className="p-2 rounded-xl hover:bg-indigo-100 hover:shadow transition-colors"
                          aria-expanded={childOpen}
                          aria-label={`Toggle ${item.label} sub-items`}
                        >
                          <svg className={`h-4 w-4 text-indigo-600 transition-transform duration-300 ${childOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {item.children && childOpen && (
                      <div className="mt-2 ml-4 pl-3 pr-2 pb-2 border-l-2 border-indigo-200/40 space-y-1 bg-white/70 rounded-xl shadow-inner">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${isActive(child.href) ? 'bg-linear-to-r from-indigo-200 via-pink-200 to-rose-100 text-indigo-900 font-semibold shadow' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-900'}`}
                          >
                            <span className="inline-block h-2 w-2 mr-2 rounded-full bg-linear-to-br from-indigo-400 to-pink-400 align-middle" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <DesktopNavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  onToggleSub={toggleSub}
                  isSubOpen={openSubItem === item.href}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile collapsible sub-sections ── */
function MobileNavSection({ section, isActive, onNavigate }: {
  section: NavSection;
  isActive: (h: string) => boolean;
  onNavigate: () => void;
}) {
  const icon = SECTION_ICONS[section.key] || '✨';
  const [expanded, setExpanded] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  return (
    <div className="mt-2">
      {/* Section header — tap to toggle (desktop-like styling) */}
      <div className="w-full flex items-center gap-2 rounded-xl bg-white px-3 py-2 mb-2 border border-gray-100 shadow-sm">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-200 to-pink-200 text-sm text-indigo-800">{icon}</span>
        <Link href={section.basePath} onClick={onNavigate} className="flex-1 text-sm text-gray-900">
          {section.title}
        </Link>
        <button
          type="button"
          onClick={() => { setExpanded(prev => !prev); setExpandedChild(null); }}
          className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-expanded={expanded}
          aria-label={`Toggle ${section.title} items`}
        >
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Items (styled similar to desktop dropdown panel) */}
      {expanded && (
        <div className="ml-0 pl-1 pr-1 flex flex-col gap-2">
          {section.items.map((item) => {
            const itemActive = isActive(item.href) || (item.children && item.children.some(ch => isActive(ch.href)));
            return (
              <div key={item.href} className="">
                <div className={`flex items-center justify-between gap-3 py-2 px-3 rounded-xl transition-all duration-200 ${itemActive ? 'bg-linear-to-r from-indigo-100 via-pink-100 to-rose-50 shadow-lg' : 'hover:bg-linear-to-r hover:from-indigo-50 hover:via-pink-50 hover:to-rose-50'}`}>
                  <Link href={item.href} className={`flex-1 text-sm font-medium ${itemActive ? 'text-indigo-800' : 'text-gray-700'}`} onClick={onNavigate}>
                    {item.label}
                  </Link>

                  {item.children && item.children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedChild(prev => prev === item.href ? null : item.href)}
                      className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                      aria-expanded={expandedChild === item.href}
                      aria-label={`Toggle ${item.label} sub-items`}
                    >
                      <svg className={`h-4 w-4 transition-transform duration-200 ${expandedChild === item.href ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sub-items (desktop-like rounded list) */}
                {item.children && expandedChild === item.href && (
                  <div className="mt-2 ml-4 pr-2 pb-2 border-l-2 border-indigo-100/40 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 rounded-lg transition-all duration-150 ${isActive(child.href) ? 'bg-linear-to-r from-indigo-200 via-pink-200 to-rose-100 text-indigo-900 font-semibold shadow' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-900'}`}
                        onClick={onNavigate}
                      >
                        <span className="inline-block h-2 w-2 mr-2 rounded-full bg-linear-to-br from-indigo-400 to-pink-400 align-middle" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Default fallback values ── */
const defaultSiteTitle = 'Sanātana Dharma';

export default function Header() {
  // Responsive logo width state
  const [logoWidth, setLogoWidth] = useState(50);
  useEffect(() => {
    function handleResize() {
      setLogoWidth(window.innerWidth < 640 ? 50 : 45);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  const sharable = useLocaleSection('sharable-strings');
  const siteTitle = sharable?.sitetitle || defaultSiteTitle;
  const headerData = (sharable?.header || {}) as Record<string, unknown>;
  const navSections = buildNavSections(headerData);

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };
  const isActive = useCallback((href: string) => {
    const np = normalize(pathname);
    const nh = normalize(href);
    return np === nh || np.startsWith(nh + "/");
  }, [pathname]);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Click outside to close mobile drawer
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!headerRef.current || (e.target && headerRef.current.contains(e.target as Node))) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="p-2 md:p-1 text-sm text-center font-semibold text-transparent bg-clip-text bg-linear-to-r from-green-600 via-orange-600 to-blue-700 drop-shadow-xl">I Love Shiva. I love Rama. I Love Krishna. Bharatha matha ki jai. I Love Bharat. </div>
      <div className="h-px w-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400" />
      <div className="flex items-center justify-between px-3 lg:px-6 py-1 shadow-2xl">
        {/* ─── Logo & Title ─── */}
        <div>
          <Link href="/" className="flex items-center gap-1 group">
            <span className="relative flex items-center justify-center">
              <LazyImage
                src="/images/logo.png"
                alt="Sanatanadharmam Logo"
                width={logoWidth}
                height={40}
                className="md:flex"
              />
            </span>
            <span className="text-3xl leading-[0.95] tracking-[0.05em]! font-semibold md:text-4xl text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
              {siteTitle}
            </span>
          </Link>
        </div>

        {/* ─── Desktop Nav ─── */}
        <nav className="hidden md:flex items-center gap-3" aria-label="Main navigation">
          {navSections.map((section) => (
            <DesktopDropdown key={section.key} section={section} isActive={isActive} />
          ))}
          <div className="border-l border-transparent flex items-center gap-3">
            <LanguageDropdown />
          </div>
          {/* ─── <ThemeToggle /> ─── */}
        </nav>

        {/* ─── Mobile Toggle ─── */}
        <div className="flex items-center md:hidden gap-3">
          <LanguageDropdown />
          {/* ─── <ThemeToggle /> ─── */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center rounded-xl p-1.5 sd-nav-icon-btn transition-all duration-200 focus:outline-none"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 32 32" stroke="currentColor" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 8l16 16M8 24L24 8" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h24M4 16h24M4 24h24" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      {open && (
        <div className="md:hidden relative z-50 mt-1 overflow-hidden rounded-b-2xl border-t border-white/10 bg-white/30 backdrop-blur-md shadow-lg animate-fade-in-down">
          <div className="h-px w-full bg-linear-to-r from-primary-700 via-primary-500 to-primary-400" />
          <div className="flex flex-col gap-1 py-3 px-3 max-h-[70vh] overflow-y-auto">
            {navSections.map((section) => (
              <MobileNavSection
                key={section.key}
                section={section}
                isActive={isActive}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
          <div className="h-px w-full bg-linear-to-r from-primary-400 via-primary-500 to-primary-700" />
        </div>
      )}
    </header>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
