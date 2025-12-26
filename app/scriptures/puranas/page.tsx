/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale, DEFAULT_LOCALE, getLocaleObject } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

export const generateMetadata = createGenerateMetadata('scriptures_puranas');

export default function PuranasPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const loc = getLocaleObject(locale) || {};
  const puranas = loc?.puranas || {};
  const title = puranas.title || t('puranas.title', locale) || '';
  return (
    <>
      <StructuredData metaKey="scriptures_puranas" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: title }]} locale={locale} />
        <h2>{title} - {puranas.classification}</h2>
        <p>{puranas.definition}</p>

        <div>
          <p>{t('puranas.purpose', locale)}</p>
          {/* Major Puranas */}
          {Array.isArray(puranas.major_puranas) && puranas.major_puranas.length > 0 && (
            <div>
              <p>Major Puranas :</p>
              <ul role="list" className="list-disc">
                {puranas.major_puranas.map((c: any, idx: number) => (
                  <li key={idx}>
                    <strong>{c.name}</strong> - {c.highlights ? <span>{c.highlights}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
