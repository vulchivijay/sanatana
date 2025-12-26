import { t, DEFAULT_LOCALE } from '../../../lib/i18n';

export default function GayathriStotram({ locale }: { locale?: string }) {
  const loc = locale || DEFAULT_LOCALE;
  const heading = t('home.gayathri.heading', loc);
  return (
    <section className="bg-white">
      <div className="content-wrapper gayathri-stotram text-center">
        <h5 className="text-2xl/10! md:text-3xl/12! multi-text-color">
          {Array.isArray(heading) ? (heading as string[]).map((s, i) => <span key={i}>{s} </span>) : <span>{String(heading)}</span>}
        </h5>
        <p>{t('home.gayathri.transliteration', loc)}</p>
        <p>{t('home.gayathri.translation', loc)}</p>
      </div>
    </section>
  )
}