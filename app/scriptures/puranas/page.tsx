/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders, getLocaleObject } from '../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { headers } from 'next/headers';

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_puranas', undefined, locale) || {};

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}

export default function PuranasPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const loc = getLocaleObject(locale) || {};
  const puranas = loc?.puranas || {};
  const title = puranas.title || t('puranas.title', locale) || '';
  return (
    <>
      <StructuredData metaKey="scriptures_puranas" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: title }]} locale={locale} />
        <h2>{title} - {puranas.classification}</h2>
        <p>{puranas.definition}</p>

        <div>
          <p>{t('puranas.purpose', locale)}</p>
          {/* Major Puranas */}
          {Array.isArray(puranas.major_puranas) && puranas.major_puranas.length > 0 && (
            <div>
              <p>Major Puranas :</p>
              <ul role="list" className="list-disc">
                {puranas.major_puranas.map((c: any, idx: number) => (
                  <li key={idx}>
                    <strong>{c.name}</strong> - {c.highlights ? <span>{c.highlights}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
