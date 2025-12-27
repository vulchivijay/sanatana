/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { headers } from 'next/headers';

import Link from 'next/link';
import { notFound } from 'next/navigation';


import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '@/lib/i18n';

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata({ params, searchParams }: { params: any, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  // load chapters from locale translations; if the locale doesn't include
  // structured chapters, fall back to English translations (no combined file)
  let chaptersRaw: any = t('bhagavadgita.chapters', locale);
  if (!Array.isArray(chaptersRaw)) {
    chaptersRaw = t('bhagavadgita.chapters', 'en');
  }
  const chapters: any[] = Array.isArray(chaptersRaw) ? chaptersRaw : [];
  const resolvedParams = params && typeof params.then === 'function' ? await params : params;
  const num = Number(resolvedParams?.chapter || 0);
  const ch = Array.isArray(chapters) ? chapters.find((c: any) => Number(c.chapter) === num) : null;
  const title = ch ? `${S('bhagavadgita.title')} — Chapter ${ch.chapter}: ${ch.title}` : `${S('bhagavadgita.title')} — Chapter ${num}`;
  const meta = getMeta('bhagavadgita_slug', { title: title, excerpt: ch && ch.summary ? ch.summary : '' }, locale);
  const description = ch && ch.summary ? ch.summary : meta.description;
  const keywords = (meta.keywords && String(meta.keywords).trim()) ? meta.keywords : `${S('bhagavadgita.title')}, chapter ${num}`;
  const ogImages = meta.ogImage ? [meta.ogImage] : undefined;
  return {
    title,
    description,
    keywords,
    openGraph: { title, description, images: ogImages },
  };
}

// Pre-render all known Gita chapters so each chapter has its own static page and metadata
export async function generateStaticParams() {
  // Return explicit static params for chapters 1..18 to satisfy `output: "export"` builds.
  return Array.from({ length: 18 }).map((_, i) => ({ chapter: String(i + 1) }));
}

export default async function Page({ params, searchParams }: { params: any, searchParams?: any }) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  // load chapters strictly from locale translations; fall back to English
  let chaptersRaw: any = t('bhagavadgita.chapters', locale);
  if (!Array.isArray(chaptersRaw)) {
    chaptersRaw = t('bhagavadgita.chapters', 'en');
  }
  const chapters: any[] = Array.isArray(chaptersRaw) ? chaptersRaw : [];
  const resolvedParams = params && typeof params.then === 'function' ? await params : params;
  const raw = resolvedParams?.chapter;
  const num = Number(raw);
  if (!Number.isFinite(num) || num < 1 || num > 18) {
    return notFound();
  }
  const ch = Array.isArray(chapters) ? chapters.find((c: any, i: number) => Number(c.chapter || c.chapter_number || (i + 1)) === num) : null;
  // compute a chapter-specific title/excerpt to pass into StructuredData
  const bookTitle = (t('bhagavadgita.title', locale) || t('bhagavadgita.title', 'en') || 'Bhagavad Gita');
  const chapterTitleText = ch ? (ch.title || ch.name || `Chapter ${num}`) : `Chapter ${num}`;
  const title = `${bookTitle} — Chapter ${num}: ${chapterTitleText}`;
  const excerpt = ch && ch.summary ? ch.summary : '';
  // console.log(ch); // Removed stray console.log for debugging
  return (
    <>
      {/* Debug removed */}
      <main className="content-wrapper md page-space-xl">
        <nav role="menu">
          <Link href="/scriptures/gita">&larr; Back to Bhagavad Gita</Link>
        </nav>
        

        <h2>{title}</h2>

        {ch && ch.verses && ch.verses.length > 0 ? (
          <div>
            {ch.verses.map((v: any, idx: number) => {
              // Normalize verse identification
              const verseNum = v.text_number || v.verse || v.number || (typeof v.id === 'number' ? v.id : null) || (typeof v.id === 'string' && /^\d+$/.test(v.id) ? Number(v.id) : null) || idx + 1;

              // Helpers to pull text from multiple possible shapes
              const pickString = (val: any) => {
                if (!val && val !== 0) return null;
                if (typeof val === 'string') return val;
                if (Array.isArray(val)) return val.join('\n\n');
                return String(val);
              };

              const translationRaw = v.translation || v.translation_text || v.translation_lines || v.translation || v.original || v.text || v.meaning || v.lines || null;
              const translation = pickString(translationRaw);

              const originalRaw = v.original || v.original_lines || v.sanskrit || null;
              const original = pickString(originalRaw);

              const translitRaw = v.transliteration_lines || v.transliteration || v.transliterationLines || null;
              const transliteration = pickString(translitRaw);

              const speakerHeader = pickString(v.speaker_header || v.speaker || v.speakerHeader || null);
              const heading = pickString(v.heading || v.header || v.title || null);

              const purportRaw = v.purport || v.purport_paragraphs || v.purports || null;
              const purport = pickString(purportRaw);

              const wordMeaning = pickString(v.word_meaning_lines || v.word_meanings || null);
              const wordTranslation = pickString(v.translation || v.translation || null);

              return (
                <article key={idx}>
                  {/* {heading ? <h3>{heading}</h3> : null} */}
                  {speakerHeader ? <div>{speakerHeader}</div> : null}

                  <div>
                    <strong>{verseNum}.</strong>
                    {translation ? (
                      <span>{translation}</span>
                    ) : (
                      <em>Verse not available</em>
                    )}
                  </div>

                  {original ? (
                    <div><pre>{original}</pre></div>
                  ) : null}

                  {transliteration ? (
                    <div><pre>{transliteration}</pre></div>
                  ) : null}

                  {wordMeaning ? (
                    <div><b>Word Meaning:</b> {wordMeaning}</div>
                  ) : null}

                  {wordTranslation ? (
                    <div><b>English Translation:</b> {wordTranslation}</div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p>Verse content not available for this chapter.</p>
        )}

        {/* Previous / Next navigation for chapter browsing */}
        <div>
          <div>
            {num > 1 ? (
              <Link href={`/scriptures/gita/chapter/${num - 1}`}>
                &larr; Previous
              </Link>
            ) : (
              <span>&larr; Previous</span>
            )}
          </div>
          <div>
            {num < 18 ? (
              <Link href={`/scriptures/gita/chapter/${num + 1}`}>
                Next &rarr;
              </Link>
            ) : (
              <span>Next &rarr;</span>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
