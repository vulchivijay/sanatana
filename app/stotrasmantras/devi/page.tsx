/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import PageLayout from '@components/common/PageLayout';
import { headers } from 'next/headers';

export const generateMetadata = createGenerateMetadata('stotrasmantras_devi');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('devistotras.title', locale) || 'Devi Stotras';

  const items = t('devistotras.devi_stotras', locale) || [];

  return (
    <>
      <StructuredData metaKey="stotras_devistotras" />
      <PageLayout className="content-wrapper md page-space-xl" title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}>

        {items.map((item: any, i: number) => (
          <section key={i}>
            <h3>{item.name || item.title || `Item ${i + 1}`}</h3>
            <div>
              {item.origin || item.author || item.language ? (
                <span>
                  {item.author ? `${item.author}` : null}
                  {item.origin ? `${item.author ? ' — ' : ''}${item.origin}` : null}
                  {item.language ? `${item.author || item.origin ? ' — ' : ''}${item.language}` : null}
                </span>
              ) : null}
            </div>

            {item.description ? <p>{item.description}</p> : null}

            {item.benefits && Array.isArray(item.benefits) ? (
              <ul role="list" className="list-disc">
                {item.benefits.map((b: string, idx: number) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            ) : null}

            {item.key_excerpt ? <blockquote>{item.key_excerpt}</blockquote> : null}

            {item.sections && typeof item.sections === 'object' ? (
              <div>
                {Object.entries(item.sections).map(([k, v]: any) => (
                  <p key={k}><strong>{k}:</strong> {String(v)}</p>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
