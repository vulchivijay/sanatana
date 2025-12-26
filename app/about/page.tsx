/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, DEFAULT_LOCALE, detectLocale } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('about', 'about.title', 'about.intro');

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
    <PageLayout metaKey="about" title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} locale={locale}>
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
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */