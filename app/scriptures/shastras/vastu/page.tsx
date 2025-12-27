/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale, getMeta } from '../../../../lib/i18n';



export default async function VastuPage() {
  const locale = await detectLocale();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          
          <h2>{await t('shastras.vastu.title', locale)}</h2>
          <p>{await t('shastras.vastu.summary', locale)}</p>
          <section>
            <h3>{await t('shastras.vastu.title', locale)}</h3>
            <p>{await t('shastras.vastu.content', locale)}</p>
          </section>
        </div>
      </main>
    </>
  );
}


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_shastras_vastu', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
