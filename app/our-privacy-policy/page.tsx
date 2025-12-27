/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { detectLocale, t } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';




export const generateMetadata = createGenerateMetadata('our-privacy-policy');
export default function PrivacyPolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <main className="content-wrapper md page-space-xl">
        
        <h2>{S('policies.privacyPolicy.title')}</h2>
        <p>{S('policies.privacyPolicy.intro')}</p>

        <h3>{S('policies.privacyPolicy.informationHeading')}</h3>
        <p>{S('policies.privacyPolicy.informationDesc')}</p>

        <h4>{S('policies.privacyPolicy.howWeUse')}</h4>
        <p>{S('policies.privacyPolicy.howWeUseDesc')}</p>

        <h5>{S('policies.privacyPolicy.yourRights')}</h5>
        <p>{S('policies.privacyPolicy.yourRightsDesc')}</p>

        <p>{S('policies.privacyPolicy.lastUpdated').replace('{date}', new Date().toLocaleDateString())}</p>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
