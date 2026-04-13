"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleNamespaceObject } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';

interface SimilarCategoriesProps {
  title?: string;
  maxItems?: number;
  excludeCurrent?: boolean;
}

const INITIAL_VISIBLE_LINKS = 5;
const AVAILABLE_VEDIC_SCIENCE_SLUGS = new Set(['astronomy', 'mathematics', 'medicine']);

type LinkItem = { key: string; label: string; href: string };
type CategoryItem = { key: string; title: string; links: LinkItem[] };

type CategoryMode = 'array-name' | 'object-nav' | 'itihasa';

const CATEGORY_CONFIG: Record<string, { basePath: string; mode: CategoryMode }> = {
  vedas: { basePath: '/vedas', mode: 'array-name' },
  upanishads: { basePath: '/upanishads', mode: 'object-nav' },
  puranas: { basePath: '/puranas', mode: 'object-nav' },
  itihasa: { basePath: '/itihasa', mode: 'itihasa' },
  philosophy: { basePath: '/philosophy', mode: 'object-nav' },
  science: { basePath: '/vedic-philosophy', mode: 'object-nav' },
  others: { basePath: '', mode: 'object-nav' },
  explore: { basePath: '/explore', mode: 'object-nav' }
};
// Helper to get explore subpages
function getExploreLinks(locale: string): Promise<LinkItem[]> {
  // This function should list all explore subpage JSON files and return LinkItems
  // For now, hardcode a few known ones; ideally, this would be dynamic
  const explorePages = [
    { key: 'temples-in-india', label: 'Temples in India', href: '/explore/temples-in-india' },
    { key: 'shakti-peethas', label: 'Shakti Peethas', href: '/explore/shakti-peethas' },
    { key: 'religion-conversion', label: 'Religion Conversion', href: '/explore/religion-conversion' },
    { key: 'usa-strategies', label: 'USA Strategies', href: '/explore/usa-strategies' },
    { key: 'world-transformation', label: 'World Transformation', href: '/explore/world-transformation' }
  ];
  return Promise.resolve(explorePages);
}

function normalizeHref(href?: string) {
  if (!href) return '#';
  let out = String(href);
  if (!out.startsWith('/')) out = '/' + out;
  out = out.replace(/\/+/g, '/');
  return out === '/' ? '/' : out;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function unwrapNamespaceObject(ns: Record<string, unknown>, section: string): Record<string, unknown> {
  if (ns[section] && isPlainObject(ns[section])) {
    return ns[section] as Record<string, unknown>;
  }
  const keys = Object.keys(ns);
  if (keys.length === 1 && isPlainObject(ns[keys[0]])) {
    return ns[keys[0]] as Record<string, unknown>;
  }
  return ns;
}

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '');
}

function toCategoryHref(categoryKey: string, basePath: string) {
  if (basePath) return basePath;
  // Categories like "others" have top-level links, not a section landing page.
  return '/';
}

