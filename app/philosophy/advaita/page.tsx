/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('philosophy_advaita');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc = getLocaleObject(locale) || {};
  const advaita = loc?.advaita_philosophy || {};
  const title = advaita.title || t('advaita_philosophy.title', locale) || 'Advaita Philosophy';

  return (
    <>
      <PageLayout title={S('advaita.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('advaita.title', locale)) }]} locale={locale}>
        
        <h2>{title}</h2>
        <p><strong>Definition : </strong>{advaita.definition}</p>
        {/* Core Principles of Advaita */}
        <div>
          <p><strong>Core Principles of Advaita : </strong> {advaita.core_principles.map((s: string) => (<span>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(advaita.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Key concepts of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(advaita.key_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Paths torealization of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(advaita.paths_to_realization).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(advaita.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(advaita.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Advaita : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(advaita.modern_relevance).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */