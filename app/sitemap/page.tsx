import React from 'react';
import Link from 'next/link';
import { PATHS } from '../../lib/sitemapPaths';
import { SUPPORTED_LOCALES } from '../../lib/i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';

export const dynamic = 'force-static';

export default function SitemapPage() {
  return (
    <main className="content-wrapper md page-space-xl">
      <h2>HTML Sitemap</h2>
      <p>A human-friendly sitemap of important pages (also available as XML at <Link href="/sitemap.xml">/sitemap.xml</Link>).</p>
      <ul role="list" className="list-disc">
        {PATHS.map((p) => (
          <li key={p}>
            <Link href={p}>{p === '/' ? SITE_URL : `${SITE_URL}${p}`}</Link>
            <div>Locales: {SUPPORTED_LOCALES.map((l) => (
              <span key={l}>{l === 'en' ? <Link href={p}>{l}</Link> : <Link href={`${p}?lang=${l}`}>{l}</Link>}</span>
            ))}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
