/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '../../../lib/i18n';
import { headers } from 'next/headers';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import Image from 'next/image';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('kidsZone_illustratedStories', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
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

export default async function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  return (
    <>
      <StructuredData metaKey="kidsZone_illustratedStories" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: t('illustratedStories.title', locale) }]} />
        <h2>{t('illustratedStories.title', locale)}</h2>
        <p>{t('illustratedStories.description', locale)}</p>
        <div>
          {(t('illustratedStories.kids_indian_stories', locale) as any[]).map((s: any) => (
            <article key={s.id}>
              <div>
                <Image src={s.imgSrc} alt={s.imgAlt} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <p>{s.title}</p>
                {/* <div>{s.origin}</div> */}
                <p>{s.summary}</p>
                {/* {s.moral ? <p><strong>Moral:</strong> {s.moral}</p> : null} */}
                {s.characters?.length ? <div><strong>{t('s.characters', locale)}</strong> {s.characters.join(', ')}</div> : null}
                {s.themes?.length ? <div><strong>{t('s.themes', locale)}</strong> {s.themes.join(', ')}</div> : null}
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
