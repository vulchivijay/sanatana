/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';


import PageLayout from '@components/common/PageLayout';


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

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
      <PageLayout title={S('atharvaveda.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('atharvaveda.title', locale)) }]} locale={locale}>
        <p>{S('atharvaveda.summary', locale)}</p>
        <section>
          <h3>{S('atharvaveda.contentTitle', locale)}</h3>
          <p>{S('atharvaveda.content', locale)}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
