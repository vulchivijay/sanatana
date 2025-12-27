import { t } from '../../lib/i18n';

import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import { PATHS } from '../../lib/sitemapPaths';
import { SUPPORTED_LOCALES } from '../../lib/i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';

export const dynamic = 'force-static';

export default function SitemapPage() {
  const S = (k: string) => String(t(k));

  return (
    <PageLayout title={'HTML Sitemap'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof title !== 'undefined' ? title : '') }]}>
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
    </PageLayout>
  );
}
