#!/usr/bin/env node
/*
  create-pages-from-nav.js
  Purpose: Read `locales/en/nav.json` and create placeholder pages under
  `app/` for any nav slugs that do not already have a `page.tsx`.
  Behavior:
    - Skips the `home` key (root page is `app/page.tsx`).
    - For a top-level key `k` with string value, creates `app/k/page.tsx`.
    - For a key with object and a `nav` child (e.g., `scriptures.nav`),
      creates `app/<parent>/<slug>/page.tsx` for each slug under `nav`.
    - Uses the English label from `nav.json` as the page title in the
      placeholder content.

  Usage:
    node scripts/create-pages-from-nav.js    # creates missing pages
    (no --apply flag; runs and writes by default — review before committing)
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NAV_FILE = path.join(ROOT, 'locales', 'en', 'nav.json');
const APP_DIR = path.join(ROOT, 'app');

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { console.error('Failed to read', p, e.message); process.exit(1); }
}

const navData = readJSON(NAV_FILE).nav || {};

const created = [];

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function pagePathFor(parts) {
  // parts array => path under app
  return path.join(APP_DIR, ...parts);
}

function writePlaceholder(parts, title) {
  // parts are path segments under app (e.g., ['scriptures','ramayana'])
  const dir = pagePathFor(parts);
  ensureDir(dir);
  const file = path.join(dir, 'page.tsx');
  if (fs.existsSync(file)) return false;
  const content = `export default function Page(){\n  return (\n    <main className=\"prose mx-auto p-8\">\n      <h1>${title}</h1>\n      <p>Placeholder page generated from locales/en/nav.json for path /${parts.join('/')}</p>\n    </main>\n  );\n}\n`;
  fs.writeFileSync(file, content, 'utf8');
  created.push(path.relative(process.cwd(), file));
  return true;
}

function walkNav(obj, prefixParts = []) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (key === 'home') continue; // skip root
    if (typeof val === 'string') {
      const parts = [...prefixParts, key];
      writePlaceholder(parts, val);
    } else if (val && typeof val === 'object') {
      // if object has `nav`, recurse into it, keeping parent folder
      if (val.nav && typeof val.nav === 'object') {
        walkNav(val.nav, [...prefixParts, key]);
      } else if (val.title && val.nav && typeof val.nav === 'object') {
        walkNav(val.nav, [...prefixParts, key]);
      } else {
        // object without nav: create a section page
        const parts = [...prefixParts, key];
        const title = val.title || key;
        writePlaceholder(parts, title);
        // also recurse any nested objects
        for (const k2 of Object.keys(val)) {
          if (k2 === 'title') continue;
          const v2 = val[k2];
          if (typeof v2 === 'object') walkNav({ [k2]: v2 }, parts);
        }
      }
    }
  }
}

walkNav(navData, []);

console.log('Created pages:', created.length);
created.slice(0, 50).forEach(c => console.log('  ', c));

if (created.length === 0) console.log('No pages needed.');

// After creating pages, optionally regenerate locale indexes — skip here.

process.exit(0);
