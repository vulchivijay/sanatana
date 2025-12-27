/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';


import { t, detectLocale } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';


export const generateMetadata = createGenerateMetadata('shastras');

export default async function ShastrasPage() {
  const locale = await detectLocale();

  const S = (k: string) => String(t(k, locale));

  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          
          <h2>{S('shastrasPage.title')}</h2>
          <p>{S('shastrasPage.intro')}</p>

          <section>
            <h3>{S('shastrasPage.sectionsTitle')}</h3>
            <ul role="list" className="list-disc">
              <li><Link href="/shastras/dharma">{S('shastrasPage.sections.dharma')}</Link></li>
              <li><Link href="/shastras/artha">{S('shastrasPage.sections.artha')}</Link></li>
              <li><Link href="/shastras/vastu">{S('shastrasPage.sections.vastu')}</Link></li>
              <li><Link href="/shastras/natya">{S('shastrasPage.sections.natya')}</Link></li>
            </ul>
          </section>

          <section>
            <h4>{S('shastrasPage.influenceTitle')}</h4>
            <p>{S('shastrasPage.influenceText')}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
