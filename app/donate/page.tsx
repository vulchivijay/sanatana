/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from "next/link";
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, getMeta, detectLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../../lib/i18n';
import { headers } from 'next/headers';
import StructuredData from '@components/structured-data/StructuredData';
import PayPalButton from "../components/paypalbutton";
import Image from "next/image";

export async function generateMetadata(props: any) {
  const supported = SUPPORTED_LOCALES;
  let locale = DEFAULT_LOCALE;
  try {
    const hdrs = await headers();
    const cookie = hdrs.get('cookie') || '';
    const match = typeof cookie === 'string' ? cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
    if (match && supported.includes(match[1])) locale = match[1];
    else {
      const al = hdrs.get('accept-language');
      if (al && typeof al === 'string') {
        const first = al.split(',')[0].split(';')[0].trim();
        const primary = first.split('-')[0];
        if (supported.includes(primary)) locale = primary;
      }
    }
  } catch (err) {
    // fall back to DEFAULT_LOCALE
  }
  const meta = getMeta('donate', undefined, locale);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in'}/donate`,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
  };
}

export default function DonatePage() {
  const locale = detectLocale();

  return (
    <>
      <StructuredData metaKey="donate" />
      <main className="content-wrapper md page-space-xl page-donate">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.donate' }]} locale={locale} />
        <h2>{t('donatePage.title')}</h2>
        <p>{t('donatePage.lead')}</p>
        <section className="donation-wrapper">

          <h3>{t('donatePage.expansesTitle')}</h3>

          <div className="bg-white shadow-md rounded-xl overflow-auto">
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2">{t('donatePage.table.name')}</th>
                  <th className="border p-2">{t('donatePage.table.expanses')}</th>
                  <th className="border p-2">{t('donatePage.table.duration')}</th>
                  <th className="border p-2">{t('donatePage.table.reasons')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(t('donatePage.expenses', locale)) ? (
                  (t('donatePage.expenses', locale) as any[]).map((r, i) => (
                    <tr key={i}>
                      <td className="border p-2">{r.name}</td>
                      <td className="border p-2">{r.expanses}</td>
                      <td className="border p-2">{r.duration}</td>
                      <td className="border p-2">{r.provider}</td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>

          <h4>{t('donatePage.oneTime')}</h4>
          <div className="bg-white shadow-md rounded-xl">
            <p>{t('donatePage.oneTimeLead')}</p>
            <PayPalButton link="https://www.paypal.com/ncp/payment/WYDY7465MG69" />
          </div>

          <h5>{t('donatePage.upiBank')}</h5>
          <div className="bg-white shadow-md rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-start gap-10">
              <ul role="list" className="list-disc">
                <li>{t('donatePage.upiLead')}</li>
                <li><strong>{t('donatePage.upiLabel', locale)}</strong> {t('donatePage.upiId', locale)}</li>
                <li><strong>{t('donatePage.accountNameLabel', locale)}</strong> {t('donatePage.accountName', locale)}</li>
                <li><strong>{t('donatePage.accountNumberLabel', locale)}</strong> {t('donatePage.accountNumber', locale)}</li>
                <li><strong>{t('donatePage.ifscLabel', locale)}</strong> {t('donatePage.ifsc', locale)}</li>
              </ul>
              <b>(Or)</b>
              <figure>
                <Image src="/images/UPI-qrcode.png" alt="UPI QR Code" width={200} height={200} />
              </figure>
            </div>
          </div>

          <div className="bg-white shadow-md hidden">
            <p>{t('donatePage.recurring')}</p>
            <p>{t('donatePage.recurringLead')}</p>
            <Link href="#">
              {t('donatePage.becomeMonthly')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */