/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Image from "next/image";
import ContactForm from "../components/contact/ContactForm";
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { t, getMeta, detectLocale } from '../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams as any);
  const meta = getMeta('contact', undefined, locale);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in'}/contact`,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
  };
}

export default async function ContactPage() {
  const locale = await detectLocale();
  return (
    <>
      <StructuredData metaKey="contact" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { labelKey: 'nav.contact' }]} locale={locale} />
        <h2>{t('contactPage.title')}</h2>
        <p>{t('contactPage.lead')}</p>
        <section className="flex flex-col md:flex-row items-start justify-start gap-5">
          <div className="w-full md:w-1/2">
            <h3>{t('contactPage.getInTouch')}</h3>
            <p>{t('contactPage.useForm')} <a href="mailto:vulchi.vijay@gmail.com">vulchi.vijay@gmail.com</a>.</p>
            <div>
              <div>
                <h4>{t('contactPage.mailingAddress')}</h4>
                <p>{t('contactPage.addressLine1')}<br />{t('contactPage.addressLine2')}<br />{t('contactPage.addressLine3')}</p>
              </div>
              <div>
                <h5>{t('contactPage.phone')}</h5>
                <p>+91-80991-81075</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 contact-form-wrapper bg-white shadow-md rounded-xl">
            <p>{t('contactPage.sendMessage')}</p>
            <ContactForm />
          </div>
        </section>
        <section>
          <p>{t('contactPage.location')}</p>
          <div className="bg-white p-4">
            <Image src="/images/map-location.png" alt="map location" width="1200" height="600" />
          </div>
        </section>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
