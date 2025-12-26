/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import PageLayout from '@components/common/PageLayout';
import { headers } from 'next/headers';

export const generateMetadata = createGenerateMetadata('scriptures_upanishads');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('upanishads.title', locale) || '';

  return (
    <>
      <StructuredData metaKey="scriptures_upanishads" />
      <PageLayout className="content-wrapper md page-space-xl" title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}>
        {(t('upanishads.list', locale) || []).map((item: any, i: number) => (
          <div key={i}>
            {item.category ? <h3>{item.catogory}</h3> : null}
            {item.description ?
              <p>{item.description}</p> :
              <ul role="list" className="list-disc">
                {item.list.map((list: any, j: number) => (
                  <li key={j}>
                    <p><b>Name:</b> {list.name}</p>
                    <p><b>Veda:</b> {list.veda}</p>
                    <p><b>Type:</b> {list.type}</p>
                    <p><b>Summary:</b> {list.summary}</p>
                  </li>
                ))}
              </ul>}
          </div>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
