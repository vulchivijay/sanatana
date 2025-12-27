/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, DEFAULT_LOCALE, detectLocale, getLocaleObject } from '@/lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import Link from 'next/link';

import PageArticleJsonLd from '@components/structured-data/PageArticleJsonLd';

export const generateMetadata = createGenerateMetadata('puranas_slug');

export function generateStaticParams() {
  try {
    // At build time, synchronously load the default locale object
    // and read the chapters array directly to avoid dynamic import
    // pitfalls. `getLocaleObject` uses a server-side `require`.
    const loc = getLocaleObject(DEFAULT_LOCALE) || {};
    const chapters = (loc?.puranas && loc.puranas.chapters) || [];
    if (Array.isArray(chapters) && chapters.length > 0) {
      return chapters.map((c: any) => ({ chapter: String(c.chapter) }));
    }
  } catch (e) { }
  // Fallback: generate a small set if the chapters data is missing
  return Array.from({ length: 12 }).map((_, i) => ({ chapter: String(i + 1) }));
}

export default function Page({ params, searchParams }: { params: { chapter: string }, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const chapters = t('puranas.chapters', locale) || [];
  const num = Number(params.chapter || 0);
  const ch = Array.isArray(chapters) ? chapters.find((c: any) => Number(c.chapter) === num) : null;

  const siteMeta = getMeta('puranas', {}, locale);
  const title = ch ? `${siteMeta.title || t('nav.scriptures.nav.puranas', locale)} — Chapter ${ch.chapter}: ${ch.title}` : `Chapter ${num}`;
  const excerpt = ch && ch.summary ? ch.summary : '';

  return (
    <>
      <PageArticleJsonLd metaKey="scriptures_puranas_chapter_[chapter]" params={{ title, excerpt }} />
      <main className="content-wrapper md page-space-xl">
        <nav role="menu">
          <Link href="/puranas">&larr; Back to Puranas</Link>
        </nav>

        <h2>{ch ? `${S('nav.scriptures.nav.puranas', locale)} — Chapter ${ch.chapter}: ${ch.title}` : `Chapter ${num}`}</h2>

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
