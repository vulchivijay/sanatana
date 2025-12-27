/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale } from '../../../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas_samaveda');
export default function SamavedaPage() {
  const locale = detectLocale();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <PageLayout title={S('samaveda.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('samaveda.title', locale)) }]} locale={locale}>
        <p>{S('samaveda.summary', locale)}</p>
        <section>
          <h3>{S('samaveda.contentTitle', locale)}</h3>
          <p>{S('samaveda.content', locale)}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
