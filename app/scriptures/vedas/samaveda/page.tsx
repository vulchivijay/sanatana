/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_vedas_samaveda', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
export default function SamavedaPage() {
  const locale = detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_vedas_samaveda" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.vedas', href: '/vedas' }, { labelKey: 'samaveda.title' }]} locale={locale} />
          <h2>{t('samaveda.title', locale)}</h2>
          <p>{t('samaveda.summary', locale)}</p>
          <section>
            <h3>{t('samaveda.contentTitle', locale)}</h3>
            <p>{t('samaveda.content', locale)}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
