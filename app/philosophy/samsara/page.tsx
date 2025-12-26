/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, getLocaleObject } from '../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../../lib/pageUtils';



export const generateMetadata = createGenerateMetadata('philosophy_samsara');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const loc = getLocaleObject(locale) || {};
  const samsara = loc?.samsara_philosophy || {};
  const title = samsara.title || t('samsara_philosophy.title', locale) || 'Samsara Philosophy';

  return (
    <>
      <StructuredData metaKey="philosophy_samsara" />
         <PageLayout className="content-wrapper md page-space-xl" title={t('samsara.title', locale)}>
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} />
        <p><strong>Definition : </strong>{samsara.definition}</p>
        {/* Core Principles of Samsara */}
        <div>
          <p><strong>Core Principles of Samsara : </strong> {samsara.core_principles.map((s: string) => (<span>{s}, </span>))}</p>
          <ul role="list" className="list-disc">
            {Object.entries(samsara.origin).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Components of Samsara : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(samsara.components).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Relation to other concepts of Samsara : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(samsara.relation_to_other_concepts).map((cKey: any, idx: number) => {
              return <li key={idx}>
                <strong>{cKey[0]} - </strong><span>{cKey[1]}</span>
              </li>
            })}
          </ul>
          <p><strong>Modern Relevance of Samsara : </strong></p>
          <ul role="list" className="list-disc">
            {Object.entries(samsara.modern_relevance).map((cKey: any, idx: number) => {
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