function normalizeLinksForCategory(categoryKey: string, section: Record<string, unknown>): LinkItem[] {
  const cfg = CATEGORY_CONFIG[categoryKey];
  const basePath =
    typeof section.basePath === 'string'
      ? section.basePath
      : cfg
        ? cfg.basePath
        : '';

  const nav = section.nav;
  if (!nav) return [];

  const mode: CategoryMode =
    typeof section.mode === 'string' && ['array-name', 'object-nav', 'itihasa'].includes(section.mode)
      ? (section.mode as CategoryMode)
      : (cfg?.mode ?? 'object-nav');

  if (mode === 'array-name' && Array.isArray(nav)) {
    return nav
      .map((item, index) => {
        const obj = isPlainObject(item) ? item : null;
        const name = obj && typeof obj.name === 'string' ? obj.name : null;
        if (!name) return null;
        const href = normalizeHref(`${basePath}/${slugFromName(name)}`);
        return { key: `${categoryKey}:${index}`, label: name, href };
      })
      .filter((x): x is LinkItem => !!x);
  }

  if (mode === 'itihasa' && Array.isArray(nav)) {
    const links: LinkItem[] = [];

    nav.forEach((entry, index) => {
      const epic = isPlainObject(entry) ? entry : null;
      if (!epic) return;

      const isGita = isPlainObject(epic.chapters_list);
      const epicName = typeof epic.name === 'string' ? epic.name : isGita ? 'Bhagavad Gita' : 'Epic';
      const epicSlug = typeof epic.name === 'string' ? slugFromName(epic.name) : isGita ? 'bhagavadgita' : `epic${index + 1}`;
      const epicHref = normalizeHref(`${basePath}/${epicSlug}`);
      links.push({ key: `${categoryKey}:${epicSlug}`, label: epicName, href: epicHref });

      const subNav =
        (isPlainObject(epic.kandas) ? epic.kandas : null) ||
        (isPlainObject(epic.chapters_list) ? epic.chapters_list : null);

      if (subNav) {
        Object.entries(subNav).forEach(([subKey, subLabel]) => {
          if (typeof subLabel !== 'string') return;
          links.push({
            key: `${categoryKey}:${epicSlug}:${subKey}`,
            label: subLabel,
            href: normalizeHref(`${epicHref}/${subKey}`)
          });
        });
      }
    });

    return links;
  }

  if (isPlainObject(nav)) {
    return Object.entries(nav)
      .map(([navKey, navLabel]) => {
        if (typeof navLabel !== 'string') return null;
        if (categoryKey === 'science' && !AVAILABLE_VEDIC_SCIENCE_SLUGS.has(navKey)) return null;
        const href = basePath ? normalizeHref(`${basePath}/${navKey}`) : normalizeHref(`/${navKey}`);
        return { key: `${categoryKey}:${navKey}`, label: navLabel, href };
      })
      .filter((x): x is LinkItem => !!x);
  }

  return [];
}

export default function SimilarCategories({
  title = 'Explore More',
  maxItems = 100,
  excludeCurrent = true
}: SimilarCategoriesProps) {
  const { locale } = useLocale();
  const pathname = normalizeHref(usePathname() || '/');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [expandedByCategory, setExpandedByCategory] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ns = await getLocaleNamespaceObject(locale, 'sharable-strings');
        if (!mounted) return;
        const locObj = isPlainObject(ns) ? ns : {};
        const sharableStrings = unwrapNamespaceObject(locObj, 'sharable-strings');

        const source =
          isPlainObject(sharableStrings.similar_categories)
            ? (sharableStrings.similar_categories as Record<string, unknown>)
            : isPlainObject(sharableStrings.footer)
              ? (sharableStrings.footer as Record<string, unknown>)
              : {};

        const extracted: CategoryItem[] = [];
        const categoryOrder = Object.keys(CATEGORY_CONFIG);

        // Add standard categories
        categoryOrder.forEach((categoryKey) => {
          if (categoryKey === 'explore') return; // We'll add explore separately
          const value = source[categoryKey];
          if (!isPlainObject(value)) return;
          const titleText = typeof value.title === 'string' ? value.title : categoryKey;
          const links = normalizeLinksForCategory(categoryKey, value)
            .filter((link) => !excludeCurrent || normalizeHref(link.href) !== pathname)
            .slice(0, maxItems);

          if (links.length === 0) return;
          extracted.push({ key: categoryKey, title: titleText, links });
        });

        // Add explore links
        const exploreLinks = await getExploreLinks(locale);
        if (exploreLinks.length > 0) {
          extracted.push({
            key: 'explore',
            title: 'Explore',
            links: exploreLinks.filter((link) => !excludeCurrent || normalizeHref(link.href) !== pathname)
          });
        }

        setCategories(extracted.slice(0, maxItems));
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    })();
    return () => { mounted = false; };
  }, [excludeCurrent, locale, maxItems, pathname]);
  if (categories.length === 0) {
    return (
      <aside className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-linear-to-b from-amber-50 via-orange-50 to-stone-50 p-5 shadow-[0_10px_30px_rgba(120,53,15,0.12)]">
        <div className="pointer-events-none absolute inset-x-5 top-4 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent text-md sm:text-base leading-relaxed font-normal" />
        <div className="pointer-events-none absolute inset-x-5 bottom-4 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent text-md sm:text-base leading-relaxed font-normal" />
        <h5 className="mb-2 text-xl md:text-md sm:text-base font-semibold tracking-wide text-amber-900">{title}</h5>
        <p className="text-amber-800/90 text-md sm:text-base leading-relaxed mb-4 font-normal">
          Loading categories or no categories available...
        </p>
      </aside>
    );
  }
  return (
    <aside className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-linear-to-b from-amber-50 via-orange-50 to-stone-50 p-5 shadow-[0_10px_30px_rgba(120,53,15,0.12)]">
      <div className="pointer-events-none absolute inset-x-5 top-4 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent text-md sm:text-base leading-relaxed font-normal" />
      <div className="pointer-events-none absolute inset-x-5 bottom-4 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent text-md sm:text-base leading-relaxed font-normal" />
      <div className="rounded-xl border border-amber-200 bg-amber-100/70 px-4 py-3 text-md sm:text-base leading-relaxed font-normal">
        <h5 className="text-xl md:text-md sm:text-base font-semibold tracking-wide text-amber-900">{title}</h5>
        <p className="text-amber-800 text-md sm:text-base leading-relaxed mb-4 font-normal">Sacred pathways to explore related wisdom.</p>
      </div>
      <div className="space-y-4 text-md sm:text-base leading-relaxed font-normal mt-4">
        {categories.map((category) => {
          return (
            <div
              key={category.key}
              className="rounded-xl border border-orange-200 bg-white/80 p-4 shadow-[0_6px_16px_rgba(120,53,15,0.08)] text-md sm:text-base leading-relaxed font-normal"
            >
              <h6 className="mb-3 border-b border-amber-200 pb-2 text-md sm:text-base font-semibold text-amber-900">
                <Link
                  href={toCategoryHref(category.key, CATEGORY_CONFIG[category.key]?.basePath ?? '')}
                  className="decoration-amber-500 underline-offset-4 transition-colors hover:text-orange-700 hover:underline"
                >
                  {category.title}
                </Link>
              </h6>
              <ul className="space-y-2 pl-5 text-md sm:text-base leading-relaxed">
                {(expandedByCategory[category.key] ? category.links : category.links.slice(0, INITIAL_VISIBLE_LINKS)).map((link) => (
                  <li key={link.key} className="mb-2">
                    <Link
                      href={normalizeHref(link.href)}
                      className="inline-flex items-center gap-2 text-amber-800 transition-colors hover:text-orange-700"
                    >
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 text-md sm:text-base leading-relaxed font-normal" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2 border-t border-amber-200/80 pt-3 text-md sm:text-base leading-relaxed font-normal">
                {category.links.length > INITIAL_VISIBLE_LINKS && (
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedByCategory((previous) => ({
                        ...previous,
                        [category.key]: !previous[category.key]
                      }));
                    }}
                    aria-expanded={Boolean(expandedByCategory[category.key])}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm tracking-wide text-amber-900 transition-colors hover:bg-amber-100"
                  >
                    <span aria-hidden="true">{expandedByCategory[category.key] ? '−' : '+'}</span>
                    {expandedByCategory[category.key] ? 'Show less' : `More (${category.links.length - INITIAL_VISIBLE_LINKS})`}
                  </button>
                )}
                <Link
                  href={toCategoryHref(category.key, CATEGORY_CONFIG[category.key]?.basePath ?? '')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-3 py-1.5 text-sm tracking-wide text-orange-900 transition-colors hover:bg-orange-200"
                >
                  View all
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
