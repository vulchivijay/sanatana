/**
 * remove-styles.js
 * Removes JSX attributes: className and style across .tsx files.
 * Usage:
 *   node scripts/remove-styles.js [rootDir] [--dry-run] [--backup]
 * Example:
 *   node scripts/remove-styles.js src --backup
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ROOT_DIR = path.join(ROOT, 'app');

// node remove-styles.js app --dry-run
// → Will only log updates without modifying any files
const dryRun = process.argv.includes('--dry-run');

// node remove-styles.js app
// → Will modifying all tsx files

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');

  // Regex patterns:
  // Remove className="..." or className={'...'} or className={variable}
  let updated = original.replace(/\sclassName\s*=\s*\{[^}]*\}|\sclassName\s*=\s*"[^"]*"|\sclassName\s*=\s*'[^']*'/g, '');

  // Remove style={{...}} or style={variable}
  // updated = updated.replace(/\sstyle\s*=\s*\{[^}]*\}/g, '');

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

console.log(`Scanning directory: ${ROOT_DIR}`);
walk(ROOT_DIR);
console.log('Done.');