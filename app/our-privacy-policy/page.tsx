/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import { getMeta, detectLocale, t, DEFAULT_LOCALE } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';


export const generateMetadata = createGenerateMetadata('our-privacy-policy');
export default function PrivacyPolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  return (
    <>
      <StructuredData metaKey="our-privacy-policy" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: t('policies.privacyPolicy.title', locale) }]} />
        <h2>{t('policies.privacyPolicy.title', locale)}</h2>
        <p>{t('policies.privacyPolicy.intro', locale)}</p>

        <h3>{t('policies.privacyPolicy.informationHeading', locale)}</h3>
        <p>{t('policies.privacyPolicy.informationDesc', locale)}</p>

        <h4>{t('policies.privacyPolicy.howWeUse', locale)}</h4>
        <p>{t('policies.privacyPolicy.howWeUseDesc', locale)}</p>

        <h5>{t('policies.privacyPolicy.yourRights', locale)}</h5>
        <p>{t('policies.privacyPolicy.yourRightsDesc', locale)}</p>

        <p>{t('policies.privacyPolicy.lastUpdated', locale).replace('{date}', new Date().toLocaleDateString())}</p>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
