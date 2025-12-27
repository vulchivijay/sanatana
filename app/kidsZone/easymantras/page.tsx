/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';



import PageLayout from '@components/common/PageLayout';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

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
      <PageLayout title={meta.title || t('kidsZone.easymantras.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: meta.title || t('kidsZone.easymantras.title', locale) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>Placeholder for simple mantras children can learn.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
