#!/usr/bin/env node
/**
 * split-json.js
 * Purpose: Split a JSON file whose top-level value is an object into
 * multiple files named after each top-level key (e.g. `key.json`).
 * Behavior:
 *  - If `--file=<path>` is provided (or a path is given as the first arg),
 *    the script uses that file. Otherwise it prompts interactively.
 *  - By default the script runs as a dry-run and only prints what it would do.
 *  - Use `--apply` to actually write files. Use `--force` to overwrite.
 *  - `--out=<dir>` overrides the output directory. Default: sibling folder
 *    named after the input file (without .json), e.g. `locales/en` for `locales/en.json`.
 * Usage examples:
 *  node scripts/split-json.js --file=locales/en.json
 *  node scripts/split-json.js locales/en.json --apply --out=locales/en
 *  syntax:: node scripts/split-json.js --file=locales/en/more.json --apply --force
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function parseArgs(argv) {
  const out = { file: null, out: null, apply: false, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') out.apply = true;
    else if (a === '--force') out.force = true;
    else if (a.startsWith('--file=')) out.file = a.split('=')[1];
    else if (a.startsWith('--out=')) out.out = a.split('=')[1];
    else if (!a.startsWith('--') && !out.file) out.file = a;
  }
  return out;
}

function safeFilename(s) {
  return String(s).replace(/[^a-zA-Z0-9_\-\.]/g, '_').replace(/^_+/, '').slice(0, 200) || 'key';
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

async function promptInput(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

async function main() {
  const args = parseArgs(process.argv);
  let file = args.file;

  if (!file) {
    // If available, offer files inside `locales/en/` for convenience
    const enDir = path.join(process.cwd(), 'locales', 'en');
    if (fs.existsSync(enDir) && fs.statSync(enDir).isDirectory()) {
      const choices = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
      if (choices.length > 0) {
        console.log('Files in locales/en:');
        choices.forEach((f, i) => console.log(`  ${i + 1}) ${f}`));
        const ans = await promptInput('Choose a file by number or name (or press Enter to provide a path): ');
        if (!ans) {
          const pathAns = await promptInput('Path to JSON file to split: ');
          if (!pathAns) { console.error('No file provided. Exiting.'); process.exit(1); }
          file = pathAns;
        } else {
          const num = parseInt(ans, 10);
          if (!isNaN(num) && num >= 1 && num <= choices.length) {
            file = path.join('locales', 'en', choices[num - 1]);
          } else if (choices.includes(ans)) {
            file = path.join('locales', 'en', ans);
          } else {
            // assume user supplied a path or filename
            file = ans;
          }
        }
      } else {
        const pathAns = await promptInput('No JSON files found in locales/en. Path to JSON file to split: ');
        if (!pathAns) { console.error('No file provided. Exiting.'); process.exit(1); }
        file = pathAns;
      }
    } else {
      const ans = await promptInput('Path to JSON file to split (e.g. locales/en.json): ');
      if (!ans) { console.error('No file provided. Exiting.'); process.exit(1); }
      file = ans;
    }
  }

  const filePath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(filePath)) { console.error('File not found:', filePath); process.exit(1); }

  let json;
  try { json = readJson(filePath); } catch (e) { console.error('Failed to parse JSON:', e && e.message); process.exit(1); }

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    console.error('Top-level JSON value must be an object (key -> value mapping).');
    process.exit(1);
  }

  // Output directory: write files into the same folder as the input file
  const outDir = args.out ? path.resolve(process.cwd(), args.out) : path.dirname(filePath);

  const keys = Object.keys(json);
  if (keys.length === 0) { console.log('No top-level keys to split.'); return; }

  const summary = [];
    for (const key of keys) {
    const fname = safeFilename(key) + '.json';
    const dest = path.join(outDir, fname);
    const content = JSON.stringify({ [key]: json[key] }, null, 2) + '\n';
    const exists = fs.existsSync(dest);
    if (!args.apply) {
      summary.push({ key, dest, size: Buffer.byteLength(content, 'utf8'), exists });
    } else {
      // Per request: write files directly into the same folder. Overwrite existing files.
      fs.writeFileSync(dest, content, 'utf8');
      console.log(`WROTE: ${path.relative(process.cwd(), dest)} (${Buffer.byteLength(content, 'utf8')} bytes)`);
      summary.push({ key, dest, written: true });
    }
  }

  if (!args.apply) {
    console.log('Dry-run: files that would be written:');
    for (const s of summary) {
      console.log(`${s.exists ? 'EXISTS' : 'NEW  '}: ${path.relative(process.cwd(), s.dest)}  (${s.size} bytes)`);
    }
    console.log('\nRun with --apply to write files, and --force to overwrite existing files.');
  } else {
    console.log('\nDry-run complete.');
  }

  // After splitting, prompt to optionally delete the original source file
  const shouldDeleteAns = await promptInput(`Delete original file ${path.relative(process.cwd(), filePath)}? (y/N): `);
  const shouldDelete = String(shouldDeleteAns || '').toLowerCase().startsWith('y');
  if (shouldDelete) {
    if (!args.apply) {
      console.log(`DRY-RUN: would delete ${filePath}`);
    } else {
      try { fs.unlinkSync(filePath); console.log(`Deleted ${filePath}`); } catch (e) { console.error('Failed to delete original file:', e && e.message); }
    }
  }

  // Regenerate an index.ts file in the same folder to import all JSONs and deep-merge
  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.json')).sort();
  const imports = files.map((f, i) => `import _${i} from './${f}';`).join('\n');
  const arr = files.map((f, i) => `  _${i}`).join(',   ');
  const idxContent = `// Auto-generated index for locale folder\n// Imports all JSON files in this folder and deep-merges them into one export.\n${imports}\n\nfunction deepMerge(target: any, source: any) {\n  if (source === undefined) return target;\n  if (Array.isArray(target) && Array.isArray(source)) {\n    const out = target.slice();\n    for (let i = 0; i < source.length; i++) out[i] = deepMerge(out[i], source[i]);\n    return out;\n  }\n  if (target && typeof target === 'object' && source && typeof source === 'object') {\n    const out = { ...target };\n    for (const k of Object.keys(source)) out[k] = deepMerge(target[k], source[k]);\n    return out;\n  }\n  return source;\n}\n\nconst base = {};\nconst merged = [ ${arr} ].reduce((acc, cur) => deepMerge(acc, cur || {}), base);\n\nexport default merged;\n`;

  const idxPath = path.join(outDir, 'index.ts');
  if (!args.apply) {
    console.log(`\nDRY-RUN: would write/overwrite index file at ${path.relative(process.cwd(), idxPath)}`);
  } else {
    try {
      fs.writeFileSync(idxPath, idxContent, 'utf8');
      console.log(`WROTE index file: ${path.relative(process.cwd(), idxPath)}`);
    } catch (e) {
      console.error('Failed to write index.ts:', e && e.message);
    }
  }

  if (args.apply) console.log('\nDone.');
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
