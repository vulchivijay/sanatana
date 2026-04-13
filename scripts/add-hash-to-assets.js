// scripts/add-hash-to-assets.js
// Adds a content hash to CSS and JS files for cache busting and updates references in HTML/JSX files.
// Only run this script in the Render build process, not locally.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const glob = require('glob');

const ASSET_DIRS = [
  'public',
  '.next/static',
];
const TARGET_EXTENSIONS = ['.css', '.js'];
const REFERENCE_FILES = [
  'app/layout.tsx',
  // Add more files if needed
];

function hashFile(filepath) {
  const content = fs.readFileSync(filepath);
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function renameWithHash(filepath, hash) {
  const ext = path.extname(filepath);
  const base = filepath.slice(0, -ext.length);
  const newName = `${base}.${hash}${ext}`;
  fs.renameSync(filepath, newName);
  return newName;
}

function updateReferences(oldName, newName) {
  REFERENCE_FILES.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    const oldBase = path.basename(oldName);
    const newBase = path.basename(newName);
    const regex = new RegExp(oldBase.replace(/\./g, '\\.'), 'g');
    content = content.replace(regex, newBase);
    fs.writeFileSync(file, content, 'utf8');
  });
}

function main() {
  // Only run if RENDER environment variable is set (i.e., on Render.com)
  if (!process.env.RENDER) {
    // console.log('Skipping asset hash: not running in Render build environment.');
    return;
  }
  ASSET_DIRS.forEach(dir => {
    TARGET_EXTENSIONS.forEach(ext => {
      const files = glob.sync(`${dir}/**/*${ext}`);
      files.forEach(file => {
        if (file.includes('.')) {
          const hash = hashFile(file);
          const newName = renameWithHash(file, hash);
          updateReferences(file, newName);
          // console.log(`Renamed ${file} -> ${newName}`);
        }
      });
    });
  });
}

if (require.main === module) main();
