import { t, DEFAULT_LOCALE } from '../../../lib/i18n';

export default function OurFourCoreYugas({ locale }: { locale?: string }) {
  const loc = locale || DEFAULT_LOCALE;
  return (
    <section className="background-alternative">
      <div className="content-wrapper ourfour-coreyugas">
        <div className="flex flex-col md:flex-row items-start justify-start">
          <div className="w-full md:w-1/2">
            <p className="text-2xl/10! md:text-4xl/12!">{t('home.ourFourCoreYugas.title', loc)}</p>
          </div>
          <div className="w-full md:w-1/2">
            <div>
              <p className="text-xl/6! md:text-2xl/8!">{t('home.ourFourCoreYugas.satyaTitle', loc)}</p>
              <p><strong>{t('home.ourFourCoreYugas.satyaDuration', loc)}</strong> 4,800 divine years (each divine year = 360 human years) So in human years: <b>4,800 × 360 = 1,728,000 years</b>.</p>
              <p>{t('home.ourFourCoreYugas.satyaDesc', loc)}</p>
            </div>
            <div>
              <p className="text-xl/6! md:text-2xl/8!">{t('home.ourFourCoreYugas.tretaTitle', loc)}</p>
              <p><b>{t('home.ourFourCoreYugas.tretaDuration', loc)}</b> 3,600 divine years (each divine year = 360 human years) So in human years: <b>3,600 × 360 = 1,296,000 years</b>.</p>
              <p>{t('home.ourFourCoreYugas.tretaDesc', loc)}</p>
            </div>
            <div>
              <p className="text-xl/6! md:text-2xl/8!">{t('home.ourFourCoreYugas.dvaparaTitle', loc)}</p>
              <p><b>{t('home.ourFourCoreYugas.dvaparaDuration', loc)}</b> 2,400 divine years (each divine year = 360 human years) So in human years: <b>2,400 × 360 = 864,000  years</b>.</p>
              <p>{t('home.ourFourCoreYugas.dvaparaDesc', loc)}</p>
            </div>
            <div>
              <p className="text-xl/6! md:text-2xl/8!">{t('home.ourFourCoreYugas.kaliTitle', loc)}</p>
              <p><b>{t('home.ourFourCoreYugas.kaliDuration', loc)}</b> 1,200 divine years (each divine year = 360 human years) So in human years: <b>1,200 × 360 = 432,000 years</b>.</p>
              <p>{t('home.ourFourCoreYugas.kaliDesc', loc)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}