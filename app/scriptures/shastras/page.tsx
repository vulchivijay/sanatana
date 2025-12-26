/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { getMeta, t, detectLocale } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';

export const generateMetadata = createGenerateMetadata('shastras');

export default async function ShastrasPage() {
  const locale = await detectLocale();
  return (
    <>
      <StructuredData metaKey="scriptures_shastras" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.shastras' }]} locale={locale} />
          <h2>{t('shastrasPage.title', locale)}</h2>
          <p>{t('shastrasPage.intro', locale)}</p>

          <section>
            <h3>{t('shastrasPage.sectionsTitle', locale)}</h3>
            <ul role="list" className="list-disc">
              <li><Link href="/shastras/dharma">{t('shastrasPage.sections.dharma', locale)}</Link></li>
              <li><Link href="/shastras/artha">{t('shastrasPage.sections.artha', locale)}</Link></li>
              <li><Link href="/shastras/vastu">{t('shastrasPage.sections.vastu', locale)}</Link></li>
              <li><Link href="/shastras/natya">{t('shastrasPage.sections.natya', locale)}</Link></li>
            </ul>
          </section>

          <section>
            <h4>{t('shastrasPage.influenceTitle', locale)}</h4>
            <p>{t('shastrasPage.influenceText', locale)}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
