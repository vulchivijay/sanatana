import QuizClient from "./QuizClient";
import { getMeta, detectLocale, t, DEFAULT_LOCALE } from "@/lib/i18n";
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import StructuredData from "@components/structured-data/StructuredData";
import Breadcrumbs from "@components/breadcrumbs/breadcrumbs";
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('kidsZone_mythologicalquizzes');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  return (
    <>
      <StructuredData metaKey="kidsZone_mythologicalquizzes" />
      <PageLayout className="content-wrapper md page-space-xl" title={t('kidsZone.mythologicalQuizzes.title', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: t('kidsZone.mythologicalQuizzes.title', locale) }]}>
        <p>{t('kidsZone.mythologicalQuizzes.description', locale)}</p>
        <QuizClient />
      </PageLayout>
    </>
  );
}
