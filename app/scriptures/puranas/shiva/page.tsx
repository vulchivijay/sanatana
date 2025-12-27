/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';




export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('scriptures_puranas_shiva', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}
export default function ShivaPage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          
          <h2>{S('puranas.shiva.title')}</h2>
          <p>{S('puranas.shiva.summary')}</p>
          <section>
            <h3>{S('puranas.shiva.title')}</h3>
            <p>{S('puranas.shiva.content')}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
