/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';

import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('about', 'about.title', 'about.intro');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  const title = String(t('about.title', locale));
  const intro = String(t('about.intro', locale));
  const visionDesc = String(t('about.vision.description', locale));
  const focusAreas = (t('about.vision.focusAreas', locale) as unknown) || [];
  const goal = String(t('about.vision.goal', locale));
  const disclaimer = String(t('about.disclaimer', locale));
  const purpose = String(t('about.whyWeCreated.purpose', locale));
  const problemsAddressed = (t('about.whyWeCreated.problemsAddressed', locale) as unknown) || [];
  const commitment = (t('about.commitment', locale) as unknown) || [];

  const joinMsg = String(t('about.joinUs.message', locale));
  const joinInvite = (t('about.joinUs.invite', locale) as unknown) || [];

  return (
    <PageLayout metaKey="about" title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof title !== 'undefined' ? title : '') }]} locale={locale}>
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
        <p>{purpose}</p>
        <ul role="list" className="list-disc">
          {(problemsAddressed as string[]).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h5>Commitment</h5>
        <ul role="list" className="list-disc">
          {(commitment as string[]).map((c: string, i: number) => (
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