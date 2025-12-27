/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('terms');

export default async function TermsOfService() {
  const locale = await detectLocale();
  const S = (k: string) => String(t(k, locale));

  return (
    <PageLayout metaKey="terms-of-service" title={S('terms.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('terms.title')) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
      <div>
        <p>
          <strong>{S('terms.lastUpdated')}</strong> {S('terms.lastUpdated')}
        </p>

        <h3>{S('terms.acceptanceTitle')}</h3>
        <p>{S('terms.intro')}</p>

        <h4>{S('terms.useLicenseTitle')}</h4>
        <p>{S('terms.useLicenseText')}</p>
        <ul role="list" className="list-disc">
          <li>{S('terms.useLicenseList.modification')}</li>
          <li>{S('terms.useLicenseList.copying')}</li>
          <li>{S('terms.useLicenseList.unauthorizedAccess')}</li>
          <li>{S('terms.useLicenseList.reverseEngineering')}</li>
          <li>{S('terms.useLicenseList.interfering')}</li>
        </ul>

        <h5>{S('terms.intellectualTitle')}</h5>
        <p>{S('terms.intellectualText')}</p>

        <h6>{S('terms.userConductTitle')}</h6>
        <p>{S('terms.userConductIntro')}</p>
        <ul role="list" className="list-disc">
          <li>{S('terms.userConductList.unlawful')}</li>
          <li>{S('terms.userConductList.harassment')}</li>
          <li>{S('terms.userConductList.malware')}</li>
          <li>{S('terms.userConductList.violateLaw')}</li>
          <li>{S('terms.userConductList.spam')}</li>
          <li>{S('terms.userConductList.bypass')}</li>
        </ul>

        <p>{S('terms.disclaimerTitle')}</p>
        <p>{S('terms.disclaimerText')}</p>
        <ul role="list" className="list-disc">
          <li>{S('terms.disclaimerList.accuracy')}</li>
          <li>{S('terms.disclaimerList.functionality')}</li>
          <li>{S('terms.disclaimerList.errors')}</li>
          <li>{S('terms.disclaimerList.quality')}</li>
        </ul>
        <p>{S('terms.disclaimerClosing')}</p>

        <p>{S('terms.liabilityTitle')}</p>
        <p>{S('terms.liabilityText')}</p>

        <p>{S('terms.externalLinksTitle')}</p>
        <p>{S('terms.externalLinksText')}</p>

        <p>{S('terms.modificationsTitle')}</p>
        <p>{S('terms.modificationsText')}</p>

        <p>{S('terms.terminationTitle')}</p>
        <p>{S('terms.terminationText')}</p>

        <p>{S('terms.indemnificationTitle')}</p>
        <p>{S('terms.indemnificationText')}</p>

        <p>{S('terms.governingTitle')}</p>
        <p>{S('terms.governingTitle')}</p>

        <p>{S('terms.severabilityTitle')}</p>
        <p>{S('terms.severabilityTitle')}</p>

        <p>{S('terms.contactTitle')}</p>
        <p>{S('terms.contactTitle')}</p>
        <p><strong>{S('terms.contactEmailLabel')}</strong> {S('terms.contactEmail')}</p>
        <p><strong>{S('terms.contactWebsiteLabel')}</strong> <a href="https://sanatanadharmam.in">{S('terms.contactWebsite')}</a></p>

        <p>{S('terms.closing')}</p>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
