#!/usr/bin/env node
/**
 * notify-indexnow.js
 *
 * Notifies IndexNow about all URLs in the sitemap to boost search engine visibility.
 *
 * Usage: node scripts/notify-indexnow.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

const REPO_ROOT = path.resolve(__dirname, '..');
const INDEXNOW_KEY = '2a479e7904db4130ab8154d6cc06d37d';

// console.log('Starting IndexNow notification...');

const sitemapPath = path.join(REPO_ROOT, 'public', 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('Sitemap not found. Run build first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf8');
const $ = cheerio.load(xml, { xmlMode: true });
const urls = [];

// console.log('Loaded sitemap XML.');

$('loc').each((i, el) => {
  urls.push($(el).text());
});

// console.log(`Found ${urls.length} URLs in sitemap.`);
// console.log('First 5 URLs:', urls.slice(0, 5));

if (urls.length === 0) {
  console.log('No URLs to notify.');
  process.exit(0);
}

// Send to IndexNow
const data = JSON.stringify({
  host: 'sanatanadharmam.in',
  key: INDEXNOW_KEY,
  urlList: urls
});

// console.log('Sending to IndexNow...');

fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: data
})
  .then(response => {
    // console.log(`IndexNow response: ${response.status}`);
    if (response.status === 200 || response.status === 202) {
      // console.log('Successfully notified IndexNow.');
    } else {
      console.error('Failed to notify IndexNow.');
      return response.text().then(text => console.error('Response:', text));
    }
  })
  .catch(error => {
    console.error('Error notifying IndexNow:', error);
  });