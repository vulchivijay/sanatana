#!/usr/bin/env node
/*
  sync-locales.js
  Purpose: Strictly synchronize all locale folders with `locales/en/`.
  Behavior:
    - For each JSON file in `locales/en/`, ensure the same file exists in
      every other locale folder. If missing, create the file by copying the
      English JSON (English strings act as a safe fallback).
      - For files present in both en and a locale: prune any keys/values that do not
        exist in the English version (they will be removed). For keys that exist
        in English, preserve any non-empty translated values; otherwise copy the
        English string as a fallback.
    - Delete any JSON files in a locale folder that are not present in
      `locales/en/`.
    - Regenerate `index.ts` in a locale folder only when that locale's files
      were actually created/modified/deleted during this run.

  Usage:
    node scripts/sync-locales.js          # dry-run (no writes)
    node scripts/sync-locales.js --apply  # perform changes
    node scripts/sync-locales.js --apply --backup  # create backups before writing
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const EN_DIR = path.join(LOCALES_DIR, 'en');

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; }
}
function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function isEmptyValue(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

function emptyify(template) {
  if (template === null || template === undefined) return '';
  if (Array.isArray(template)) {
    const first = template.find(x => x !== undefined && x !== null);
    if (first && typeof first === 'object') return template.map(t => (t && typeof t === 'object') ? emptyify(t) : '');
    return [];
  }
  if (typeof template === 'object') {
    const out = {};
    for (const k of Object.keys(template)) out[k] = emptyify(template[k]);
    return out;
  }
  return '';
}

function syncToTemplate(existing, template) {
  // Returns an object/array/value shaped exactly like `template`.
  // For each key in `template`:
  //  - If `existing` has a non-empty translation, preserve it.
  //  - Otherwise copy the English value from `template` (English acts as fallback).
  // Any keys or array items present in `existing` but NOT present in
  // `template` are dropped (deleted) so the locale strictly matches `en`.
  if (Array.isArray(template)) {
    const out = [];
    for (let i = 0; i < template.length; i++) {
      const t = template[i];
      const e = Array.isArray(existing) ? existing[i] : undefined;
      if (t && typeof t === 'object') {
        out[i] = syncToTemplate(e || (Array.isArray(t) ? [] : {}), t);
      } else {
        out[i] = (e !== undefined && !isEmptyValue(e)) ? e : t;
      }
    }
    return out;
  }

  if (template && typeof template === 'object') {
    const out = {};
    for (const k of Object.keys(template)) {
      const tVal = template[k];
      const eVal = existing && Object.prototype.hasOwnProperty.call(existing, k) ? existing[k] : undefined;
      if (tVal && typeof tVal === 'object') {
        out[k] = syncToTemplate(eVal || (Array.isArray(tVal) ? [] : {}), tVal);
      } else {
        out[k] = (eVal !== undefined && !isEmptyValue(eVal)) ? eVal : tVal;
      }
    }
    return out;
  }

  return (existing !== undefined && !isEmptyValue(existing)) ? existing : template;
}

function regenIndexFor(localeDir, localeName) {
  const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json')).sort();
  const imports = files.map((f, i) => `import _${i} from './${f}';`).join('\n');
  const arr = files.map((f, i) => `  _${i}`).join(',   ');
  const idx = `// Auto-generated index for locale '${localeName}'\n// Imports all JSON files in this folder and deep-merges them into one export.\n${imports}\n\nfunction deepMerge(target: any, source: any) {\n  if (source === undefined) return target;\n  if (Array.isArray(target) && Array.isArray(source)) {\n    const out = target.slice();\n    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);\n    return out;\n  }\n  if (target && typeof target === 'object' && source && typeof source === 'object') {\n    const out = { ...target };\n    for (const k of Object.keys(source)) out[k] = deepMerge(target[k], source[k]);\n    return out;\n  }\n  return source;\n}\n\nconst base = {};\nconst merged = [ ${arr} ].reduce((acc, cur) => deepMerge(acc, cur || {}), base);\n\nexport default merged;\n`;
  fs.writeFileSync(path.join(localeDir, 'index.ts'), idx, 'utf8');
}

function backupFile(file) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = `${file}.backup.${ts}`;
  fs.copyFileSync(file, dest);
  return dest;
}

function run({ apply = false, createBackup = false } = {}) {
  if (!fs.existsSync(EN_DIR) || !fs.statSync(EN_DIR).isDirectory()) {
    console.error('locales/en folder not found:', EN_DIR);
    process.exit(1);
  }

  const enFiles = fs.readdirSync(EN_DIR).filter(f => f.endsWith('.json')).sort();
  const locales = fs.readdirSync(LOCALES_DIR).filter(d => {
    const p = path.join(LOCALES_DIR, d);
    return fs.statSync(p).isDirectory() && d !== 'en';
  });

  console.log('Files in locales/en:', enFiles.length);
  console.log('Target locales:', locales.join(', '));

  for (const loc of locales) {
    const localeDir = path.join(LOCALES_DIR, loc);
    console.log('\nProcessing locale:', loc);
    // Track whether this locale had any filesystem changes
    let localeChanged = false;

    // Ensure each en file exists in locale and matches keys
    for (const f of enFiles) {
      const src = path.join(EN_DIR, f);
      const dest = path.join(localeDir, f);
      const enObj = readJson(src);
      if (!enObj || typeof enObj !== 'object') { console.warn(`Skipping ${f}: en file parse failed`); continue; }

      const exists = fs.existsSync(dest);
      if (!exists) {
        // create file by copying English content (use English strings as fallback)
        const placeholder = enObj;
        const size = Buffer.byteLength(JSON.stringify(placeholder, null, 2) + '\n', 'utf8');
        if (!apply) console.log(`MISSING (would create): ${path.join('locales', loc, f)}  (${size} bytes)`);
        else { writeJson(dest, placeholder); console.log(`CREATED ${path.join('locales', loc, f)}`); localeChanged = true; }
        continue;
      }

      const existing = readJson(dest) || {};
      const synced = syncToTemplate(existing, enObj);
      const changed = JSON.stringify(synced) !== JSON.stringify(existing);
      if (changed) {
        const size = Buffer.byteLength(JSON.stringify(synced, null, 2) + '\n', 'utf8');
        if (!apply) console.log(`MODIFIED (would write): ${path.join('locales', loc, f)}  (${size} bytes)`);
        else {
          let backup;
          if (createBackup) backup = backupFile(dest);
          writeJson(dest, synced);
          console.log(`WROTE ${path.join('locales', loc, f)}${backup ? ` (backup: ${path.basename(backup)})` : ''}`);
          localeChanged = true;
        }
      } else {
        console.log(`OK: ${path.join('locales', loc, f)}`);
      }
    }

    // Delete extra files in locale that are not present in en
    const localeJsonFiles = fs.readdirSync(localeDir).filter(fn => fn.endsWith('.json'));
    for (const fn of localeJsonFiles) {
      if (!enFiles.includes(fn)) {
        const full = path.join(localeDir, fn);
        if (!apply) console.log(`EXTRA (would delete): ${path.join('locales', loc, fn)}`);
        else { try { fs.unlinkSync(full); console.log(`DELETED ${path.join('locales', loc, fn)}`); localeChanged = true; } catch (e) { console.warn(`Failed to delete ${full}:`, e.message); } }
      }
    }
    // Regenerate index.ts only if files changed in this locale
    if (!apply) {
      if (localeChanged) console.log(`DRY-RUN: would regenerate index.ts in ${path.join('locales', loc)}`);
    } else {
      if (localeChanged) {
        try { regenIndexFor(localeDir, loc); console.log(`WROTE index.ts in ${path.join('locales', loc)}`); } catch (e) { console.error('index.ts write failed:', e.message); }
      }
    }
  }

  console.log('\nDone. Run with --apply to write changes.');
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const apply = argv.includes('--apply');
  const createBackup = argv.includes('--backup');
  run({ apply, createBackup });
}

