/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { DEFAULT_LOCALE, loadLocale, getLocaleObject } from "../../../lib/i18n";
import { useEffect, useState } from "react";
import { useLocale } from '../../context/locale-context';

export default function Footer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { locale } = useLocale();
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale);
        if (!mounted) return;
        const locObj = getLocaleObject(locale) || {};
        const keys = [
          "footer.title", "footer.quote", "footer.contact", "footer.donate", "footer.disclaimer",
          "footer.contentChange", "footer.privacy", "footer.terms", "footer.copyright",
          "footer.nav.scriptures.nav", "footer.nav.stotrasmantras.nav", "footer.nav.philosophy.nav",
          "footer.nav.practices.nav", "footer.nav.stories.nav", "footer.nav.kidsZone.nav",
          "footer.nav.others.nav", "footer.nav.scriptures.title", "footer.nav.stotrasmantras.title",
          "footer.nav.philosophy.title", "footer.nav.practices.title", "footer.nav.stories.title",
          "footer.nav.kidsZone.title", "footer.nav.others.title"
        ];
        const obj: Record<string, any> = {};
        // Attempt to read direct properties from the loaded locale object
        for (const k of keys) {
          const parts = k.split('.');
          let cur: any = locObj;
          for (const p of parts) {
            cur = cur?.[p];
            if (cur === undefined) break;
          }
          obj[k] = cur ?? k;
        }
        setTranslations(obj);
      } catch (e) {
        // keep null to allow fallback
      }
    })();
    return () => { mounted = false; };
  }, [locale]);

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };
  const isActive = (href: string) => normalize(pathname) === normalize(href);

  if (!translations) return null;

  return (
    <footer className="w-full">
      <div className="content-wrapper relative z-29">
        <section className="text-center">
          <p className="text-3xl! md:text-3xl! font-semibold">{translations["footer.title"]}</p>
          <p>{translations["footer.quote"]}</p>
          <p>{translations["footer.quoteSource"]}</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className="button inline-black rounded-md shadow-sm bg-amber-300 hover:bg-amber-400 no-underline">
              {translations["footer.contact"]}
            </Link>
            <Link href="/donate" className="button inline-black rounded-md shadow-sm bg-white/80 hover:bg-white no-underline">
              {translations["footer.donate"]}
            </Link>
          </div>
        </section>
        <div className="nav-wrapper w-full relative z-10 flex flex-col md:flex-row md:items-start md:justify-between border-t">
          <nav role="menu" className="md:w-full gap-4 flex flex-col  md:flex-row md:items-start">
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.scriptures.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.scriptures.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/scriptures/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? " active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.stotrasmantras.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.stotrasmantras.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/stotrasmantras/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? " active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.scriptures.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.philosophy.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/philosophy/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? " active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.practices.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.practices.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/practices/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? "active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.stories.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.stories.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/stories/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? " active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.kidsZone.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.kidsZone.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/kidsZone/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? " active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            <div className="md:w-1/7 flex flex-col gap-2">
              <p className="text-sm! underline">{translations["footer.nav.others.title"]}</p>
              {(() => {
                const entries = Object.entries(translations["footer.nav.others.nav"]);
                return entries.map(([key, val]: [string, any]) => {
                  if (typeof val === "string") {
                    const href = key === "home" ? "/" : `/${key}`;
                    const className = key === "donate"
                      ? `no-underline ${isActive(href) ? " " : ""}`
                      : `${isActive(href) ? " active" : ""}`;
                    return (
                      <Link key={key} href={href} className={className ? className : ''} role="menuitem">
                        {val}
                      </Link>
                    );
                  }
                });
              })()}
            </div>
            {/* <Link href="/" className={`${isActive("/") ? "active" : ""}`}>{translations["footer.home"]}</Link>
                <Link href="/about" className={`${isActive("/about") ? "active" : ""}`}>{translations["footer.about"]}</Link>
                <Link href="/resources" className={`${isActive("/resources") ? "active" : ""}`}>{translations["footer.resources"]}</Link> */}
          </nav>
        </div>
        <div className="disclaimer w-full flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-xs/4! text-gray-300">{translations["footer.disclaimer"]}<br /> {translations["footer.contentChange"]}</p>
            <p className="text-xs/4! text-gray-300">I am using <Link href='https://gemini.google.com/' title='Gemini AI' target='_blank' className='text-white no-underline'>Gemini AI</Link>, <Link href='https://www.meta.ai/' title='Meta AI' target='_blank' className='text-white no-underline'>Meta AI</Link> and  <Link href='https://github.com/features/copilot' title='Github Copilot' target='_blank' className='text-white no-underline'>Github Copilot</Link> basic plan to generating content of the website.</p>
          </div>
          <nav role="menu" className="social-icons md:w-1/4 flex items-center justify-end gap-6">
            <Link href="https://in.linkedin.com/in/vulchivijayakumar" target="_blank" className="text-sm! no-underline">
              <img src="/images/svg/linkedin.svg" alt="linkedin" width={24} height={24} className="inline-block" />
            </Link>
            <Link href="https://codepen.io/vulchivijay" target="_blank" className="text-sm! no-underline">
              <img src="/images/svg/codepen.svg" alt="codepen" width={24} height={24} className="inline-block" />
            </Link>
            <Link href="https://github.com/vulchivijay" target="_blank" className="text-sm! no-underline">
              <img src="/images/svg/github.svg" alt="github" width={24} height={24} className="inline-block" />
            </Link>
            <Link href="#" target="_blank" className="text-sm!no-underline">
              <img src="/images/svg/twitter.svg" alt="twitter" width={24} height={24} className="inline-block" />
            </Link>
          </nav>
        </div>
        <div className="copyrights w-full md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className={`${isActive("/privacy-policy") ? "active" : ""} `}>{translations["footer.privacy"]}</Link>
            <Link href="/terms-of-service" className={`${isActive("/terms-of-service") ? "active" : ""} `}>{translations["footer.terms"]}</Link>
          </div>
          <div className="text-xs! color-gray-300">{translations["footer.copyright"]}</div>
        </div>
      </div>
    </footer>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
