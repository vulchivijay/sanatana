/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t, DEFAULT_LOCALE } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import PageLayout from '@components/common/PageLayout';
import Image from 'next/image';

export const generateMetadata = createGenerateMetadata('kidsZone_illustratedStories');

export default async function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  return (
    <>
      <StructuredData metaKey="kidsZone_illustratedStories" />
      <PageLayout className="content-wrapper md page-space-xl" title={t('illustratedStories.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: t('illustratedStories.title', locale) }]}>
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
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
