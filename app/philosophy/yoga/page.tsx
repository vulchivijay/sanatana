/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';

import PageLayout from '@components/common/PageLayout';


export const generateMetadata = createGenerateMetadata('philosophy_yoga');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc: any = getLocaleObject(locale) || {};
  const yoga = loc?.yoga_philosophy || {};
  const title = yoga.title || t('yoga_philosophy.title', locale) || 'Yoga Philosophy';

  return (
    <>
      <PageLayout title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} locale={locale}>
        
        <h2>{title}</h2>
        <p><strong>Definition : </strong>{yoga.definition}</p>
        {/* Core Principles of yoga */}
        <div>
          <p><strong>Core Principles of Yoga : </strong> {yoga.core_principles.map((s: string) => (<span>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(yoga.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Path of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(yoga.paths_of_yoga).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Eight limbs of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(yoga.eight_limbs_of_yoga).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Goals of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(yoga.goals).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(yoga.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Yoga : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(yoga.modern_relevance).map((cKey: any, idx: number) => {
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