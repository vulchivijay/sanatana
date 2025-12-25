#!/usr/bin/env node
/**
 * scripts/generate-thumbs.js
 * Purpose: Generate standardized thumbnails from images in `public/og`.
 * Outputs:
 *  - `public/thumbs/` (320x180, PNG)
 *  - `public/thumbs/small/` (120x120, PNG)
 * Usage:
 *  - Install sharp: `npm install sharp`
 *  - Run: `node scripts/generate-thumbs.js`
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Missing dependency: `sharp` is required to generate thumbnails.');
  console.error('Install it with: npm install sharp');
  process.exit(1);
}

// We'll ask the user for a folder under `public/` to process.
// Thumbnails will be created in the same folder with suffixes:
//   - `<name>.thumb.png` (320x180)
//   - `<name>.small.png` (120x120)
const SIZES = { large: [320, 180], small: [120, 120] };
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const readline = require('readline');

function askFolder(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(prompt, (ans) => { rl.close(); resolve(ans); }));
}

(async () => {
  const folder = String((await askFolder('Enter folder name under public (e.g. og or images): ')) || '').trim();
  if (!folder) {
    console.error('No folder provided. Exiting.');
    process.exit(1);
  }

  const SRC_DIR = path.join(process.cwd(), 'public', folder);
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Source directory not found:', SRC_DIR);
    process.exit(1);
  }
  // Create output directories inside the provided folder
  const OUT_DIR = path.join(SRC_DIR, 'thumbs');
  const OUT_SMALL = path.join(OUT_DIR, 'small');
  ensureDir(OUT_DIR);
  ensureDir(OUT_SMALL);

  const files = fs.readdirSync(SRC_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    // skip files inside the thumbs folders and skip already-generated thumbs
    if (f.endsWith('.thumb.png') || f.endsWith('.small.png')) return false;
    return ALLOWED.has(ext);
  });
  if (files.length === 0) {
    console.log('No source images found in', SRC_DIR);
    process.exit(0);
  }

  const results = [];
  for (const f of files) {
    const src = path.join(SRC_DIR, f);
    const name = path.parse(f).name;
    const outLarge = path.join(OUT_DIR, `${name}.png`);
    const outSmall = path.join(OUT_SMALL, `${name}.png`);
    try {
      await sharp(src)
        .resize(SIZES.large[0], SIZES.large[1], { fit: 'cover', position: 'centre' })
        .png({ compressionLevel: 9 })
        .toFile(outLarge);

      await sharp(src)
        .resize(SIZES.small[0], SIZES.small[1], { fit: 'cover', position: 'centre' })
        .png({ compressionLevel: 9 })
        .toFile(outSmall);

      results.push({ file: f, large: outLarge, small: outSmall });
      console.log('Wrote thumbs for', f);
    } catch (err) {
      console.error('Failed to process', f, err && err.message);
    }
  }

  console.log(`Processed ${results.length} files.`);
})();
