/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale } from '../../../lib/i18n';

type Props = {
  metaKey: string;
  params?: any;
  locale?: string;
};

// Server component that renders JSON-LD for a given metaKey.
export default async function StructuredData({ metaKey, params, locale }: Props) {
  const loc = locale ?? await detectLocale(params);
  const meta = getMeta(metaKey, params, loc) || {};

  const webpage: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title || undefined,
    description: meta.description || undefined,
    url: meta.url || undefined,
  };

  // Detect if this metaKey likely represents an article-like page (stories, scriptures, stotras, chapters)
  const articlePattern = /(stories_|scriptures_|stotras|chapter|mahabharata|ramayana|gita|stories)/i;
  const isArticle = articlePattern.test(metaKey) || (meta.description && String(meta.description).length > 80);

  // Build Article JSON-LD when appropriate
  let article: Record<string, any> | null = null;
  if (isArticle) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
    const img = meta.ogImage ? (String(meta.ogImage).startsWith('/') ? `${SITE_URL}${meta.ogImage}` : meta.ogImage) : undefined;

    article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url || SITE_URL },
      headline: meta.title || undefined,
      description: meta.description || undefined,
      image: img ? [img] : undefined,
      author: { '@type': 'Person', name: (meta.author || 'Sanatana Dharma') },
      publisher: { '@type': 'Organization', name: 'Sanatana Dharma', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/svg/globe.svg` } },
      datePublished: meta.datePublished || undefined,
    };
    Object.keys(article).forEach((k) => article && article[k] === undefined && delete article[k]);
  }

  // Clean webpage
  Object.keys(webpage).forEach((k) => webpage[k] === undefined && delete webpage[k]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} />
      {article && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />}
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */