/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, DEFAULT_LOCALE, detectServerLocaleFromHeaders, detectLocale, getLocaleObject } from '@/lib/i18n';

import { headers } from 'next/headers';
import Link from 'next/link';


function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata({ params, searchParams }: { params: { chapter: string }, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const chapters = t('ramayana.chapters', locale) || [];
  const num = Number(params.chapter || 0);
  const ch = Array.isArray(chapters) ? chapters.find((c: any) => Number(c.chapter) === num) : null;
  const title = ch ? `${S('nav.stories.nav.ramayana', locale)} — Chapter ${ch.chapter}: ${ch.title}` : `${S('nav.stories.nav.ramayana', locale)} — Chapter ${num}`;
  const meta = getMeta('ramayana_slug', { title: title, excerpt: ch && ch.summary ? ch.summary : '' }, locale);
  const description = ch && ch.summary ? ch.summary : meta.description;
  const keywords = (meta.keywords && String(meta.keywords).trim()) ? meta.keywords : `${S('nav.stories.nav.ramayana', locale)}, chapter ${num}`;
  const ogImages = meta.ogImage ? [meta.ogImage] : undefined;
  return {
    title,
    description,
    keywords,
    openGraph: { title, description, images: ogImages },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}

export function generateStaticParams() {
  try {
    const chapters = (getLocaleObject(DEFAULT_LOCALE)?.ramayana?.chapters) || [];
    if (Array.isArray(chapters) && chapters.length > 0) {
      return chapters.map((c: any) => ({ chapter: String(c.chapter) }));
    }
  } catch (e) { }
  // Fallback: generate an initial set (e.g., 7 books/sections commonly used in Ramayana)
  return Array.from({ length: 7 }).map((_, i) => ({ chapter: String(i + 1) }));
}

export default function Page({ params, searchParams }: { params: { chapter: string }, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const chapters = t('ramayana.chapters', locale) || [];
  const num = Number(params.chapter || 0);
  const ch = Array.isArray(chapters) ? chapters.find((c: any) => Number(c.chapter) === num) : null;

  const title = ch ? `${S('nav.stories.nav.ramayana', locale)} — Chapter ${ch.chapter}: ${ch.title}` : `Chapter ${num}`;
  const excerpt = ch && ch.summary ? ch.summary : '';

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <nav role="menu">
          <Link href="/scriptures/ramayana">&larr; Back to Ramayana</Link>
        </nav>
        <h2>{ch ? `${S('nav.stories.nav.ramayana', locale)} — Chapter ${ch.chapter}: ${ch.title}` : `Chapter ${num}`}</h2>
        {ch && ch.verses && ch.verses.length > 0 ? (
          <ol role="list" className="list-disc">
            {ch.verses.map((v: any) => (
              <li key={v.verse}><strong>{v.verse}.</strong> {v.text || <em>Verse not available</em>}</li>
            ))}
          </ol>
        ) : (
          <p>Verse/content not available for this chapter.</p>
        )}
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
