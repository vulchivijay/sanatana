#!/usr/bin/env node
/**
 * Create missing locale folders (international locales) by copying all
 * JSON files from `locales/en/` as placeholders. This will NOT modify any
 * existing locale folders or files.
 * Usage: node scripts/create-international-locales.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const EN_DIR = path.join(LOCALES_DIR, 'en');

const desired = [
  // European & widely-used
  'de','es','fr','it','nl','pt','ru','pl','sv','no','da','fi','cs','hu','ro','bg','el','hr','sr','sk','sl','is',
  // East & Southeast Asia
  'zh','ja','ko','vi','th','ms','id','tl','km','lo','my',
  // South Asia (Indian subcontinent)
  'hi','bn','pa','gu','mr','ta','te','kn','ml','or','as','sd','si',
  // Middle East & Central Asia
  'ar','fa','ur','he','ps','ku',
  // Africa
  'sw','am','yo','ig','ha','zu','xh',
  // Americas & others
  'en','es-MX','pt-BR'
];

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ return null; } }

if (!fs.existsSync(EN_DIR)) { console.error('locales/en not found'); process.exit(1); }
const enFiles = fs.readdirSync(EN_DIR).filter(f => f.endsWith('.json'));

for (const code of desired) {
  const dir = path.join(LOCALES_DIR, code);
  if (fs.existsSync(dir)) { console.log('Exists, skipping:', code); continue; }
  fs.mkdirSync(dir, { recursive: true });
  for (const f of enFiles) {
    const src = path.join(EN_DIR, f);
    const dest = path.join(dir, f);
    const obj = readJson(src) || {};
    fs.writeFileSync(dest, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  }
  // write index.ts
  const imports = enFiles.map((f,i) => `import _${i} from './${f}';`).join('\n');
  const arr = enFiles.map((f,i) => `  _${i}`).join(',   ');
  const idx = `// Auto-generated index for locale '${code}'\n${imports}\n\nexport default [ ${arr} ].reduce((a,c) => Object.assign(a, c || {}), {});\n`;
  fs.writeFileSync(path.join(dir,'index.ts'), idx, 'utf8');
  console.log('Created locale folder:', code);
}

console.log('Done.');
