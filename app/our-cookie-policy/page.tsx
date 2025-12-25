/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import { getMeta, detectLocale, t, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from '../../lib/i18n';
import { headers } from 'next/headers';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('our-cookie-policy', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}
export default function CookiePolicyPage({ searchParams }: any) {
  function resolveLocaleFromHeaders() {
    try {
      const h: any = headers();
      return detectServerLocaleFromHeaders(h);
    } catch (e) {
      return DEFAULT_LOCALE;
    }
  }

  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  return (
    <>
      <StructuredData metaKey="our-cookie-policy" />
      <main className="content-wrapper md page-space-xl">
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
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
