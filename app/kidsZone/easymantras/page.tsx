/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import PageLayout from '@components/common/PageLayout';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('kidsZone_easymantras', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}
export default async function Page() {
  const locale = await detectLocale();
  const meta = getMeta('kidsZone_easymantras', undefined, locale) || {};
  return (
    <>
      <StructuredData metaKey="kidsZone_easymantras" />
      <PageLayout className="content-wrapper md page-space-xl" title={meta.title || t('kidsZone.easymantras.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: meta.title || t('kidsZone.easymantras.title', locale) }]}>
        <p>Placeholder for simple mantras children can learn.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
