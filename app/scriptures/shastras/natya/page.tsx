/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';

export default async function NatyaPage() {
  const locale = await detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_shastras_natya" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.shastras', href: '/shastras' }, { labelKey: 'shastras.natya.title' }]} locale={locale} />
          <h2>{t('shastras.natya.title', locale)}</h2>
          <p>{t('shastras.natya.summary', locale)}</p>
          <section>
            <h3>{t('shastras.natya.title', locale)}</h3>
            <p>{t('shastras.natya.content', locale)}</p>
          </section>
        </div>
      </main>
    </>
  );
}


export const generateMetadata = createGenerateMetadata('scriptures_shastras_natya');
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
