import QuizClient from "./QuizClient";
import { getMeta, detectLocale, t, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from "@/lib/i18n";
import { headers } from 'next/headers';
import StructuredData from "@components/structured-data/StructuredData";
import Breadcrumbs from "@components/breadcrumbs/breadcrumbs";

export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('kidsZone_mythologicalquizzes', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined }
  };
}

function resolveLocaleFromHeaders() {
  try {
    const h: any = headers();
    return detectServerLocaleFromHeaders(h);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  return (
    <>
      <StructuredData metaKey="kidsZone_mythologicalquizzes" />
      <main className="content-wrapper md page-space-xl">
        <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: t('kidsZone.mythologicalQuizzes.title', locale) }]} />
        <h2>{t('kidsZone.mythologicalQuizzes.title', locale)}</h2>
        <p>{t('kidsZone.mythologicalQuizzes.description', locale)}</p>
        <QuizClient />
      </main>
    </>
  );
}
