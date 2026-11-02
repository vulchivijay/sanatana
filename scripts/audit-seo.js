#!/usr/bin/env node
/*
  Post-deploy SEO audit for static `out/` directory.
  Usage:
    node scripts/audit-seo.js [--out out] [--json audit-report.json] [--csv audit-report.csv]

  Requires: npm install cheerio minimist
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const cheerio = require('cheerio');

const argv = require('minimist')(process.argv.slice(2));
const OUT_DIR = argv.out || 'out';
const JSON_OUT = argv.json || path.join('public', 'data', 'audit-report.json');
const CSV_OUT = argv.csv || path.join('public', 'data', 'audit-report.csv');

async function scanHtmlFiles(dir) {
  const results = [];
  async function walk(curr) {
    const entries = await fsp.readdir(curr, { withFileTypes: true });
    await Promise.all(entries.map(async (ent) => {
      const full = path.join(curr, ent.name);
      if (ent.isDirectory()) return walk(full);
      if (ent.isFile() && ent.name.toLowerCase().endsWith('.html')) results.push(full);
    }));
  }
  await walk(dir);
  return results;
}

function isAbsoluteUrl(u) {
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function mapHrefToFile(href, pageFile) {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  // skip anchors only
  if (href.startsWith('#')) return null;
  try {
    const url = new URL(href);
    // absolute external link
    if (url.protocol === 'http:' || url.protocol === 'https:') return { external: true };
  } catch (e) {
    // not absolute URL
  }

  // If href starts with '/', map to OUT_DIR + href
  if (href.startsWith('/')) {
    const candidate = path.join(OUT_DIR, decodeURIComponent(href.replace(/^\//, '')));
    // check both file.html and index.html inside folder
    return { candidates: [candidate, candidate + '.html', path.join(candidate, 'index.html')] };
  }

  // relative path
  const baseDir = path.dirname(pageFile);
  const candidate = path.resolve(baseDir, decodeURIComponent(href.split('#')[0]));
  return { candidates: [candidate, candidate + '.html', path.join(candidate, 'index.html')] };
}

async function existsAny(pathsArr) {
  for (const p of pathsArr) {
    try {
      if (!p) continue;
      const stat = await fsp.stat(p);
      if (stat && stat.isFile()) return true;
    } catch (e) {
      // ignore
    }
  }
  return false;
}

function scoreAndCategorize(score) {
  if (score >= 90) return 'PASS';
  if (score >= 70) return 'WARN';
  return 'FAIL';
}

async function auditPage(filePath) {
  const issues = [];
  let score = 100;
  let html = '';
  try {
    html = await fsp.readFile(filePath, 'utf8');
  } catch (e) {
    issues.push(`Failed to read file: ${e.message}`);
    return { page: toWebPath(filePath), status: 'FAIL', issues, score: 0 };
  }

  let $;
  try {
    $ = cheerio.load(html, { decodeEntities: false });
  } catch (e) {
    issues.push('Malformed HTML (parsing failed)');
    score -= 50;
    $ = cheerio.load('<html></html>');
  }

  // A. Basic SEO tags
  const title = ($('title').first().text() || '').trim();
  if (!title) { issues.push('Missing or empty <title>'); score -= 25; }

  const metaDesc = $('meta[name="description"]').attr('content');
  if (!metaDesc) { issues.push('Missing <meta name="description">'); score -= 20; }

  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) { issues.push('Missing <link rel="canonical">'); score -= 10; }
  else if (!isAbsoluteUrl(canonical)) { issues.push('<link rel="canonical"> is not an absolute URL'); score -= 5; }

  // B. Robots & indexing
  const robots = $('meta[name="robots"]').attr('content');
  if (robots && /noindex/i.test(robots)) { issues.push('Contains <meta name="robots" content="noindex">'); score -= 50; }
  else if (robots && !/index/i.test(robots) && !/follow/i.test(robots)) { issues.push('Robots tag present but missing "index, follow"'); score -= 10; }

  // C. Open Graph
  const ogs = ['og:title', 'og:description', 'og:url', 'og:type'];
  ogs.forEach((p) => {
    const v = $(`meta[property="${p}"]`).attr('content');
    if (!v) { issues.push(`Missing meta property="${p}"`); score -= 5; }
  });

  // D. Twitter meta
  const tw = ['twitter:card', 'twitter:title', 'twitter:description'];
  tw.forEach((n) => {
    const v = $(`meta[name="${n}"]`).attr('content');
    if (!v) { issues.push(`Missing meta name="${n}"`); score -= 3; }
  });

  // E. Structured data
  const ldjsonCount = $('script[type="application/ld+json"]').length;
  if (ldjsonCount === 0) { issues.push('No JSON-LD structured data found'); score -= 2; }

  // F. Content validation
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  if (!bodyText || bodyText.length < 20) { issues.push('Page has little or no visible text content'); score -= 50; }

  // server-rendered detection: if HTML length is small suggest not server-rendered
  if (html.length < 300) { issues.push('HTML appears very small; check server-rendering'); score -= 20; }

  // G. Links
  const anchors = $('a[href]').toArray();
  const internalBroken = [];
  for (const a of anchors) {
    const href = (a.attribs && a.attribs.href) ? a.attribs.href.trim() : '';
    if (!href) continue;
    const mapped = mapHrefToFile(href, filePath);
    if (!mapped) continue; // mailto/tel/anchor
    if (mapped.external) continue; // external link -> skip existence check
    const ok = await existsAny(mapped.candidates);
    if (!ok) internalBroken.push(href);
  }
  if (internalBroken.length) {
    issues.push(`Broken internal links: ${internalBroken.slice(0, 5).join(', ')}${internalBroken.length > 5 ? ` (+${internalBroken.length - 5} more)` : ''}`);
    score -= Math.min(20, internalBroken.length * 5);
  }

  if (score < 0) score = 0;
  const status = scoreAndCategorize(score);

  return { page: toWebPath(filePath), status, issues, score };
}

function toWebPath(filePath) {
  // Convert out/about/index.html -> /about/ or /index.html -> /
  const rel = path.relative(OUT_DIR, filePath).replace(/\\/g, '/');
  if (rel.endsWith('index.html')) {
    const p = '/' + rel.replace(/index.html$/, '');
    return p.replace(/\/\/$/, '/') || '/';
  }
  return '/' + rel.replace(/\.html$/, '');
}

async function main() {
  try {
    await fsp.access(OUT_DIR);
  } catch (e) {
    console.error(`Out directory not found: ${OUT_DIR}`);
    process.exit(2);
  }

  // console.log('Scanning HTML files in', OUT_DIR);
  const files = await scanHtmlFiles(OUT_DIR);
  // console.log(`Found ${files.length} HTML pages`);

  const results = [];

  // Limit concurrency
  const CONCURRENCY = 8;
  let idx = 0;
  async function worker() {
    while (idx < files.length) {
      const i = idx++;
      const file = files[i];
      const res = await auditPage(file);
      results.push(res);
      // console.log(`${res.page} -> ${res.status} (${res.score})${res.issues.length ? ' - ' + res.issues.slice(0, 2).join('; ') : ''}`);
    }
  }
  await Promise.all(new Array(CONCURRENCY).fill(0).map(worker));

  // Summary
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const avg = total ? Math.round(results.reduce((s, r) => s + r.score, 0) / total) : 0;

  const report = { generatedAt: new Date().toISOString(), totalPages: total, passed, failed, averageScore: avg, pages: results };

  // Ensure output directory exists (deploy static data under public/data)
  try {
    await fsp.mkdir(path.dirname(JSON_OUT), { recursive: true });
  } catch (e) {
    // ignore mkdir errors and let writeFile fail later if necessary
  }

  await fsp.writeFile(JSON_OUT, JSON.stringify(report, null, 2), 'utf8');
  // console.log('\nWrote JSON report to', JSON_OUT);

  if (CSV_OUT) {
    const header = ['page', 'status', 'score', 'issues'].join(',') + '\n';
    const rows = results.map(r => [escapeCsv(r.page), r.status, r.score, escapeCsv(r.issues.join(' | '))].join(',')).join('\n');
    await fsp.writeFile(CSV_OUT, header + rows, 'utf8');
    // console.log('Wrote CSV report to', CSV_OUT);
  }

  // console.log('\nSummary:');
  // console.log(`- Total pages scanned: ${total}`);
  // console.log(`- Passed pages: ${passed}`);
  // console.log(`- Failed pages: ${failed}`);
  // console.log(`- Average SEO score: ${avg}`);
  // console.log('\nDone.');
}

function escapeCsv(s) {
  if (s == null) return '';
  const str = String(s);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) return '"' + str.replace(/"/g, '""') + '"';
  return str;
}

main().catch(err => { console.error(err); process.exit(1); });
