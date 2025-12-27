/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { detectLocale, t } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';

import PageLayout from '@components/common/PageLayout';



export const generateMetadata = createGenerateMetadata('our-cookie-policy');
export default function CookiePolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <PageLayout breadcrumbs={[{ labelKey: 'nav.home', href: '/' }]} locale={locale}>
        
        <p>{S('policies.cookiePolicy.title', locale)}</p>
        <p>{S('policies.cookiePolicy.intro', locale)}</p>

        <p>{S('policies.cookiePolicy.whatAreCookies', locale)}</p>
        <p>{S('policies.cookiePolicy.whatAreCookiesDesc', locale) || 'Cookies are small text files stored on your device when you visit websites. They help websites remember preferences and improve your experience.'}</p>

        <p>{S('policies.cookiePolicy.typesHeading', locale)}</p>
        <ul role="list" className="list-disc">
          <li><strong>{S('policies.cookiePolicy.types.strictlyNecessary', locale)}</strong></li>
          <li><strong>{S('policies.cookiePolicy.types.functionality', locale)}</strong></li>
          <li><strong>{S('policies.cookiePolicy.types.performance', locale)}</strong></li>
          <li><strong>{S('policies.cookiePolicy.types.targeting', locale)}</strong></li>
        </ul>

        <p>{S('policies.cookiePolicy.managing', locale)}</p>
        <p>{S('policies.cookiePolicy.managingDesc', locale)}</p>

        <p>{S('policies.cookiePolicy.dataSharing', locale)}</p>
        <p>{S('policies.cookiePolicy.dataSharingDesc', locale)}</p>

        <p>{S('policies.cookiePolicy.lastUpdated', locale).replace('{date}', new Date().toLocaleDateString())}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
