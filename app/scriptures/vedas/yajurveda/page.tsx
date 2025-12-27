/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale } from '../../../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas_yajurveda');
export default function YajurvedaPage() {
  const locale = detectLocale();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <PageLayout title={S('yajurveda.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('yajurveda.title', locale)) }]} locale={locale}>
        <p>{S('yajurveda.summary')}</p>
        <section>
          <h3>{S('yajurveda.contentTitle')}</h3>
          <p>{S('yajurveda.content')}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
