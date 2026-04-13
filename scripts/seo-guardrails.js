#!/usr/bin/env node
/*
  Strict SEO guardrails for static export.
  - Verifies canonical and og:url consistency across exported pages
  - Protects robots/sitemap/IndexNow invariants
  - Optionally enforces GTM ID presence in exported HTML

  Usage:
    node scripts/seo-guardrails.js --out out
    node scripts/seo-guardrails.js --out out --require-gtm --gtm-id GTM-XXXXXXX
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const cheerio = require('cheerio');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const OUT_DIR = argv.out || 'out';
const SITE_URL = (argv.site || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');
const HOST = new URL(SITE_URL).host;
const requireGtm = Boolean(argv['require-gtm']);
const gtmId = argv['gtm-id'] || process.env.NEXT_PUBLIC_GTM_ID || '';

const REPO_ROOT = path.resolve(__dirname, '..');
const ROBOTS_PATH = path.join(REPO_ROOT, 'public', 'robots.txt');
const SITEMAP_PATH = path.join(REPO_ROOT, 'public', 'sitemap.xml');
const CONSTANTS_PATH = path.join(REPO_ROOT, 'lib', 'constants.ts');
const INDEXNOW_SCRIPT = path.join(REPO_ROOT, 'scripts', 'notify-indexnow.js');
const LAYOUT_PATH = path.join(REPO_ROOT, 'app', 'layout.tsx');

function normalizeUrl(u) {
  try {
    const parsed = new URL(String(u));
    parsed.hash = '';
    if (!parsed.pathname.endsWith('/')) {
      const fileLike = /\.[a-zA-Z0-9]+$/.test(parsed.pathname);
      if (!fileLike) parsed.pathname = `${parsed.pathname}/`;
    }
    return parsed.toString();
  } catch (_) {
    return '';
  }
}

function isIndexablePage(relPath) {
  const clean = relPath.replace(/\\/g, '/').toLowerCase();
  if (clean === '404.html' || clean === '404/index.html' || clean === '_not-found/index.html') return false;
  if (/^google[a-z0-9]+\.html$/.test(clean)) return false;
  return true;
}

async function collectHtmlFiles(dir) {
  const results = [];
  async function walk(curr) {
    const entries = await fsp.readdir(curr, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const full = path.join(curr, entry.name);
      if (entry.isDirectory()) return walk(full);
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) results.push(full);
    }));
  }
  await walk(dir);
  return results;
}

async function verifyCoreArtifacts(errors) {
  let constantsRaw = '';
  let indexNowKey = '';

  if (!fs.existsSync(ROBOTS_PATH)) {
    errors.push('Missing public/robots.txt');
  } else {
    const robots = await fsp.readFile(ROBOTS_PATH, 'utf8');
    if (!/User-agent:\s*\*/i.test(robots)) errors.push('robots.txt missing User-agent: *');
    if (!/Allow:\s*\//i.test(robots)) errors.push('robots.txt missing Allow: /');
    if (!/Sitemap:\s*https:\/\/sanatanadharmam\.in\/sitemap\.xml/i.test(robots)) {
      errors.push('robots.txt missing canonical sitemap URL');
    }
  }

  if (!fs.existsSync(SITEMAP_PATH)) {
    errors.push('Missing public/sitemap.xml');
  } else {
    const sitemap = await fsp.readFile(SITEMAP_PATH, 'utf8');
    const matches = sitemap.match(/<loc>/g);
    if (!matches || matches.length === 0) errors.push('sitemap.xml has no <loc> URLs');
  }

  if (!fs.existsSync(CONSTANTS_PATH)) {
    errors.push('Missing lib/constants.ts');
  } else {
    constantsRaw = await fsp.readFile(CONSTANTS_PATH, 'utf8');
    const m = constantsRaw.match(/INDEXNOW_KEY\s*=\s*['\"]([^'\"]+)['\"]/);
    if (!m) {
      errors.push('INDEXNOW_KEY not found in lib/constants.ts');
    } else {
      indexNowKey = m[1];
      const verifyFile = path.join(REPO_ROOT, 'public', `${indexNowKey}.txt`);
      if (!fs.existsSync(verifyFile)) {
        errors.push(`IndexNow verification file missing: public/${indexNowKey}.txt`);
      }
    }
  }

  if (!fs.existsSync(INDEXNOW_SCRIPT)) {
    errors.push('Missing scripts/notify-indexnow.js');
  } else {
    const scriptRaw = await fsp.readFile(INDEXNOW_SCRIPT, 'utf8');
    if (!/bing\.com\/indexnow/.test(scriptRaw)) {
      errors.push('notify-indexnow.js does not call bing.com/indexnow');
    }
    if (indexNowKey && !new RegExp(indexNowKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(scriptRaw)) {
      errors.push('notify-indexnow.js INDEXNOW key is inconsistent with lib/constants.ts');
    }
  }

  if (!fs.existsSync(LAYOUT_PATH)) {
    errors.push('Missing app/layout.tsx');
  } else {
    const layoutRaw = await fsp.readFile(LAYOUT_PATH, 'utf8');
    if (!/NEXT_PUBLIC_GTM_ID/.test(layoutRaw)) {
      errors.push('layout.tsx does not reference NEXT_PUBLIC_GTM_ID');
    }
    if (!/googletagmanager\.com\/gtm\.js/.test(layoutRaw)) {
      errors.push('layout.tsx missing GTM script loader (googletagmanager.com/gtm.js)');
    }
    if (!/googletagmanager\.com\/ns\.html/.test(layoutRaw)) {
      errors.push('layout.tsx missing GTM noscript iframe (googletagmanager.com/ns.html)');
    }
  }
}

async function verifyExportedSeo(errors, warnings) {
  if (!fs.existsSync(OUT_DIR)) {
    errors.push(`Out directory not found: ${OUT_DIR}`);
    return;
  }

  const files = await collectHtmlFiles(OUT_DIR);
  let checked = 0;

  for (const filePath of files) {
    const rel = path.relative(OUT_DIR, filePath).replace(/\\/g, '/');
    if (!isIndexablePage(rel)) continue;

    const html = await fsp.readFile(filePath, 'utf8');
    const $ = cheerio.load(html);

    const canonical = ($('link[rel="canonical"]').attr('href') || '').trim();
    const ogUrl = ($('meta[property="og:url"]').attr('content') || '').trim();
    const robots = ($('meta[name="robots"]').attr('content') || '').trim();

    checked += 1;

    if (!canonical) {
      errors.push(`${rel}: missing canonical`);
      continue;
    }

    if (/yourdomain\.com/i.test(canonical)) {
      errors.push(`${rel}: canonical uses placeholder yourdomain.com`);
    }

    const canonNorm = normalizeUrl(canonical);
    if (!canonNorm) {
      errors.push(`${rel}: canonical is not a valid absolute URL (${canonical})`);
    } else if (new URL(canonNorm).host !== HOST) {
      errors.push(`${rel}: canonical host mismatch (${canonical})`);
    }

    if (!ogUrl) {
      errors.push(`${rel}: missing og:url`);
    } else {
      const ogNorm = normalizeUrl(ogUrl);
      if (!ogNorm) {
        errors.push(`${rel}: og:url is not a valid absolute URL (${ogUrl})`);
      } else if (new URL(ogNorm).host !== HOST) {
        errors.push(`${rel}: og:url host mismatch (${ogUrl})`);
      }

      if (canonNorm && ogNorm && canonNorm !== ogNorm) {
        errors.push(`${rel}: canonical and og:url mismatch (${canonical} vs ${ogUrl})`);
      }
    }

    if (/noindex/i.test(robots)) {
      errors.push(`${rel}: noindex found on indexable page`);
    }

    if (requireGtm && gtmId) {
      const hasGtmScript = html.includes(`googletagmanager.com/gtm.js?id=${gtmId}`)
        || html.includes(`googletagmanager.com/ns.html?id=${gtmId}`);
      if (!hasGtmScript) {
        errors.push(`${rel}: GTM ID ${gtmId} not found in exported HTML`);
      }
    } else if (requireGtm && !gtmId) {
      warnings.push('GTM validation requested but GTM ID not provided via --gtm-id or NEXT_PUBLIC_GTM_ID');
    }
  }

  if (checked === 0) {
    errors.push('No indexable HTML pages were checked in out/');
  }
}

async function main() {
  const errors = [];
  const warnings = [];

  await verifyCoreArtifacts(errors);
  await verifyExportedSeo(errors, warnings);

  if (warnings.length > 0) {
    console.log('SEO guardrails warnings:');
    for (const w of warnings) console.log(`- ${w}`);
  }

  if (errors.length > 0) {
    console.error('SEO guardrails failed with issues:');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log('SEO guardrails passed: canonical/og consistency, indexing files, sitemap/robots, and IndexNow checks are valid.');
}

main().catch((err) => {
  console.error('SEO guardrails execution failed:', err);
  process.exit(1);
});
