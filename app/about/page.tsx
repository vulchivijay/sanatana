/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, DEFAULT_LOCALE, detectServerLocaleFromHeaders, detectLocale } from '../../lib/i18n';
import { headers } from 'next/headers';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export async function generateMetadata({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('about.title', locale);
  const meta = getMeta('about', {}, locale);
  return {
    title,
    description: t('about.intro', locale) || meta.description,
    keywords: meta.keywords || undefined,
    openGraph: { title, description: t('about.intro', locale) || meta.description },
  };
}

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const title = t('about.title', locale);
  const intro = t('about.intro', locale);
  const visionDesc = t('about.vision.description', locale);
  const focusAreas = t('about.vision.focusAreas', locale) || [];
  const goal = t('about.vision.goal', locale);
  const disclaimer = t('about.disclaimer', locale);

  const joinMsg = t('about.joinUs.message', locale);
  const joinInvite = t('about.joinUs.invite', locale) || [];

  return (
    <>
      <StructuredData metaKey="about" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} />
        <h2>{title}</h2>
        <p>{intro}</p>

        <div>
          <h3>Vision</h3>
          <p>{visionDesc}</p>
          {Array.isArray(focusAreas) && (
            <ul role="list" className="list-disc">
              {focusAreas.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
          {goal && <p><strong>Goal:</strong> {goal}</p>}
        </div>

        <div>
          <h4>Why we created this</h4>
          <p>{t('about.whyWeCreated.purpose', locale)}</p>
          <ul role="list" className="list-disc">
            {(t('about.whyWeCreated.problemsAddressed', locale) || []).map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <h5>Commitment</h5>
          <ul role="list" className="list-disc">
            {(t('about.commitment', locale) || []).map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {joinMsg && (
          <div>
            <h6>Join us</h6>
            <p>{joinMsg}</p>
            {Array.isArray(joinInvite) && (
              <ul role="list" className="list-disc">
                {joinInvite.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
              </ul>
            )}
          </div>
        )}

        {disclaimer && <p>{disclaimer}</p>}
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */