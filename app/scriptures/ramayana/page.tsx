/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';



export const generateMetadata = createGenerateMetadata('scriptures_ramayana');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const loc = getLocaleObject(locale) || {};
  const ram = loc?.ramayana || {};
  const title = ram.title || t('ramayana.title', locale) || '';
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

          {/* Full ramayana kandas and sargas */}
          {ram.full_ramayana && typeof ram.full_ramayana === 'object' && (
            <div>
              <p>Ramayana (Kandas & Sargas)</p>
              {Object.keys(ram.full_ramayana).map((kkey: string, index: number) => {
                const kanda = (ram.full_ramayana as any)[kkey];
                if (!kanda) return null;
                return (
                  <div key={kkey}>
                    {kanda.kanda ? <p>{index + 1}. {kanda.kanda}</p> : <p>{kkey}</p>}
                    <div>
                      {kanda.description ? <p>{(typeof kanda.description === 'string') ? kanda.description : null}</p> : null}
                      {Array.isArray(kanda.sargas) && kanda.sargas.length > 0 && (
                        <div>
                          <ul role="list" className="list-disc">
                            {kanda.sargas.map((s: any) => (
                              <li key={s.sarga}>
                                <span>{s.title}</span>
                                {s.story ? <p><strong>Story: </strong>{(typeof s.story === 'string') ? s.story : null}</p> : null}
                                {s.lesson ? <p><strong>Lesson: </strong>{(typeof s.lesson === 'string') ? s.lesson : null}</p> : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */