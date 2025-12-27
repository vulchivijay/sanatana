/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';


import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('scriptures_upanishads');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const title = t('upanishads.title', locale) || '';

  return (
    <>
      <PageLayout title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} locale={locale}>
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
