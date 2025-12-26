/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

export const generateMetadata = createGenerateMetadata('scriptures_vedas');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('vedas.title', locale) || '';
  const intro = t('vedas.intro', locale) || '';
  const origin = t('vedas.origin') || '';
  const authorship = t('vedas.authorship') || '';

  return (
    <>
      <StructuredData metaKey="scriptures_vedasPage" />
        <PageLayout className="content-wrapper md page-space-xl" title={t('vedas.title', locale)}>
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} />
        <h2>{title}</h2>
        <p>{intro}</p>
        <div>
          <p><b>Meaning: </b>{origin.Meaning}</p>
          <p><b>Period: </b>{origin.Period}</p>
          <p><b>Transmission: </b>{origin.Transmission}</p>
        </div>
        <div>
          <p><b>Nature: </b>{authorship.Nature}</p>
          <p><b>Process: </b>{authorship.Process}</p>
          <p><b>Compiler: </b>{authorship.Compiler}</p>
        </div>
        {(t('vedas.structure.fourvedas', locale) || []).map((item: any, i: number) => (
          <div key={i}>
            <p><b>Name: </b>{item.Name}</p>
            <p><b>Content: </b>{item.Content}</p>
            <p><b>Features: </b>{item.Features}</p>
          </div>
        ))}
        </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
