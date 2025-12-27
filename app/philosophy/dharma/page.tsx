/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('philosophy_dharma');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc = getLocaleObject(locale) || {};
  const dharma = loc?.dharma_philosophy || {};
  const title = dharma.title || t('dharma_philosophy.title', locale) || 'Dharma Philosophy';

  return (
    <>
      <PageLayout title={S('dharma.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('dharma.title', locale)) }]} locale={locale}>
        
        <h2>{title}</h2>
        <p><strong>Definition : </strong>{dharma.definition.map((s: string) => (<span>{s}, </span>))}</p>
        {/* Categories of Dharma */}
        <div>
          <h3>Categories of Dharma :</h3>
          <ul role="list" className="list-disc">
            {Object.entries(dharma.categories_of_dharma).map((cKey: any, idx: number) => {
              const { meaning, examples } = cKey[1];
              return <li key={idx}>
                <strong>{meaning}</strong> - {Array.isArray(examples) ? <span>{examples}</span> : null}
              </li>
            })}
          </ul>
          <p><strong>Philosophical dimensionsGoals of Dharma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(dharma.philosophical_dimensions).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Core principles of Dharma : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(dharma.core_principles).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Dharma in Ramayana : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(dharma.dharma_in_ramayana).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
        </div>
         </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
