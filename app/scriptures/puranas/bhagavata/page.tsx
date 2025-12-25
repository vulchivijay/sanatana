/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, detectLocale, getMeta } from '../../../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('scriptures_puranas_bhagavata', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}
export default function BhagavataPage() {
  const locale = detectLocale();

  return (
    <>
      <StructuredData metaKey="scriptures_puranas_bhagavata" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[
            { labelKey: 'nav.home', href: '/' },
            { labelKey: 'nav.puranas', href: '/puranas' },
            { labelKey: 'puranas.bhagavata.title' }
          ]} locale={locale} />
          <h2>{t('puranas.bhagavata.title', locale)}</h2>
          <p>{t('puranas.bhagavata.summary', locale)}</p>
          <section>
            <h3>{t('puranas.bhagavata.title', locale)}</h3>
            <p>{t('puranas.bhagavata.content', locale)}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
