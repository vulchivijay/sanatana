/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';


import PageLayout from '@components/common/PageLayout';
import Image from 'next/image';

export const generateMetadata = createGenerateMetadata('kidsZone_illustratedStories');

export default async function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string, l?: any) => String(t(k, l ?? locale));


  return (
    <>
      <PageLayout title={S('illustratedStories.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof title !== 'undefined' ? title : '') }]} locale={locale}>
        <p>{S('illustratedStories.description', locale)}</p>
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
                {s.characters?.length ? <div><strong>{S('s.characters', locale)}</strong> {s.characters.join(', ')}</div> : null}
                {s.themes?.length ? <div><strong>{S('s.themes', locale)}</strong> {s.themes.join(', ')}</div> : null}
              </div>
            </article>
          ))}
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
