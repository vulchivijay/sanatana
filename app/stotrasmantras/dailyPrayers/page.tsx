/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { headers } from 'next/headers';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const meta = getMeta('stotrasmantras_dailyPrayers', undefined, locale) || {};
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
  const title = t('daily_prayers.title', locale) || 'Daily Prayers';
  // const items = t('daily_prayers.daily_prayers_stotras', locale) || [];

  return (
    <>
      <StructuredData metaKey="stotrasmantras_dailyPrayers" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} />
        <h2>{title}</h2>
        <p>Placeholder for daily prayers and short mantras.</p>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
