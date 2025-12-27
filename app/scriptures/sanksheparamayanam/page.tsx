/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';



export const generateMetadata = createGenerateMetadata('scriptures_sanksheparamayana');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc: any = getLocaleObject(locale) || {};
  const ram = loc?.sanksheparamayana || {};
  const title = ram.title || t('sanksheparamayana.title', locale) || '';
  const author = ram.source || '';

  // Description in the JSON may be an object keyed by language (e.g. { en: "...", te: "..." })
  let description: string = '';
  if (typeof ram.description === 'string') description = ram.description;
  else if (ram.description && typeof ram.description === 'object') description = ram.description[locale] || ram.description['translate'] || '';

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        
        <h2>{title}</h2>
        <p><strong>Source: </strong>{author} - {description ? <span>{description}</span> : null}</p>

        {/* Structured display of all ramayana fields */}
        <div>
          {/* Main characters */}
          {Array.isArray(ram.main_characters) && ram.main_characters.length > 0 && (
            <div>
              <h3>Main Characters</h3>
              <ul role="list" className="list-disc">
                {ram.main_characters.map((c: any, idx: number) => (
                  <li key={idx}>
                    <strong>{c.name}</strong> - {c.role ? <span>{c.role}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Important places */}
          {Array.isArray(ram.important_places) && ram.important_places.length > 0 && (
            <div>
              <h4>Important Places</h4>
              <ul role="list" className="list-disc">
                {ram.important_places.map((p: any, idx: number) => (
                  <li key={idx}>
                    <strong>{p.name}</strong> - {p.desc ? <span>{p.desc}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          {Array.isArray(ram.timeline) && ram.timeline.length > 0 && (
            <div>
              <h5>Timeline</h5>
              <ol role="list" className="list-disc">
                {ram.timeline.map((ev: any, idx: number) => (
                  <li key={idx}>
                    <strong>{ev.event}</strong> - {ev.desc ? <span>{ev.desc}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Core themes */}
          {Array.isArray(ram.core_themes) && ram.core_themes.length > 0 && (
            <div>
              <h6>Core Themes</h6>
              <ul role="list" className="list-disc">
                {ram.core_themes.map((ct: any, idx: number) => (
                  <li key={idx}>{(typeof ct.title === 'string') ? ct.title : ct['title']}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sankshepa ramayanam and slokas */}
          {ram.slokas.map((s: any) => (
            <div key={s.sloka}>
              <p className="text-2xl! font-semibold text-center">{s.sanskrit}</p>
              <p>{s.english}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */