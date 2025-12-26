/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { Suspense } from "react";
import type { Metadata } from "next";
import Script from 'next/script';
import { Playfair_Display, Poppins } from "next/font/google";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/scroll-to-top/scroll-to-top";
import { LocaleProvider } from "./context/locale-context";
import { ThemeProvider } from './context/theme-context';
import AnalyticsCollector from './components/analytics/AnalyticsCollector';
import CookieConsent from './components/cookie-consent/CookieConsent';
import Loader from './components/loader/loader';
import TopProgress from './components/progress/TopProgress';
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../lib/i18n';
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

// Compose a safe font-family string so Playfair is available as a fallback
const bodyFontFamily = `${poppins.style?.fontFamily || "Poppins, sans-serif"}, ${playfair.style?.fontFamily || "'Playfair Display', serif"}`;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sanatanadharmam.in";

export const metadata: Metadata = {
  title: {
    default: "Sanatana Dharma",
    template: "%s | Eternal Principles of Hinduism"
  },
  description:
    "Explore Sanatana Dharma: the eternal principles of Hinduism, Vedic traditions, spiritual practices, and wisdom from scriptures like the Bhagavad Gita and Upanishads.",
  keywords: [
    "Sanatana Dharma",
    "Hinduism",
    "Vedas",
    "Puranas",
    "Shastras",
    "Bhagavad Gita",
    "Upanishads",
    "Sanskrit",
    "Dharma",
    "Vedanta",
    "Hindu scriptures",
    "Indian philosophy",
    "Vedic studies",
    "Moksha",
    "Yoga",
    "Bhakti",
    "Hindu rituals",
    "Ancient scriptures",
    "Vedic literature",
    "Hindu culture",
    "India",
    "Spirituality",
    "Meditation",
    "Ayurveda",
    "Sanatanadharma",
    "Hindu traditions",
    "Vedantic teachings",
    "Hindu epics",
    "Religious studies",
    "Philosophy",
    "Spiritual teachings",
    "Cultural heritage",
    "Role of Vedas in Sanatana Dharma",
    "Hindu festivals",
    "Upanishads wisdom",
    "Indian spirituality",
    "Dharma and Karma",
    "Yoga and meditation",
    "Principles of Sanatana Dharma",
    "Vedic traditions"
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Sanatana Dharma",
    description: "Explore the Vedas, Puranas, Shastras and the living traditions of Sanatana Dharma — texts, translations and resources.",
    url: SITE_URL,
    siteName: "Sanatana Dharma",
    images: [
      {
        url: `${SITE_URL}/globe.svg`,
        width: 1200,
        height: 630,
        alt: "Sanatana Dharma"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanatana Dharma",
    description:
      "Explore the Vedas, Puranas, Shastras and the living traditions of Sanatana Dharma — texts, translations and resources.",
    images: [`${SITE_URL}/globe.svg`]
  },
  alternates: {
    // Do not force a global canonical to SITE_URL — allow per-page canonical URLs.
    languages: {
      en: SITE_URL,
      te: `${SITE_URL}/?lang=te`
    }
  },
  // robots handled per-page to avoid duplicate tags when pages also set robots
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolve a server-side locale from cookie or Accept-Language header
  async function resolveServerLocale(): Promise<string> {
    const supported = SUPPORTED_LOCALES;
    try {
      // headers() may throw in some environments; guard usage
      const hdrs = await headers();
      if (!hdrs || typeof hdrs.get !== 'function') {
        return DEFAULT_LOCALE;
      }

      // cookie named `sanatana_dharma_language` was used in client-side code
      const cookie = hdrs.get('cookie') || '';
      const match = typeof cookie === 'string' ? cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
      if (match && supported.includes(match[1])) return match[1];

      // Accept-Language header may be missing or not a string
      const al = hdrs.get('accept-language');
      if (al && typeof al === 'string') {
        const first = al.split(',')[0].split(';')[0].trim();
        const primary = first.split('-')[0];
        if (supported.includes(primary)) return primary;
      }
    } catch (err) {
      // headers() can throw; fall back to DEFAULT_LOCALE
    }

    return DEFAULT_LOCALE;
  }

  const lang = await resolveServerLocale();

  return (
    <html lang={lang} translate="no">
      <head>
        {/* Prevent browser automatic translation UI (Chrome/Google Translate) */}
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="index" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        {/* Page-specific override: cache for 5 minutes */}
        <meta httpEquiv="Cache-Control" content="max-age=300, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="300" />
        {/* Page metadata is handled by Next's Metadata API (per-page `generateMetadata`). */}
        {/* Preload initial hero slider images to improve LCP on homepage */}
        <link rel="preload" as="image" href="/images/lord-shiva.png" />
        <link rel="preload" as="image" href="/images/lord-krishna.png" />
        {/* Per-page canonical is set via per-page `generateMetadata` using meta.json;
          remove static canonical here to avoid duplicate canonical tags. */}
        <link rel="stylesheet" href="/globals.from-scss.css" />
        {/* JSON-LD structured data for Website/Organization */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sanatana Dharma",
              url: SITE_URL,
              description:
                "Sanatana Dharma — Explore the Vedas, Puranas, Shastras, and timeless teachings of Indian philosophy, spirituality, and culture.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sanatana Dharma",
              url: SITE_URL,
              logo: `${SITE_URL}/images/svg/globe.svg`,
              sameAs: []
            })
          }}
        />
        {/* Google Analytics (env-driven) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="lazyOnload" />
            <Script id="gtag-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
        {/* Disable right-click context menu in production to reduce casual copy */}
        {process.env.NODE_ENV === "production" && (
          <Script
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(() => {
                try {
                  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
                } catch (err) {
                  // ignore
                }
              })();`
            }}
          />
        )}
        {/* Google Tag Manager (optional, env-driven) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`
            }}
          />
        )}
      </head>
      <body style={{ fontFamily: bodyFontFamily }} translate="no">
        <TopProgress />
        {/* Google Tag Manager (noscript) inserted when `NEXT_PUBLIC_GTM_ID` is set */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Suspense fallback={<Loader />}>
          <LocaleProvider>
            <ThemeProvider>
              <Suspense fallback={<Loader />}>
                <Header />
              </Suspense>
              <Suspense fallback={<Loader />}>
                {children}
              </Suspense>
              <AnalyticsCollector />
              <Suspense fallback={<Loader />}>
                <Footer />
              </Suspense>
              <ScrollToTop />
              <CookieConsent />
            </ThemeProvider>
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
