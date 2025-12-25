import { t, DEFAULT_LOCALE } from "../../../lib/i18n";

export default function AboutShiva({ locale }: { locale?: string }) {
  return (
    <section className="bg-white about-shiva">
      <div className="content-wrapper text-left">
        <div className="max-w-5xl text-2xl/10! md:text-4xl/12! font-semibold! multi-text-color">
          {Array.isArray(t('home.shivaHeading', locale || DEFAULT_LOCALE)) ? (
            (t('home.shivaHeading', locale || DEFAULT_LOCALE) as string[]).map((s, i) => <span key={i}>{s} </span>)
          ) : <span>{t('home.shivaHeading', locale || DEFAULT_LOCALE)} </span>}
        </div>
        <div></div>
      </div>
      <div className="content-wrapper">
        <div className="flex flex-col md:flex-row items-start justify-between history">
          <div className="w-full md:w-1/3 md:text-center">
            <b className="text-3xl md:text-5xl">{t('home.stat1', locale || DEFAULT_LOCALE)}</b>
            <p>
              {t('home.stat1Desc', locale || DEFAULT_LOCALE)} <br />
              <span>{t('home.stat1Extra', locale || DEFAULT_LOCALE) || ''}</span>
            </p>
          </div>
          <div className="w-full md:w-1/3 md:text-center">
            <b className="text-3xl md:text-5xl">{t('home.stat2', locale || DEFAULT_LOCALE)}</b>
            <p>
              {t('home.stat2Desc', locale || DEFAULT_LOCALE)} <br />
              <span>{t('home.stat2Extra', locale || DEFAULT_LOCALE) || ''}</span>
            </p>
          </div>
          <div className="w-full md:w-1/3 md:text-center">
            <b className="text-3xl md:text-5xl">{t('home.stat3', locale || DEFAULT_LOCALE)}</b>
            <p>
              {t('home.stat3Desc', locale || DEFAULT_LOCALE)}<br />
              <span>{t('home.stat3Extra', locale || DEFAULT_LOCALE) || ''}</span>
            </p>
          </div>
        </div>
        <div className="content-wrapper text-left">
          <div className="text-xl md:text-3xl multi-text-color">
            {Array.isArray(t('home.lingamText', locale || DEFAULT_LOCALE)) ? (
              (t('home.lingamText', locale || DEFAULT_LOCALE) as string[]).map((s, i) => <span key={i}>{s} </span>)
            ) : <span>{t('home.lingamText', locale || DEFAULT_LOCALE)} </span>}
          </div>
        </div>
      </div>
    </section>
  );
}