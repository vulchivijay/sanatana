/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';


import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('stotrasmantras_dailyPrayers');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const title = t('daily_prayers.title', locale) || 'Daily Prayers';
  // const items = t('daily_prayers.daily_prayers_stotras', locale) || [];

  return (
    <>
      <PageLayout title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof title !== 'undefined' ? title : '') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>Placeholder for daily prayers and short mantras.</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
