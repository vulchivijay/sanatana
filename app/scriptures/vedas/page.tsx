/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { headers } from 'next/headers';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const meta = getMeta('scriptures_vedas', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('vedas.title', locale) || '';
  const intro = t('vedas.intro', locale) || '';
  const origin = t('vedas.origin') || '';
  const authorship = t('vedas.authorship') || '';

  return (
    <>
      <StructuredData metaKey="scriptures_vedasPage" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} />
        <h2>{title}</h2>
        <p>{intro}</p>
        <div>
          <p><b>Meaning: </b>{origin.Meaning}</p>
          <p><b>Period: </b>{origin.Period}</p>
          <p><b>Transmission: </b>{origin.Transmission}</p>
        </div>
        <div>
          <p><b>Nature: </b>{authorship.Nature}</p>
          <p><b>Process: </b>{authorship.Process}</p>
          <p><b>Compiler: </b>{authorship.Compiler}</p>
        </div>
        {(t('vedas.structure.fourvedas', locale) || []).map((item: any, i: number) => (
          <div key={i}>
            <p><b>Name: </b>{item.Name}</p>
            <p><b>Content: </b>{item.Content}</p>
            <p><b>Features: </b>{item.Features}</p>
          </div>
        ))}
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
