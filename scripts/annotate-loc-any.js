const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(dir, files = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(d.name)) files.push(full);
  });
  return files;
}

const files = walk(path.join(root, 'app'));
let changed = 0;
files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // common patterns: const loc = getLocaleObject(locale) || {};
  src = src.replace(/const\s+loc\s*=\s*getLocaleObject\(([^)]*)\)\s*\|\|\s*\{\s*\};/g, 'const loc: any = getLocaleObject($1) || {};');
  src = src.replace(/const\s+loc\s*=\s*getLocaleObject\(([^)]*)\)\s*\|\|\s*\{\s*\}/g, 'const loc: any = getLocaleObject($1) || {};');

  // variations: const loc = getLocaleObject(DEFAULT_LOCALE) || {};
  src = src.replace(/const\s+loc\s*=\s*getLocaleObject\([^)]*\)\s*\|\|\s*\{\s*\};/g, match => {
    return match.replace(/const\s+loc\s*=\s*/, 'const loc: any = ');
  });

  if (src !== before) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Patched', file.replace(root + path.sep, ''));
    changed++;
  }
});

console.log('Done. Files changed:', changed);
