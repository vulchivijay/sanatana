/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('stotrasmantras_shiva');
export default function Page() {
  const locale = (async () => await detectLocale({}))();

  const S = (k: string) => String(t(k, locale));

  // detectLocale is async; but for static rendering we will fall back to default through t() when needed
  const items = t('shivastotras.stotras', undefined) || [];

  return (
    <PageLayout metaKey="stotrasmantras_shiva" title={S('shivastotras.title') || 'Shiva Stotras'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: S('shivastotras.title') || 'Shiva Stotras' }]} locale={locale}>
      {items.map((item: any, i: number) => (
        <section key={i}>
          <h3>{item.name || item.title || `Item ${i + 1}`}</h3>
          <div>
            {item.author || item.meter || item.deity_form ? (
              <span>
                {item.author ? `${item.author}` : null}
                {item.meter ? `${item.author ? ' — ' : ''}${item.meter}` : null}
                {item.deity_form ? `${item.author || item.meter ? ' — ' : ''}${item.deity_form}` : null}
              </span>
            ) : null}
          </div>

          {item.summary ? <p>{item.summary}</p> : null}

          {item.benefits ? <p><strong>Benefits:</strong> {item.benefits}</p> : null}

          {item.verses ? <p>Verses: {item.verses}</p> : null}
        </section>
      ))}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
