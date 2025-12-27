/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';



export const generateMetadata = createGenerateMetadata('scriptures_puranas');

export default function PuranasPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc: any = getLocaleObject(locale) || {};
  const puranas = loc?.puranas || {};
  const title = puranas.title || t('puranas.title', locale) || '';
  return (
    <>
      <main className="content-wrapper md page-space-xl">
        
        <h2>{title} - {puranas.classification}</h2>
        <p>{puranas.definition}</p>

        <div>
          <p>{S('puranas.purpose')}</p>
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
