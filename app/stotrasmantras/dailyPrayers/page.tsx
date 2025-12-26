/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import PageLayout from '@components/common/PageLayout';
import { headers } from 'next/headers';

export const generateMetadata = createGenerateMetadata('stotrasmantras_dailyPrayers');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('daily_prayers.title', locale) || 'Daily Prayers';
  // const items = t('daily_prayers.daily_prayers_stotras', locale) || [];

  return (
    <>
      <StructuredData metaKey="stotrasmantras_dailyPrayers" />
      <PageLayout className="content-wrapper md page-space-xl" title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}>
        <p>Placeholder for daily prayers and short mantras.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
