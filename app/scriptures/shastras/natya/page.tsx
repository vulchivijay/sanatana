/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import { t, detectLocale } from '../../../../lib/i18n';

import { createGenerateMetadata } from 'lib/pageUtils';


export default async function NatyaPage() {
  const locale = await detectLocale();

  const S = (k: string) => String(t(k, locale));


  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          
          <h2>{S('shastras.natya.title')}</h2>
          <p>{S('shastras.natya.summary')}</p>
          <section>
            <h3>{S('shastras.natya.title')}</h3>
            <p>{S('shastras.natya.content')}</p>
          </section>
        </div>
      </main>
    </>
  );
}


export const generateMetadata = createGenerateMetadata('scriptures_shastras_natya');
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
