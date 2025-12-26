/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import { getMeta, detectLocale, t, DEFAULT_LOCALE } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PageLayout from '@components/common/PageLayout';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';


export const generateMetadata = createGenerateMetadata('our-cookie-policy');
export default function CookiePolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  return (
    <>
      <StructuredData metaKey="our-cookie-policy" />
      <PageLayout className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: t('policies.cookiePolicy.title', locale) }]} />
        <p>{t('policies.cookiePolicy.title', locale)}</p>
        <p>{t('policies.cookiePolicy.intro', locale)}</p>

        <p>{t('policies.cookiePolicy.whatAreCookies', locale)}</p>
        <p>{t('policies.cookiePolicy.whatAreCookiesDesc', locale) || 'Cookies are small text files stored on your device when you visit websites. They help websites remember preferences and improve your experience.'}</p>

        <p>{t('policies.cookiePolicy.typesHeading', locale)}</p>
        <ul role="list" className="list-disc">
          <li><strong>{t('policies.cookiePolicy.types.strictlyNecessary', locale)}</strong></li>
          <li><strong>{t('policies.cookiePolicy.types.functionality', locale)}</strong></li>
          <li><strong>{t('policies.cookiePolicy.types.performance', locale)}</strong></li>
          <li><strong>{t('policies.cookiePolicy.types.targeting', locale)}</strong></li>
        </ul>

        <p>{t('policies.cookiePolicy.managing', locale)}</p>
        <p>{t('policies.cookiePolicy.managingDesc', locale)}</p>

        <p>{t('policies.cookiePolicy.dataSharing', locale)}</p>
        <p>{t('policies.cookiePolicy.dataSharingDesc', locale)}</p>

        <p>{t('policies.cookiePolicy.lastUpdated', locale).replace('{date}', new Date().toLocaleDateString())}</p>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
