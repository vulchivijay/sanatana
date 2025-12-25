/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('stotrasmantras_shiva', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
export default function Page() {
  const locale = (async () => await detectLocale({}))();
  // detectLocale is async; but for static rendering we will fall back to default through t() when needed
  const items = t('shivastotras.stotras', undefined) || [];

  return (
    <>
      <StructuredData metaKey="stotrasmantras_shiva" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: 'Shiva Stotras' }]} />
        <h2>{t('shivastotras.title', undefined) || 'Shiva Stotras'}</h2>

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
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
