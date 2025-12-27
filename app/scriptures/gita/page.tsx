/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';


import { locales } from '../../../lib/i18n';
import Image from 'next/image';
import Link from 'next/link';
const en = locales.en;

export const generateMetadata = createGenerateMetadata('scriptures_bhagavadgita');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const title = t('bhagavadgita.title', locale) || '';
  return (
    <>
      <main className="content-wrapper lg page-space-xl">
        
        <h2>{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(t('bhagavadgita.chapters', locale) || []).map((item: any, i: number) => {
            // Determine chapter number robustly: prefer explicit numeric fields, else fallback to index+1
            const chapRaw = item?.chapter ?? item?.chapter_number;
            let chapNumVal = Number(chapRaw);
            if (!Number.isFinite(chapNumVal) || chapNumVal < 1) {
              chapNumVal = i + 1;
            }
            const chapNum = String(Math.trunc(chapNumVal));
            const chapTitle = item.name || item.title || `Chapter ${chapNum}`;
            const excerpt = item.introduction?.summary || item.summary || '';
            // Prefer the chapter's localized ai_images[0], otherwise fall back to English canonical ai_images[0]
            const enChapter = (en as any)?.bhagavadgita?.chapters?.[Number(chapNum) - 1];
            const enAi0 = enChapter?.ai_images && enChapter.ai_images[0] ? enChapter.ai_images[0] : undefined;
            const imgSrc = item?.ai_images?.[0]?.imageSrc || enAi0?.imageSrc || '/og/gita.png';
            const imgAlt = item?.ai_images?.[0]?.alt || enAi0?.alt || `${chapTitle}`;

            return (
              <Link key={i} href={`/scriptures/gita/chapter/${chapNum}`} className="block no-underline">
                <article className="h-full bg-white dark:bg-slate-800 rounded-md! shadow hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col">
                  <div className="relative w-full h-44 rounded-md overflow-hidden bg-gray-100">
                    <Image src={imgSrc} alt={imgAlt} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="rounded-md! shadow-sm flex-1">
                    <p>{`Chapter ${chapNum}: ${chapTitle}`}</p>
                    {excerpt ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{excerpt}</p> : null}
                  </div>
                  <div>
                    <span className="inline-block font-medium text-indigo-600 dark:text-indigo-400">Read chapter</span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
