/**
 * align-and-normalize-meta.js
 * Purpose: Align entries in `locales/en/meta.json` with the paths defined in
 * `lib/sitemapPaths.ts` and normalize titles, descriptions and OG images.
 * - Adds missing meta entries for discovered paths
 * - Copies sensible defaults from similar existing entries
 * - Truncates overly long titles/descriptions and ensures `ogImage` and `url`
 * Usage: node scripts/align-and-normalize-meta.js
 */
const fs = require('fs');
const path = require('path');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in';

const metaPath = path.resolve(__dirname, '..', 'locales', 'en', 'meta.json');
// load PATHS from lib/sitemapPaths.ts by simple parsing (avoid requiring TS)
const sitemapSrc = fs.readFileSync(path.resolve(__dirname, '..', 'lib', 'sitemapPaths.ts'), 'utf8');
const arrayMatch = sitemapSrc.match(/export const PATHS\s*=\s*\[([\s\S]*?)\];/m);
let sitemapPaths = [];
if (arrayMatch) {
  const items = arrayMatch[1].match(/['"`][^'"`]+['"`]/g) || [];
  sitemapPaths = items.map(s => s.slice(1, -1));
} else {
  console.warn('Failed to parse lib/sitemapPaths.ts — falling back to root paths');
  sitemapPaths = ['/'];
}

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8'); }

function toKey(p) { if (p === '/') return 'home'; return p.replace(/^\//, '').replace(/-/g, '_'); }
function lastSegment(p) { const s = p.replace(/^\//, ''); return s.split('/').pop() || s; }
function capitalizeWords(s) { return s.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }

const data = readJSON(metaPath);
const meta = data.meta || {};

const existingKeys = Object.keys(meta);
const created = [];
const updated = [];

// Allowed fields for each meta entry. Any other keys will be removed.
const ALLOWED_META_KEYS = new Set(['title', 'description', 'keywords', 'ogImage', 'url', 'canonical']);

// Build set of expected keys derived from sitemap paths
const expectedKeys = new Set(sitemapPaths.map(p => toKey(p)));

// Helper: fuzzy match a path segment to existing meta key
function findExistingForSegment(seg) {
  const segNorm = seg.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const k of existingKeys) {
    const kn = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (kn.includes(segNorm) || segNorm.includes(kn)) return k;
  }
  return null;
}

// Load English nav labels to improve titles/descriptions
let enNav = {};
try { enNav = readJSON(path.resolve(__dirname, '..', 'locales', 'en', 'nav.json'))?.nav || {}; } catch (e) { enNav = {}; }

function labelForPath(p) {
  if (p === '/') return 'Home';
  const parts = p.replace(/^\//, '').split('/');
  if (parts.length === 1) {
    const key = parts[0];
    const v = enNav[key];
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object' && v.title) return v.title;
    return capitalizeWords(key);
  }
  if (parts.length >= 2) {
    const parent = parts[0];
    const child = parts[1];
    const pObj = enNav[parent];
    if (pObj && typeof pObj === 'object') {
      const nav = pObj.nav || {};
      if (nav && nav[child]) return nav[child];
    }
    // fallback to last segment humanized
    return capitalizeWords(parts[parts.length - 1]);
  }
  return null;
}

for (const p of sitemapPaths) {
  const key = toKey(p);
  if (meta[key]) {
    // ensure url present
    if (!meta[key].url) { meta[key].url = p === '/' ? SITE_URL : SITE_URL.replace(/\/$/, '') + p; updated.push(key); }
    continue;
  }

  // try to find an existing key
  const seg = lastSegment(p);
  const found = findExistingForSegment(seg) || findExistingForSegment(seg.replace(/s$/, ''));
  if (found) {
    meta[key] = Object.assign({}, meta[found]);
    meta[key].url = p === '/' ? SITE_URL : SITE_URL.replace(/\/$/, '') + p;
    created.push({ path: p, key, from: found });
  } else {
    // create a minimal entry using nav labels when available
    const label = labelForPath(p) || capitalizeWords(seg);
    const title = `${label} — Sanatana Dharma - Explore Sanatan Dharma`;
    meta[key] = {
      title,
      description: `Learn about ${label} on SanatanaDharma.in — articles, translations and commentary.`,
      keywords: `${label.toLowerCase()}, ${seg}, ${label} meaning`,
      ogImage: '/og/home.png',
      url: p === '/' ? SITE_URL : SITE_URL.replace(/\/$/, '') + p
    };
    created.push({ path: p, key, from: null, label });
  }
}

// Normalize titles/descriptions for PATHS entries
const seenTitles = new Set();
// Track globally-used keyword tokens to avoid duplicates across pages
const globalUsedKeywords = new Set();
for (const p of sitemapPaths) {
  const key = toKey(p);
  const e = meta[key];
  if (!e) continue;
  let changed = false;
  // if title missing or generic, prefer nav label
  try {
    const label = labelForPath(p);
    if (label && (!e.title || String(e.title).toLowerCase().includes('sanatana'))) {
      const preferred = `${label} — Sanatana Dharma - Explore Sanatan Dharma`;
      if (e.title !== preferred) { e.title = preferred; changed = true; }
    }
    if (!e.description) {
      e.description = `Learn about ${labelForPath(p) || capitalizeWords(lastSegment(p))} on SanatanaDharma.in — articles, translations and commentary.`;
      changed = true;
    }
  } catch (err) {/* ignore */ }
  // Title: prefer short; keep brand suffix if present
  if (e.title) {
    const t = String(e.title).trim();
    if (t.length > 70) {
      const trunc = t.slice(0, 60).replace(/[,;\s]+$/, '') + ' | Sanatana Dharma';
      if (trunc !== t) { e.title = trunc; changed = true; }
    }
  }
  // Description: keep 120-160 chars
  if (e.description) {
    const d = String(e.description).trim();
    if (d.length > 160) { e.description = d.slice(0, 155).replace(/\s+\S+$/, '') + '...'; changed = true; }
  }
  // Ensure ogImage
  // Preserve existing ogImage/url if present. If missing on creation, provide default.
  if (!e.ogImage) { e.ogImage = '/og/home.png'; changed = true; }
  if (!e.url) { e.url = p === '/' ? SITE_URL : SITE_URL.replace(/\/$/, '') + p; changed = true; }
  // Ensure single canonical tag per page: set canonical to the url
  if (!e.canonical || e.canonical !== e.url) { e.canonical = e.url; changed = true; }
  // Ensure title length > 22 characters
  if (e.title && String(e.title).trim().length <= 22) {
    let t = String(e.title).trim();
    if (!t.includes('Sanatana')) t = t + ' — Sanatana Dharma - Explore Sanatan Dharma';
    while (t.length <= 22) t = t + ' — Sanatana Dharma - Explore Sanatan Dharma';
    if (e.title !== t) { e.title = t; changed = true; }
  }
  // Ensure description length > 60 characters
  if (!e.description || String(e.description).trim().length <= 60) {
    const base = String(e.description || '').trim();
    const suffix = ' Read articles, translations and commentary on SanatanaDharma.in.';
    let d = base.length ? base + suffix : `${labelForPath(p) || capitalizeWords(lastSegment(p))} — Learn more at SanatanaDharma.in.${suffix}`;
    if (d.length <= 60) d = d + ' More resources available.';
    if (e.description !== d) { e.description = d; changed = true; }
  }
  // Ensure unique keywords based on page (>=15 unique words, globally unique)
  const label = labelForPath(p) || capitalizeWords(lastSegment(p));
  e.keywords = generateKeywordsForPage(label, lastSegment(p), globalUsedKeywords);
  changed = true;

  // Build and set a descriptive, page-specific unique title for every page
  {
    const label = labelForPath(p) || capitalizeWords(lastSegment(p));
    const newTitle = generateUniqueTitle(p, label, seenTitles);
    if (e.title !== newTitle) { e.title = newTitle; changed = true; }
    seenTitles.add(String(newTitle).toLowerCase());
  }
  // Remove any unexpected keys from this meta entry
  for (const k of Object.keys(e)) {
    if (!ALLOWED_META_KEYS.has(k)) {
      delete e[k];
      changed = true;
    }
  }
  if (changed) updated.push(key);
}

// Remove meta entries that do not correspond to any sitemap path
for (const k of Object.keys(meta)) {
  if (!expectedKeys.has(k)) {
    delete meta[k];
    console.log('Removed meta for unexpected key:', k);
  }
}

data.meta = meta;
writeJSON(metaPath, data);

console.log(`Created ${created.length} entries, updated ${updated.length} entries.`);
if (created.length) console.log('Created:', created.slice(0, 20));
if (updated.length) console.log('Updated sample:', updated.slice(0, 20));

// --- Sync to other locales: copy English meta into each locale's meta.json (preserve ogImage/url from English)
const localesDir = path.resolve(__dirname, '..', 'locales');
const allDirs = fs.readdirSync(localesDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
for (const loc of allDirs) {
  if (loc === 'en') continue;
  const targetMetaPath = path.resolve(localesDir, loc, 'meta.json');
  let targetData = { meta: {} };
  try { targetData = readJSON(targetMetaPath); } catch (e) { targetData = { meta: {} }; }
  // backup
  try { if (fs.existsSync(targetMetaPath)) fs.copyFileSync(targetMetaPath, targetMetaPath + '.bak'); } catch (e) { }
  // copy english meta entries
  const newMeta = {};
  for (const k of Object.keys(meta)) {
    // copy fields from English; ensure ogImage and url are same as English
    const src = meta[k];
    newMeta[k] = {
      title: src.title,
      description: src.description,
      keywords: src.keywords,
      ogImage: src.ogImage,
      url: src.url,
      canonical: src.canonical || src.url
    };
  }
  targetData.meta = newMeta;
  writeJSON(targetMetaPath, targetData);
  console.log('Synced meta for locale:', loc);
}

function generateKeywordsForPage(label, seg, globalUsed) {
  // Build a set of candidate words from label, segment and a thematic pool.
  function norm(w) { return String(w || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  const local = [];
  const seenLocal = new Set();

  const addIf = (w) => {
    const n = norm(w);
    if (!n) return false;
    if (seenLocal.has(n)) return false;
    if (globalUsed.has(n)) return false;
    seenLocal.add(n);
    local.push(n);
    globalUsed.add(n);
    return true;
  };

  // seed from label and segment words (keep order)
  const parts = [];
  if (label) parts.push(label);
  if (seg) parts.push(seg);
  const words = parts.join(' ').replace(/[\W_]+/g, ' ').split(/\s+/).filter(Boolean);
  for (const w of words) addIf(w);

  // thematic pool of extras (ordered)
  const extras = ['sanatana', 'dharma', 'mantra', 'stotra', 'stotras', 'scripture', 'scriptures', 'translation', 'commentary', 'devotion', 'practice', 'ritual', 'worship', 'temple', 'hinduism', 'yoga', 'meditation', 'mythology', 'story', 'verse', 'guide', 'history', 'philosophy', 'tradition', 'culture', 'chant', 'festival', 'legend', 'meaning', 'interpretation', 'lesson'];
  for (const ex of extras) { if (local.length >= 15) break; addIf(ex); }

  // If still short, derive tokens from the path-like seg by splitting on non-alphanum
  if (local.length < 15) {
    const more = (seg || label || '').replace(/[^a-z0-9]+/ig, ' ').split(/\s+/).filter(Boolean);
    for (const m of more) { if (local.length >= 15) break; addIf(m); }
  }

  // As last resort, add unique numbered tokens based on seg
  let counter = 1;
  while (local.length < 15) {
    const token = (norm(seg) || 'page') + (counter > 1 ? '' + counter : '');
    if (!globalUsed.has(token)) {
      local.push(token);
      globalUsed.add(token);
    }
    counter++;
    if (counter > 1000) break;
  }

  return local.slice(0, 30).join(', ');
}

function dedupeWordsInTitle(title) {
  // split on spaces/punctuation, but preserve separators to rebuild
  const words = title.split(/\s+/).filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const w of words) {
    const key = w.replace(/[^a-z0-9]/ig, '').toLowerCase();
    if (!key) {
      out.push(w);
      continue;
    }
    if (!seen.has(key)) {
      seen.add(key);
      out.push(w);
    }
  }
  return out.join(' ');
}

function generateUniqueTitle(p, label, seenTitles) {
  const parts = p.replace(/^\//, '').split('/').filter(Boolean);
  let parentLabel = null;
  if (parts.length > 1) {
    const parentPath = '/' + parts.slice(0, parts.length - 1).join('/');
    parentLabel = labelForPath(parentPath) || capitalizeWords(parts[parts.length - 2] || '');
  }
  // Format: Section | Page — Sanatana Dharma - Explore Sanatan Dharma
  // If there is a parent, use parent as Section and label as Page.
  // If no parent, use label as Section and 'Overview' as Page.
  const section = parentLabel || label;
  const page = parentLabel ? label : 'Overview';
  let title = `${section} | ${page} — Sanatana Dharma - Explore Sanatan Dharma`;
  // make slightly more descriptive when too short
  if (title.length <= 22) {
    title = `${section} | ${page} — Sanatana Dharma - Explore Sanatan Dharma — Articles & Commentary`;
  }
  // remove duplicate words while preserving order
  title = dedupeWordsInTitle(title);
  if (title.length <= 22) title = title + ' — Sanatana Dharma - Explore Sanatan Dharma';
  // ensure uniqueness across pages
  let candidate = title;
  let i = 1;
  while (seenTitles.has(candidate.toLowerCase())) {
    candidate = `${title} (${i})`;
    i++;
  }
  return candidate;
}
