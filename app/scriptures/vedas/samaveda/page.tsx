/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas_samaveda');
export default function SamavedaPage() {
  const locale = detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_vedas_samaveda" />
      <PageLayout className="content-wrapper md page-space-xl" title={t('samaveda.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.vedas', href: '/vedas' }, { labelKey: 'samaveda.title' }]}>
        <p>{t('samaveda.summary', locale)}</p>
        <section>
          <h3>{t('samaveda.contentTitle', locale)}</h3>
          <p>{t('samaveda.content', locale)}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
