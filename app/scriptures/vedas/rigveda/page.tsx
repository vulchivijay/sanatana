/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale } from '../../../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas_rigveda');
export default function RigvedaPage() {
  const locale = detectLocale();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <PageLayout title={S('rigveda.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('rigveda.title')) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>{S('rigveda.summary')}</p>
        <section>
          <h3>{S('rigveda.contentTitle')}</h3>
          <p>{S('rigveda.content')}</p>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
