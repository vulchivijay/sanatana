import Link from "next/link";
import WorldMapAnimated from "../worldmap/wordmap";
import { t, DEFAULT_LOCALE } from '../../../lib/i18n';

export default function CTASection({ locale }: { locale?: string }) {
  const loc = locale || DEFAULT_LOCALE;
  return (
    <section className="gradient-background map-wrapper md:min-h-screen relative z-0 overflow-hidden">
      <WorldMapAnimated
        stroke="#ffffff"
        fill="#000000"
        fillOpacity={0.25}
        borderWidth={0.7}
        loopSpeed={6}       // slower, calmer
        stagger={16}
        fillPulse={true}
        pauseOnHover={true}
        scale={0.19}
        showGraticule={false}
      />
      <div className="content-wrapper cta-content md:absolute md:top-1/2 md:left-20 md:-translate-y-1/2 md:z-1">
        <p className="text-2xl/8! md:text-3xl/12!">{t('cta.title', loc)}</p>
        <p>{t('cta.subtitle', loc)}</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/contribute" className="button inline-block rounded-md! shadow-sm bg-amber-300 hover:bg-amber-400 no-underline">{t('cta.contribute', loc)}</Link>
          <Link href="/getstarted" className="button inline-block rounded-md! shadow-sm bg-white/75 hover:bg-white no-underline">{t('cta.guidelines', loc)}</Link>
        </div>
      </div>
    </section>
  )
}