/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';

export default async function NatyaPage() {
  const locale = await detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_shastras_natya" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.shastras', href: '/shastras' }, { labelKey: 'shastras.natya.title' }]} locale={locale} />
          <h2>{t('shastras.natya.title', locale)}</h2>
          <p>{t('shastras.natya.summary', locale)}</p>
          <section>
            <h3>{t('shastras.natya.title', locale)}</h3>
            <p>{t('shastras.natya.content', locale)}</p>
          </section>
        </div>
      </main>
    </>
  );
}


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_shastras_natya', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
