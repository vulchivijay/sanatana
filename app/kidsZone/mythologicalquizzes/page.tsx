import QuizClient from './QuizClient';

import { detectLocale, t } from '@/lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';


import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('kidsZone_mythologicalquizzes');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  const S = (k: string) => String(t(k, locale));

  return (
    <>
      <PageLayout title={S('kidsZone.mythologicalQuizzes.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('kidsZone.mythologicalQuizzes.title', locale)) }]} locale={locale}>
        <p>{S('kidsZone.mythologicalQuizzes.description', locale)}</p>
        <QuizClient />
      </PageLayout>
    </>
  );
}
