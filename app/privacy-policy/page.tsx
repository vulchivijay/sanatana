/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import PageLayout from '@components/common/PageLayout';

import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';


export const generateMetadata = createGenerateMetadata('privacy_policy');

export default async function PrivacyPolicy() {
  const locale = await detectLocale();

  const S = (k: string) => String(t(k, locale));

  return (
    <>
      <PageLayout title={S('privacy.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('privacy.title')) }]} locale={locale}>
        <div>
          
          <h2>{S('privacy.title')}</h2>
          <div>
            <div>
              <p>
                <strong>{S('privacy.lastUpdated')}</strong> {S('privacy.lastUpdated')}
              </p>

              <h3>{S('privacy.intro.title')}</h3>
              <p>{S('privacy.intro.text')}</p>

              <h4>{S('privacy.informationWeCollect.title')}</h4>
              <p>{S('privacy.informationWeCollect.lead')}</p>
              <ul role="list" className="list-disc">
                <li><strong>{S('privacy.informationWeCollect.usageLabel', locale)}</strong> {S('privacy.informationWeCollect.usage', locale)}</li>
                <li><strong>{S('privacy.informationWeCollect.deviceLabel', locale)}</strong> {S('privacy.informationWeCollect.device', locale)}</li>
                <li><strong>{S('privacy.informationWeCollect.cookiesLabel', locale)}</strong> {S('privacy.informationWeCollect.cookies', locale)}</li>
                <li><strong>{S('privacy.informationWeCollect.contactLabel', locale)}</strong> {S('privacy.informationWeCollect.contact', locale)}</li>
              </ul>

              <h5>{S('privacy.howWeUse.title')}</h5>
              <p>{S('privacy.howWeUse.lead')}</p>
              <ul role="list" className="list-disc">
                {S('privacy.howWeUse.items').map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h6>{S('privacy.cookiesLocalStorage.title')}</h6>
              <p>{S('privacy.cookiesLocalStorage.text')}</p>

              <p>{S('privacy.thirdParty.title')}</p>
              <p>{S('privacy.thirdParty.text')}</p>

              <p>{S('privacy.security.title')}</p>
              <p>{S('privacy.security.text')}</p>

              <p>{S('privacy.rights.title')}</p>
              <p>{S('privacy.rights.lead')}</p>
              <ul role="list" className="list-disc">
                {S('privacy.rights.items').map((it: string, idx: number) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
              <p>{S('privacy.rights.contactText')}</p>

              <p>{S('privacy.children.title')}</p>
              <p>{S('privacy.children.text')}</p>

              <p>{S('privacy.changes.title')}</p>
              <p>{S('privacy.changes.text')}</p>

              <p>{S('privacy.contact.title')}</p>
              <p>{S('privacy.contact.lead')}</p>
              <p>
                <strong>{S('privacy.contact.emailLabel')}</strong> {S('privacy.contact.email')}
              </p>
              <p>
                <strong>{S('privacy.contact.websiteLabel')}</strong> <a href="https://sanatanadharmam.in">{S('privacy.contact.website')}</a>
              </p>

              <p>{S('privacy.contact.closing')}</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
