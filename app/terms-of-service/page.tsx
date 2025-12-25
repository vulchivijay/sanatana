/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { getMeta, t, detectLocale } from '../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  // For static export, searchParams will be undefined or a plain object, never a promise
  const locale = await detectLocale(searchParams as any);
  const meta = getMeta('terms', undefined, locale);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in'}/terms-of-service`,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' },
  };
}

export default async function TermsOfService() {
  const locale = await detectLocale();

  return (
    <>
      <StructuredData metaKey="terms-of-service" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'footer.terms' }]} locale={locale} />
          <h2>{t('terms.title', locale)}</h2>
          <div>
            <p>
              <strong>{t('terms.lastUpdated', locale)}</strong> {t('terms.lastUpdated', locale)}
            </p>

            <h3>{t('terms.acceptanceTitle', locale)}</h3>
            <p>{t('terms.intro', locale)}</p>

            <h4>{t('terms.useLicenseTitle', locale)}</h4>
            <p>{t('terms.useLicenseText', locale)}</p>
            <ul role="list" className="list-disc">
              <li>{t('terms.useLicenseList.modification', locale)}</li>
              <li>{t('terms.useLicenseList.copying', locale)}</li>
              <li>{t('terms.useLicenseList.unauthorizedAccess', locale)}</li>
              <li>{t('terms.useLicenseList.reverseEngineering', locale)}</li>
              <li>{t('terms.useLicenseList.interfering', locale)}</li>
            </ul>

            <h5>{t('terms.intellectualTitle', locale)}</h5>
            <p>{t('terms.intellectualText', locale)}</p>

            <h6>{t('terms.userConductTitle', locale)}</h6>
            <p>{t('terms.userConductIntro', locale)}</p>
            <ul role="list" className="list-disc">
              <li>{t('terms.userConductList.unlawful', locale)}</li>
              <li>{t('terms.userConductList.harassment', locale)}</li>
              <li>{t('terms.userConductList.malware', locale)}</li>
              <li>{t('terms.userConductList.violateLaw', locale)}</li>
              <li>{t('terms.userConductList.spam', locale)}</li>
              <li>{t('terms.userConductList.bypass', locale)}</li>
            </ul>

            <p>{t('terms.disclaimerTitle', locale)}</p>
            <p>{t('terms.disclaimerText', locale)}</p>
            <ul role="list" className="list-disc">
              <li>{t('terms.disclaimerList.accuracy', locale)}</li>
              <li>{t('terms.disclaimerList.functionality', locale)}</li>
              <li>{t('terms.disclaimerList.errors', locale)}</li>
              <li>{t('terms.disclaimerList.quality', locale)}</li>
            </ul>
            <p>{t('terms.disclaimerClosing', locale)}</p>

            <p>{t('terms.liabilityTitle', locale)}</p>
            <p>{t('terms.liabilityText', locale)}</p>

            <p>{t('terms.externalLinksTitle', locale)}</p>
            <p>{t('terms.externalLinksText', locale)}</p>

            <p>{t('terms.modificationsTitle', locale)}</p>
            <p>{t('terms.modificationsText', locale)}</p>

            <p>{t('terms.terminationTitle', locale)}</p>
            <p>{t('terms.terminationText', locale)}</p>

            <p>{t('terms.indemnificationTitle', locale)}</p>
            <p>{t('terms.indemnificationText', locale)}</p>

            <p>{t('terms.governingTitle', locale)}</p>
            <p>{t('terms.governingTitle', locale)}</p>

            <p>{t('terms.severabilityTitle', locale)}</p>
            <p>{t('terms.severabilityTitle', locale)}</p>

            <p>{t('terms.contactTitle', locale)}</p>
            <p>{t('terms.contactTitle', locale)}</p>
            <p><strong>{t('terms.contactEmailLabel', locale)}</strong> {t('terms.contactEmail', locale)}</p>
            <p><strong>{t('terms.contactWebsiteLabel', locale)}</strong> <a href="https://sanatanadharmam.in">{t('terms.contactWebsite', locale)}</a></p>

            <p>{t('terms.closing', locale)}</p>
          </div>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
