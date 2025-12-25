#!/usr/bin/env node
/**
 * generate-sitemap.js
 * Purpose: Build a sitemap.xml for the site using `lib/sitemapPaths.ts`.
 * Usage: node scripts/generate-sitemap.js  (expects to be run from repo root)
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';
const LOCALES = [
  'en','hi','ta','te','kn','ml','mr','bn','gu','pa','or','as','ur','sa','ru','fr','nl','de','ja','zh','es'
];

function readPaths() {
  const p = path.join(process.cwd(), 'lib', 'sitemapPaths.ts');
  const src = fs.readFileSync(p, 'utf8');
  const m = src.match(/export const PATHS\s*=\s*\[(([\s\S]*?)\];)/m);
  if (!m) throw new Error('PATHS not found in lib/sitemapPaths.ts');
  const arrSrc = m[0].replace(/export const PATHS\s*=\s*/m, '');
  // naive eval: replace single quotes and trailing commas
  const js = arrSrc.replace(/\/\//g, '/*');
  // Extract strings
  const items = [];
  const re = /'([^']+)'/g;
  let it;
  while ((it = re.exec(arrSrc)) !== null) items.push(it[1]);
  return items;
}

function buildSitemap(paths) {
  const hostname = SITE_URL.replace(/\/$/, '');
  const lastmod = new Date().toISOString();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const p of paths) {
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
  xml += '</urlset>\n';
  return xml;
}

function writeSitemap(xml) {
  const out = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, xml, 'utf8');
  console.log('Wrote', out);
}

try {
  const paths = readPaths();
  const xml = buildSitemap(paths);
  writeSitemap(xml);
} catch (err) {
  console.error(err);
  process.exit(1);
}
