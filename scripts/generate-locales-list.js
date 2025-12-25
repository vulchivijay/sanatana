#!/usr/bin/env node
/**
 * Generate a JSON file listing available locales with display names.
 * Writes: lib/localesList.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const OUT = path.join(ROOT, 'lib', 'localesList.json');

const KNOWN = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  or: { name: 'Odia', nativeName: 'ଓଡିଆ' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  sa: { name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  fr: { name: 'French', nativeName: 'Français' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  de: { name: 'German', nativeName: 'Deutsch' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  zh: { name: 'Chinese', nativeName: '中文' },
  es: { name: 'Spanish', nativeName: 'Español' }
};

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

const folders = fs.readdirSync(LOCALES_DIR).filter(d => fs.statSync(path.join(LOCALES_DIR, d)).isDirectory());

const list = folders.map(code => ({ code, ...(KNOWN[code] || { name: code, nativeName: code }) }));

ensureDir(path.dirname(OUT));
fs.writeFileSync(OUT, JSON.stringify(list, null, 2) + '\n', 'utf8');
console.log('Wrote', OUT, 'with', list.length, 'locales');
