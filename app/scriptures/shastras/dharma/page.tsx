/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';



export default async function DharmaPage() {
  const locale = await detectLocale();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          
          <h2>{S('shastras.dharma.title')}</h2>
          <p>{S('shastras.dharma.summary')}</p>
          <section>
            <h3>{S('shastras.dharma.title')}</h3>
            <p>{S('shastras.dharma.content')}</p>
          </section>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_shastras_dharma', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
