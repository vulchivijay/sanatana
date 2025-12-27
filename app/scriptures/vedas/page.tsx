/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('scriptures_vedas');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const title = t('vedas.title', locale) || '';
  const intro = t('vedas.intro', locale) || '';
  const origin = t('vedas.origin') || '';
  const authorship = t('vedas.authorship') || '';

  return (
    <>
      <PageLayout title={S('vedas.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('vedas.title')) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        
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
