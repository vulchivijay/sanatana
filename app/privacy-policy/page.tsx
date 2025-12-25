/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, getMeta, detectLocale } from '../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams as any);
  const meta = getMeta('privacy_policy', undefined, locale);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in'}/privacy-policy`,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' },
  };
}

export default async function PrivacyPolicy() {
  const locale = await detectLocale();
  return (
    <>
      <StructuredData metaKey="privacy-policy" />
      <main className="content-wrapper md page-space-xl">
        <div>
          <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'footer.privacy' }]} locale={locale} />
          <h2>{t('privacy.title')}</h2>
          <div>
            <div>
              <p>
                <strong>{t('privacy.lastUpdated')}</strong> {t('privacy.lastUpdated')}
              </p>

              <h3>{t('privacy.intro.title')}</h3>
              <p>{t('privacy.intro.text')}</p>

              <h4>{t('privacy.informationWeCollect.title')}</h4>
              <p>{t('privacy.informationWeCollect.lead')}</p>
              <ul role="list" className="list-disc">
                <li><strong>{t('privacy.informationWeCollect.usageLabel', locale)}</strong> {t('privacy.informationWeCollect.usage', locale)}</li>
                <li><strong>{t('privacy.informationWeCollect.deviceLabel', locale)}</strong> {t('privacy.informationWeCollect.device', locale)}</li>
                <li><strong>{t('privacy.informationWeCollect.cookiesLabel', locale)}</strong> {t('privacy.informationWeCollect.cookies', locale)}</li>
                <li><strong>{t('privacy.informationWeCollect.contactLabel', locale)}</strong> {t('privacy.informationWeCollect.contact', locale)}</li>
              </ul>

              <h5>{t('privacy.howWeUse.title')}</h5>
              <p>{t('privacy.howWeUse.lead')}</p>
              <ul role="list" className="list-disc">
                {t('privacy.howWeUse.items').map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h6>{t('privacy.cookiesLocalStorage.title')}</h6>
              <p>{t('privacy.cookiesLocalStorage.text')}</p>

              <p>{t('privacy.thirdParty.title')}</p>
              <p>{t('privacy.thirdParty.text')}</p>

              <p>{t('privacy.security.title')}</p>
              <p>{t('privacy.security.text')}</p>

              <p>{t('privacy.rights.title')}</p>
              <p>{t('privacy.rights.lead')}</p>
              <ul role="list" className="list-disc">
                {t('privacy.rights.items').map((it: string, idx: number) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
              <p>{t('privacy.rights.contactText')}</p>

              <p>{t('privacy.children.title')}</p>
              <p>{t('privacy.children.text')}</p>

              <p>{t('privacy.changes.title')}</p>
              <p>{t('privacy.changes.text')}</p>

              <p>{t('privacy.contact.title')}</p>
              <p>{t('privacy.contact.lead')}</p>
              <p>
                <strong>{t('privacy.contact.emailLabel')}</strong> {t('privacy.contact.email')}
              </p>
              <p>
                <strong>{t('privacy.contact.websiteLabel')}</strong> <a href="https://sanatanadharmam.in">{t('privacy.contact.website')}</a>
              </p>

              <p>{t('privacy.contact.closing')}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
