/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';

// Ensure this app route is treated as static for `next export`.
export const dynamic = "force-static";

import { SUPPORTED_LOCALES } from '../../lib/i18n';
import { PATHS } from '../../lib/sitemapPaths';

const LOCALES = SUPPORTED_LOCALES;

export async function GET() {
  const hostname = SITE_URL.replace(/\/$/, '');
  const lastmod = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const p of PATHS) {
    xml += '  <url>\n';
    const loc = `${hostname}${p === '/' ? '' : p}`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;

    for (const l of LOCALES) {
      const href = l === 'en' ? `${hostname}${p === '/' ? '' : p}` : `${hostname}${p === '/' ? '' : p}?lang=${l}`;
      xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>\n`;
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' }
  });
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
