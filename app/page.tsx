/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t, DEFAULT_LOCALE, SUPPORTED_LOCALES, detectServerLocaleFromHeaders } from "../lib/i18n";
import { headers } from 'next/headers';
import StructuredData from "./components/structured-data/StructuredData";
import MainSlider from "./components/main-slider/slider";
import SanatanaDharma from "./components/sanatanadharma/sanatanadharma";
import KrishnaStotram from "./components/krishna-stotram/krishnastotram";
import GayathriStotram from "./components/gayathri-stotram/gayathristotram";
import ShivaStotram from "./components/shiva-stotram/shivastotram";
import KrishnaStotramBgImg from "./components/krishna-stotram-bgimg/krishnastotrambgimg";
import CTASection from "./components/cta/cta";
import OurFourCoreYugas from "./components/our-four-core-yugas/ourfourcoreyugas";
import AboutShiva from "./components/aboutshiva/aboutshiva";

export async function generateMetadata(props: any) {
  // Resolve locale from server headers (cookie or Accept-Language)
  const supported = SUPPORTED_LOCALES;
  let locale = DEFAULT_LOCALE;
  try {
    const hdrs = await headers();
    const cookie = hdrs.get('cookie') || '';
    const match = typeof cookie === 'string' ? cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
    if (match && supported.includes(match[1])) locale = match[1];
    else {
      const al = hdrs.get('accept-language');
      if (al && typeof al === 'string') {
        const first = al.split(',')[0].split(';')[0].trim();
        const primary = first.split('-')[0];
        if (supported.includes(primary)) locale = primary;
      }
    }
  } catch (err) {
    // fall back to DEFAULT_LOCALE
  }
  const meta = getMeta("home", undefined, locale);
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: meta.ogImage ? [{ url: meta.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
    alternates: {
      canonical: meta.canonical || meta.url || "https://sanatanadharmam.in",
    },
  };
}

export default async function Home() {
  // Resolve server locale using headers (cookie or Accept-Language)
  let locale = DEFAULT_LOCALE;
  try {
    const hdrs = await headers();
    locale = detectServerLocaleFromHeaders(hdrs) || detectLocale();
  } catch (e) {
    locale = detectLocale() || DEFAULT_LOCALE;
  }

  return (
    <>
      <StructuredData metaKey="home" />
      <main>
        <MainSlider />
        <SanatanaDharma />
        <KrishnaStotram />
        <ShivaStotram />
        <GayathriStotram />
        <KrishnaStotramBgImg />
        <OurFourCoreYugas />
        <CTASection />
        <AboutShiva />
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
