/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';


import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';

import PayPalButton from '../components/paypalbutton';
import Image from 'next/image';
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('donate');

export default function DonatePage() {
  const locale = detectLocale();

  const S = (k: string) => String(t(k, locale));

  const title = String(t('donatePage.title', locale));
  const lead = String(t('donatePage.lead', locale));
  const expansesTitle = String(t('donatePage.expansesTitle', locale));
  const tableName = String(t('donatePage.table.name', locale));
  const tableExpanses = String(t('donatePage.table.expanses', locale));
  const tableDuration = String(t('donatePage.table.duration', locale));
  const tableReasons = String(t('donatePage.table.reasons', locale));
  const expenses = (t('donatePage.expenses', locale) as any[]) || [];
  const oneTime = String(t('donatePage.oneTime', locale));
  const oneTimeLead = String(t('donatePage.oneTimeLead', locale));
  const upiTitle = String(t('donatePage.upiBank', locale));
  const upiLead = String(t('donatePage.upiLead', locale));
  const upiLabel = String(t('donatePage.upiLabel', locale));
  const upiId = String(t('donatePage.upiId', locale));
  const accountNameLabel = String(t('donatePage.accountNameLabel', locale));
  const accountName = String(t('donatePage.accountName', locale));
  const accountNumberLabel = String(t('donatePage.accountNumberLabel', locale));
  const accountNumber = String(t('donatePage.accountNumber', locale));
  const ifscLabel = String(t('donatePage.ifscLabel', locale));
  const ifsc = String(t('donatePage.ifsc', locale));
  const recurring = String(t('donatePage.recurring', locale));
  const recurringLead = String(t('donatePage.recurringLead', locale));
  const becomeMonthly = String(t('donatePage.becomeMonthly', locale));

  return (
    <>
      <PageLayout title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof title !== 'undefined' ? title : '') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        
        <h2>{title}</h2>
        <p>{lead}</p>
        <section className="donation-wrapper">

          <h3>{expansesTitle}</h3>

          <div className="bg-white shadow-md rounded-xl overflow-auto">
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2">{tableName}</th>
                  <th className="border p-2">{tableExpanses}</th>
                  <th className="border p-2">{tableDuration}</th>
                  <th className="border p-2">{tableReasons}</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((r: any, i: number) => (
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

          <h4>{oneTime}</h4>
          <div className="bg-white shadow-md rounded-xl">
            <p>{oneTimeLead}</p>
            <PayPalButton link="https://www.paypal.com/ncp/payment/WYDY7465MG69" />
          </div>

          <h5>{upiTitle}</h5>
          <div className="bg-white shadow-md rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-start gap-10">
              <ul role="list" className="list-disc">
                <li>{upiLead}</li>
                <li><strong>{upiLabel}</strong> {upiId}</li>
                <li><strong>{accountNameLabel}</strong> {accountName}</li>
                <li><strong>{accountNumberLabel}</strong> {accountNumber}</li>
                <li><strong>{ifscLabel}</strong> {ifsc}</li>
              </ul>
              <b>(Or)</b>
              <figure>
                <Image src="/images/UPI-qrcode.png" alt="UPI QR Code" width={200} height={200} />
              </figure>
            </div>
          </div>

          <div className="bg-white shadow-md hidden">
            <p>{S('donatePage.recurring')}</p>
            <p>{S('donatePage.recurringLead')}</p>
            <Link href="#">
              {S('donatePage.becomeMonthly')}
            </Link>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */