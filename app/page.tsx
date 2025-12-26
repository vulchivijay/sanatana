/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../lib/i18n";
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
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

export const generateMetadata = createGenerateMetadata('home');

export default async function Home() {
  const locale = detectLocale() || resolveLocaleFromHeaders();

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
