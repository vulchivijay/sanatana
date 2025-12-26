/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_vedas_atharvaveda', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
export default function AtharvavedaPage() {
  const locale = detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_vedas_atharvaveda" />
      <PageLayout className="content-wrapper md page-space-xl" title={t('atharvaveda.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.vedas', href: '/vedas' }, { labelKey: 'atharvaveda.title' }]}>
        <p>{t('atharvaveda.summary', locale)}</p>
        <section>
          <h3>{t('atharvaveda.contentTitle', locale)}</h3>
          <p>{t('atharvaveda.content', locale)}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
