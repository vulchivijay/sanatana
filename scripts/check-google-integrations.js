#!/usr/bin/env node

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const cheerio = require('cheerio');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const outDir = path.resolve(argv.out || 'out');

async function collectFiles(dir) {
  const files = [];

  async function walk(current) {
    const entries = await fsp.readdir(current, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && /\.(html|js)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }));
  }

  await walk(dir);
  return files;
}

async function main() {
  if (!fs.existsSync(outDir)) {
    throw new Error(`Build output directory not found: ${outDir}`);
  }

  const files = await collectFiles(outDir);
  const htmlFiles = files.filter((file) => file.toLowerCase().endsWith('.html'));
  const fileContents = await Promise.all(files.map((file) => fsp.readFile(file, 'utf8')));
  const htmlContents = fileContents.filter((_, index) => files[index].toLowerCase().endsWith('.html'));

  const hasSearchConsoleMeta = htmlContents.some((html) => {
    const $ = cheerio.load(html);
    return Boolean(($('meta[name="google-site-verification"]').attr('content') || '').trim());
  });
  const hasSearchConsoleFile = htmlContents.some((html) => /google-site-verification:\s*google[a-z0-9]+\.html/i.test(html));
  const hasSearchConsole = hasSearchConsoleMeta || hasSearchConsoleFile;

  function isIntegrationIncluded(id) {
    return Boolean(id) && fileContents.some((content) => content.includes(id));
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID || '';
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
  const hasGa = isIntegrationIncluded(gaId);
  const hasGtm = isIntegrationIncluded(gtmId);

  console.log('Google integration build status:');
  console.log(`- Google Search Console: ${hasSearchConsole ? 'APPLIED' : 'NOT APPLIED'} (verification ${hasSearchConsoleMeta ? 'meta tag' : ''}${hasSearchConsoleMeta && hasSearchConsoleFile ? ' and ' : ''}${hasSearchConsoleFile ? 'HTML file' : ''}${hasSearchConsoleMeta || hasSearchConsoleFile ? ' found in export' : ' not found in export'})`);
  console.log(`- Google Analytics: ${hasGa ? 'APPLIED' : 'NOT APPLIED'}${gaId ? ' (configured ID found in export)' : ' (NEXT_PUBLIC_GA_ID is not configured)'}`);
  console.log(`- Google Tag Manager: ${hasGtm ? 'APPLIED' : 'NOT APPLIED'}${gtmId ? ' (configured ID found in export)' : ' (NEXT_PUBLIC_GTM_ID is not configured)'}`);

  if (hasGa || hasGtm) {
    console.log('  Analytics tags load only after the visitor grants consent.');
  }

  if (htmlFiles.length === 0) {
    throw new Error(`No exported HTML files found in: ${outDir}`);
  }
}

main().catch((error) => {
  console.error('Google integration check failed:', error);
  process.exitCode = 1;
});
