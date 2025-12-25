/**
 * generate-analytics-json.js
 * Purpose: Generate a lightweight analytics JSON file (`public/api-analytics.json`)
 * listing discovered page files and a timestamp. This is primarily useful for
 * build-time diagnostics and site analytics tooling.
 * Usage: node scripts/generate-analytics-json.js
 */

const fs = require('fs');
const path = require('path');

function walk(dir){
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for(const d of list){
    const p = path.join(dir, d.name);
    if(d.isDirectory()) results.push(...walk(p));
    else results.push(p);
  }
  return results;
}

const appDir = path.join(__dirname, '..', 'app');
let pages = [];
try{
  if(fs.existsSync(appDir)){
    const files = walk(appDir).filter(f=>f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.jsx'));
    pages = files.map(f=>path.relative(path.join(__dirname,'..'), f).replace(/\\/g,'/'));
  }
}catch(e){
  // ignore
}

const out = {
  generatedAt: new Date().toISOString(),
  pageFiles: pages,
  pageCount: pages.length
};

const outDir = path.join(__dirname, '..', 'public');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'api-analytics.json'), JSON.stringify(out, null, 2));
console.log('Wrote', path.join(outDir, 'api-analytics.json'));
