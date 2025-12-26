/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas_yajurveda');
export default function YajurvedaPage() {
  const locale = detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_vedas_yajurveda" />
      <PageLayout className="content-wrapper md page-space-xl" title={t('yajurveda.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.vedas', href: '/vedas' }, { labelKey: 'yajurveda.title' }]}>
        <p>{t('yajurveda.summary', locale)}</p>
        <section>
          <h3>{t('yajurveda.contentTitle', locale)}</h3>
          <p>{t('yajurveda.content', locale)}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
