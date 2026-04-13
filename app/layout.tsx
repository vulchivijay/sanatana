/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { Poppins } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
import { Suspense } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@lib/i18n';
import { LANGUAGE_STORAGE_KEY } from '@lib/constants';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, renderJsonLdScript } from '@lib/jsonld';
import { secrets } from '@lib/secrets';
import CookieConsent from '@components/cookie-consent/CookieConsent';
import Header from '@components/header';
import Footer from '@components/footer';
import TopProgress from '@components/topprogress';
import ScrollToTop from '@components/scroll-to-top';
import { LocaleProvider } from './context/locale-context';
import { ThemeProvider } from './context/theme-context';
import "./globals.css"; // tailwind base styles

export const metadata = {
  title: 'Sanātana Dharma – Eternal Principles of Hinduism',
  description: 'Explore Sanātana Dharma: eternal principles of Hinduism, Vedic traditions, and spiritual practices.',
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
  display: "swap" // Prevents layout shift from font loading
});
// Compose a safe font-family string: Playfair primary, Poppins fallback
const bodyFontFamily = `${poppins.style?.fontFamily || "Poppins, sans-serif"}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const orgJson = buildOrganizationJsonLd({
    logo: `${(secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '')}/assets/logo.png`,
    description: 'Explore Sanātana Dharma: eternal principles of Hinduism, Vedic traditions, and spiritual practices.'
  });
  const siteJson = buildWebSiteJsonLd();

  // Resolve locale with minimal blocking - use synchronous detection when possible
  let lang = DEFAULT_LOCALE;
  try {
    const hdrs = await headers();
    const cookie = hdrs.get('cookie') || '';
    const match = cookie.match(new RegExp(`${LANGUAGE_STORAGE_KEY}=([^;]+)`));
    if (match && SUPPORTED_LOCALES.includes(match[1])) {
      lang = match[1];
    } else {
      const al = hdrs.get('accept-language');
      if (al) {
        const primary = al.split(',')[0].split(';')[0].trim().split('-')[0];
        if (SUPPORTED_LOCALES.includes(primary)) lang = primary;
      }
    }
  } catch (err) {
    // Use default locale on error
  }

  return (
    <html lang={lang} translate="no">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        {/* Prevent browser automatic translation UI (Chrome/Google Translate) */}
        <meta name="google" content="notranslate" />
        {/* Favicons: use site logo for broad compatibility */}
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="64x64" />
        <link rel="shortcut icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        {/* Preload LCP image with high priority - matches hero img tag */}
        <link
          rel="preload"
          as="image"
          href="/images/home/mobile-hero.png"
          imageSrcSet="/images/home/hero.png 1024w, /images/home/mobile-hero.png 768w"
          imageSizes="(min-width: 1024px) 50vw, 100vw"
          fetchPriority="high"
        />
        {/* Page-specific override: cache for 2 days */}
        <meta httpEquiv="Cache-Control" content="max-age=172800, must-revalidate" />
        <meta httpEquiv="Pragma" content="cache" />
        <meta httpEquiv="Expires" content="172800" />
        {/* Defer non-critical global styles (preload → convert to stylesheet onload) */}
        <Script
          id="load-deferred-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var l=document.createElement('link');
                l.rel='preload';
                l.as='style';
                l.href='/globals.from-scss.51c44e30.51c44e30.51c44e30.css';
                l.onload=function(){this.onload=null;this.rel='stylesheet'};
                document.head.appendChild(l);
              })();
            `
          }}
        />
        {/* Patch performance.measure early to avoid browser TypeError for negative timestamps in dev tooling */}
        <Script
          id="patch-performance-measure"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  if (typeof performance !== 'undefined' && performance && typeof performance.measure === 'function') {
                    var orig = performance.measure.bind(performance);
                    performance.measure = function(nameOrOptions, opts) {
                      try {
                        return orig.apply(performance, arguments);
                      } catch (err) {
                        // Some browsers throw when start/end timestamps are negative.
                        // Silently ignore that specific error to avoid breaking dev overlay.
                        try {
                          var msg = err && err.message ? String(err.message).toLowerCase() : '';
                          if (msg.indexOf('negative') !== -1 || msg.indexOf('cannot have a negative') !== -1) return;
                        } catch (e) {}
                        throw err;
                      }
                    };
                  }
                } catch (e) { /* ignore */ }
              })();
            `
          }}
        />
        <noscript><link rel="stylesheet" href="/globals.from-scss.51c44e30.51c44e30.51c44e30.css" /></noscript>
        {/* JSON-LD structured data for Website/Organization */}
        <meta name="google-site-verification" content="kxWcUTvXW7Ag5H1jtSxNuYUoKcWm-sq0on2s-h5ILF8" />
        {/* Canonical global JSON-LD: single WebSite + Organization definitions */}
        <script id="jsonld-site" type="application/ld+json" dangerouslySetInnerHTML={renderJsonLdScript(siteJson)} />
        <script id="jsonld-org" type="application/ld+json" dangerouslySetInnerHTML={renderJsonLdScript(orgJson)} />
        {/* Hint the font for later use (non-blocking) */}
        <link
          rel="prefetch"
          href="/_next/static/media/a218039a3287bcfd-s.p.4a23d71b.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent FOIT/FOUT and layout shift from font loading */
            @font-face {
              font-family: '__Poppins_Fallback';
              src: local('Arial'), local('Helvetica'), local('sans-serif');
              font-display: swap;
              ascent-override: 105%;
              descent-override: 35%;
              line-gap-override: 10%;
              size-adjust: 95%;
            }
          `
        }} />
        {/* Disable right-click context menu in production to reduce casual copy */}
        {/* {process.env.NODE_ENV === "production" && (
          <Script
            id="disable-contextmenu"
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
        )} */}
        {/* Google Analytics (GA4) */}
        {secrets.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${secrets.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${secrets.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* Google Tag Manager script */}
        {secrets.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${secrets.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}
      </head>
      <body className={poppins.className} translate="no">
        <TopProgress />
        {/* Google Tag Manager (noscript) inserted when `NEXT_PUBLIC_GTM_ID` is set */}
        {secrets.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${secrets.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              className="hidden"
              aria-hidden="true"
            />
          </noscript>
        )}
        <Suspense fallback={null}>
          <LocaleProvider>
            <ThemeProvider>
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              <main className="min-h-[60vh] bg-white">
                <Suspense fallback={null}>{children}</Suspense>
              </main>
              <Suspense fallback={null}>
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
