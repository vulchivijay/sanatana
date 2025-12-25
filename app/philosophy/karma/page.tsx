/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders, getLocaleObject } from '../../../lib/i18n';
import { headers } from 'next/headers';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const meta = getMeta('philosophy_karma', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const loc = getLocaleObject(locale) || {};
  const karma = loc?.karma_philosophy || {};
  const title = karma.title || t('karma_philosophy.title', locale) || 'Karma Philosophy';

  return (
    <>
      <StructuredData metaKey="philosophy_karma" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} />
        <h2>{title}</h2>
        <p><strong>Definition : </strong>{karma.definition}</p>
        {/* Core Principles of Karma */}
        <div>
          <p><strong>Core Principles of Karma : </strong> {karma.core_principles.map((s: string) => (<span>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(karma.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Types of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(karma.types_of_karma).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(karma.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(karma.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Karma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(karma.modern_relevance).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
