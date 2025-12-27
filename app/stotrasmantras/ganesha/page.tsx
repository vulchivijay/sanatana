/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';


import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('stotrasmantras_ganesha');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const title = t('ganeshstotras.title', locale) || 'Ganesha Stotras';

  const items = t('ganeshstotras.ganesh_stotras', locale) || [];

  return (
    <>
      <PageLayout title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof title !== 'undefined' ? title : '') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        
        <h2>{title}</h2>

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
