#!/usr/bin/env node
/**
 * scripts/generate-og-images.js
 * Purpose: Generate locale-specific Open Graph images based on locale JSON paths.
 * Output: public/og/locales/<locale>/<relative-json-path>.png
 *
 * Usage:
 *  - node scripts/generate-og-images.js
 *  - node scripts/generate-og-images.js --locale en
 *  - node scripts/generate-og-images.js --locale hi,te
 *  - node scripts/generate-og-images.js --limit 200
 *  - node scripts/generate-og-images.js --dry-run
 */

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const REPO_ROOT = path.resolve(__dirname, '..');
const LOCALES_ROOT = path.join(REPO_ROOT, 'public', 'data', 'locales');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Missing dependency: `sharp` is required to generate OG images.');
  console.error('Install it with: npm install sharp');
  process.exit(1);
}

// OG Image dimensions (recommended by Open Graph protocol)
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = path.join(REPO_ROOT, 'public', 'og', 'locales');

const argv = minimist(process.argv.slice(2), {
  string: ['locale'],
  boolean: ['dry-run', 'force'],
  default: {
    locale: '',
    'dry-run': false,
    force: true,
  },
});

const LIMIT = Number.isFinite(Number(argv.limit)) ? Math.max(0, Number(argv.limit)) : 0;
const IS_DRY_RUN = Boolean(argv['dry-run']);
const SHOULD_OVERWRITE = Boolean(argv.force);
const SITE_NAME = 'sanatanadharmam.in';

// Ensure output directory exists
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

/**
 * Generate a simple OG image with text overlay
 * @param {string} title - Main title text
 * @param {string} subtitle - Subtitle or tagline (optional)
 * @param {string} outputFileName - Output filename (e.g., 'about.png')
 * @param {object} options - Customization options
 */
async function generateOGImage(title, subtitle = '', outputFileName, options = {}) {
  const palette = createPaletteFromSeed(outputFileName || title || 'og-image');
  const {
    bgColor = palette.bgColor,
    bgColorEnd = palette.bgColorEnd,
    textColor = palette.textColor,
    accentColor = palette.accentColor,
    fontSize = 42,
    subtitleSize = 28,
  } = options;

  const layout = fitTextLayout({
    title,
    subtitle,
    maxWidth: WIDTH - 180,
    maxHeight: 410,
    titleFontStart: fontSize,
    subtitleFontStart: subtitleSize,
  });

  const titleSvg = renderTextBlock({
    lines: layout.titleLines,
    x: WIDTH / 2,
    startY: 120,
    fontSize: layout.titleFontSize,
    lineHeight: layout.titleLineHeight,
    fontWeight: 'bold',
    fill: textColor,
    opacity: 1,
  });

  const subtitleSvg = renderTextBlock({
    lines: layout.subtitleLines,
    x: WIDTH / 2,
    startY: 120 + (layout.titleLines.length * layout.titleLineHeight) + 24,
    fontSize: layout.subtitleFontSize,
    lineHeight: layout.subtitleLineHeight,
    fontWeight: 'normal',
    fill: textColor,
    opacity: 0.9,
  });

  // Create SVG with text
  const svgImage = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bgColorEnd};stop-opacity:1" />
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="${accentColor}" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)"/>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="100" r="150" fill="${accentColor}" opacity="0.1"/>
      <circle cx="${WIDTH - 100}" cy="${HEIGHT - 100}" r="120" fill="${accentColor}" opacity="0.1"/>
      
      <!-- Title + description text -->
      ${titleSvg}
      ${subtitleSvg}
      
      <!-- Bottom branding -->
      <text
        x="50%"
        y="${HEIGHT - 40}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="28"
        fill="${textColor}"
        text-anchor="middle"
        opacity="0.8"
      >
        ${SITE_NAME}
      </text>
      
      <!-- Decorative bottom line -->
      <rect x="400" y="${HEIGHT - 70}" width="400" height="3" fill="${accentColor}" opacity="0.6"/>
    </svg>
  `;

  const outputPath = path.join(OUTPUT_DIR, outputFileName.replace(/\//g, path.sep));

  if (!SHOULD_OVERWRITE && fs.existsSync(outputPath)) {
    return outputPath;
  }

  ensureDir(path.dirname(outputPath));

  if (IS_DRY_RUN) {
    return outputPath;
  }
  
  try {
    await sharp(Buffer.from(svgImage))
      .resize(WIDTH, HEIGHT)
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✓ Generated: ${outputFileName}`);
    return outputPath;
  } catch (err) {
    console.error(`✗ Failed to generate ${outputFileName}:`, err.message);
    throw err;
  }
}

function estimateCharWidth(fontSize) {
  return Math.max(7, fontSize * 0.55);
}

function breakLongToken(token, maxChars) {
  if (token.length <= maxChars) return [token];
  const chunks = [];
  let cursor = 0;
  while (cursor < token.length) {
    chunks.push(token.slice(cursor, cursor + maxChars));
    cursor += maxChars;
  }
  return chunks;
}

function wrapTextByPixels(text, fontSize, maxWidth) {
  const normalized = safeString(text).replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  const maxChars = Math.max(8, Math.floor(maxWidth / estimateCharWidth(fontSize)));
  const rawTokens = normalized.split(' ');
  const tokens = [];
  for (const token of rawTokens) {
    if (!token) continue;
    const parts = breakLongToken(token, maxChars);
    for (const part of parts) tokens.push(part);
  }

  const lines = [];
  let current = '';
  for (const token of tokens) {
    const candidate = current ? `${current} ${token}` : token;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = token;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fitTextLayout({ title, subtitle, maxWidth, maxHeight, titleFontStart, subtitleFontStart }) {
  const minTitleFont = 16;
  const minSubtitleFont = 14;

  let titleFont = titleFontStart;
  let subtitleFont = subtitle ? subtitleFontStart : 0;
  let titleLines = wrapTextByPixels(title, titleFont, maxWidth);
  let subtitleLines = subtitle ? wrapTextByPixels(subtitle, subtitleFont, maxWidth) : [];
  let titleLineHeight = Math.ceil(titleFont * 1.2);
  let subtitleLineHeight = subtitle ? Math.ceil(subtitleFont * 1.35) : 0;

  const spacing = subtitle ? 24 : 0;

  function totalHeight() {
    return (titleLines.length * titleLineHeight) + (subtitleLines.length * subtitleLineHeight) + spacing;
  }

  let guard = 0;
  while (totalHeight() > maxHeight && guard < 400) {
    guard += 1;

    const canShrinkSubtitle = subtitle && subtitleFont > minSubtitleFont;
    const canShrinkTitle = titleFont > minTitleFont;

    if (!canShrinkTitle && !canShrinkSubtitle) break;

    if (canShrinkSubtitle && (subtitleLines.length >= titleLines.length || !canShrinkTitle)) {
      subtitleFont -= 1;
      subtitleLines = wrapTextByPixels(subtitle, subtitleFont, maxWidth);
      subtitleLineHeight = Math.ceil(subtitleFont * 1.35);
    } else if (canShrinkTitle) {
      titleFont -= 1;
      titleLines = wrapTextByPixels(title, titleFont, maxWidth);
      titleLineHeight = Math.ceil(titleFont * 1.2);
    }
  }

  return {
    titleFontSize: titleFont,
    subtitleFontSize: subtitleFont,
    titleLines,
    subtitleLines,
    titleLineHeight,
    subtitleLineHeight,
  };
}

function renderTextBlock({ lines, x, startY, fontSize, lineHeight, fontWeight, fill, opacity }) {
  if (!lines || lines.length === 0) return '';

  const ts = lines
    .map((line, idx) => `<tspan x="${x}" y="${startY + (idx * lineHeight)}">${escapeXml(line)}</tspan>`)
    .join('');

  return `
    <text
      font-family="Arial, Helvetica, sans-serif"
      font-size="${fontSize}"
      font-weight="${fontWeight}"
      fill="${fill}"
      text-anchor="middle"
      opacity="${opacity}"
      style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
    >
      ${ts}
    </text>
  `;
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function hashString(input) {
  let hash = 0;
  const str = String(input || '');
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function hslToRgb(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hp >= 0 && hp < 1) {
    r1 = c; g1 = x; b1 = 0;
  } else if (hp >= 1 && hp < 2) {
    r1 = x; g1 = c; b1 = 0;
  } else if (hp >= 2 && hp < 3) {
    r1 = 0; g1 = c; b1 = x;
  } else if (hp >= 3 && hp < 4) {
    r1 = 0; g1 = x; b1 = c;
  } else if (hp >= 4 && hp < 5) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  const m = light - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const normalized = String(hex || '').replace('#', '');
  if (normalized.length !== 6) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const toLinear = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const rr = toLinear(r);
  const gg = toLinear(g);
  const bb = toLinear(b);
  return (0.2126 * rr) + (0.7152 * gg) + (0.0722 * bb);
}

function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexToRgb(hexA));
  const l2 = relativeLuminance(hexToRgb(hexB));
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

function pickReadableTextColor(bgStart, bgEnd) {
  const white = '#FFFFFF';
  const dark = '#111111';
  const whiteScore = Math.min(contrastRatio(white, bgStart), contrastRatio(white, bgEnd));
  const darkScore = Math.min(contrastRatio(dark, bgStart), contrastRatio(dark, bgEnd));
  return whiteScore >= darkScore ? white : dark;
}

function createPaletteFromSeed(seed) {
  const hash = hashString(seed);
  const hue = hash % 360;
  const saturation = 66 + (hash % 14); // 66-79
  const lightStart = 36 + (hash % 12); // 36-47
  const lightEnd = Math.max(22, lightStart - (8 + (hash % 7))); // darker for gradient depth

  const bgColor = rgbToHex(hslToRgb(hue, saturation, lightStart));
  const bgColorEnd = rgbToHex(hslToRgb((hue + 22) % 360, Math.min(86, saturation + 6), lightEnd));
  const textColor = pickReadableTextColor(bgColor, bgColorEnd);

  const accentHue = (hue + 160) % 360;
  const accentLight = textColor === '#FFFFFF' ? 72 : 34;
  const accentColor = rgbToHex(hslToRgb(accentHue, 82, accentLight));

  return { bgColor, bgColorEnd, textColor, accentColor };
}

function collectJsonFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && full.toLowerCase().endsWith('.json')) {
        results.push(full);
      }
    }
  }

  return results;
}

function normalizeRelativeOutput(relJsonPath) {
  return relJsonPath
    .replace(/\\/g, '/')
    .replace(/\.json$/i, '.png');
}

function safeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function pickByPath(obj, pathParts) {
  let current = obj;
  for (const part of pathParts) {
    if (!current || typeof current !== 'object') return '';
    current = current[part];
  }
  return safeString(current);
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function getPrimaryPayload(data) {
  const root = asObject(data);
  if (!root) return data;

  const keys = Object.keys(root);
  if (keys.length === 1) {
    const only = asObject(root[keys[0]]);
    if (only) return only;
  }
  return root;
}

function findFirstTitleCandidate(obj) {
  const primary = getPrimaryPayload(obj);
  const primaryDirect = [
    pickByPath(primary, ['meta', 'title']),
    pickByPath(primary, ['openGraph', 'title']),
    pickByPath(primary, ['open_graph', 'og:title']),
    safeString(primary.title),
    safeString(primary.name),
  ].find(Boolean);
  if (primaryDirect) return primaryDirect;

  const queue = [obj];
  let depth = 0;
  while (queue.length > 0 && depth < 4000) {
    const current = queue.shift();
    depth += 1;
    if (!current || typeof current !== 'object') continue;

    const direct = [
      pickByPath(current, ['meta', 'title']),
      pickByPath(current, ['openGraph', 'title']),
      pickByPath(current, ['open_graph', 'og:title']),
      safeString(current.title),
      safeString(current.name),
    ].find(Boolean);

    if (direct) return direct;

    for (const key of Object.keys(current)) {
      const value = current[key];
      if (value && typeof value === 'object') {
        queue.push(value);
      }
    }
  }

  return '';
}

function findFirstDescriptionCandidate(obj) {
  const primary = getPrimaryPayload(obj);
  const primaryDirect = [
    pickByPath(primary, ['meta', 'description']),
    pickByPath(primary, ['openGraph', 'description']),
    pickByPath(primary, ['open_graph', 'og:description']),
    safeString(primary.description),
    safeString(primary.subtitle),
  ].find(Boolean);
  if (primaryDirect) return primaryDirect;

  const queue = [obj];
  let depth = 0;
  while (queue.length > 0 && depth < 4000) {
    const current = queue.shift();
    depth += 1;
    if (!current || typeof current !== 'object') continue;

    const direct = [
      pickByPath(current, ['meta', 'description']),
      pickByPath(current, ['openGraph', 'description']),
      pickByPath(current, ['open_graph', 'og:description']),
      safeString(current.description),
      safeString(current.subtitle),
    ].find(Boolean);

    if (direct) return direct;

    for (const key of Object.keys(current)) {
      const value = current[key];
      if (value && typeof value === 'object') {
        queue.push(value);
      }
    }
  }

  return '';
}

function inferTextFromPath(relPath) {
  const withoutExt = relPath.replace(/\.json$/i, '').replace(/\\/g, '/');
  const parts = withoutExt.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || 'page';
  const readable = lastPart
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());

  return {
    title: readable,
    subtitle: parts.slice(0, -1).join(' / ').replace(/[-_]+/g, ' '),
  };
}

function getSelectedLocales() {
  const available = fs.existsSync(LOCALES_ROOT)
    ? fs.readdirSync(LOCALES_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];

  const requested = safeString(argv.locale)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  if (requested.length === 0) return available;
  return available.filter((loc) => requested.includes(loc));
}

function sanitizeJsonText(raw) {
  if (!raw) return '';

  // Remove UTF-8 BOM if present.
  let text = String(raw).replace(/^\uFEFF/, '').trim();

  // Keep only the first complete JSON object/array if extra chars were injected.
  const firstObject = text.indexOf('{');
  const firstArray = text.indexOf('[');
  let start = -1;
  if (firstObject === -1) {
    start = firstArray;
  } else if (firstArray === -1) {
    start = firstObject;
  } else {
    start = Math.min(firstObject, firstArray);
  }

  const lastObject = text.lastIndexOf('}');
  const lastArray = text.lastIndexOf(']');
  const end = Math.max(lastObject, lastArray);

  if (start >= 0 && end >= start) {
    text = text.slice(start, end + 1);
  }

  return text.trim();
}

function parseLocaleJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');

  try {
    return JSON.parse(raw);
  } catch (_) {
    const sanitized = sanitizeJsonText(raw);
    return JSON.parse(sanitized);
  }
}

// Main execution
(async () => {
  console.log('Generating locale OG images...\n');
  ensureDir(OUTPUT_DIR);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  const selectedLocales = getSelectedLocales();
  if (selectedLocales.length === 0) {
    console.error('No locales found to process.');
    process.exit(1);
  }

  const tasks = [];
  for (const locale of selectedLocales) {
    const localeDir = path.join(LOCALES_ROOT, locale);
    const files = collectJsonFiles(localeDir);
    for (const file of files) {
      tasks.push({ locale, file });
    }
  }

  const scopedTasks = LIMIT > 0 ? tasks.slice(0, LIMIT) : tasks;

  console.log(`Locales: ${selectedLocales.join(', ')}`);
  console.log(`JSON files discovered: ${tasks.length}`);
  if (LIMIT > 0) {
    console.log(`Applying limit: ${LIMIT} files`);
  }
  if (IS_DRY_RUN) {
    console.log('Dry run enabled: no files will be written.');
  }
  console.log('');

  for (const task of scopedTasks) {
    try {
      const data = parseLocaleJson(task.file);

      const relFromLocale = path.relative(path.join(LOCALES_ROOT, task.locale), task.file);
      const outputRel = normalizeRelativeOutput(path.join(task.locale, relFromLocale));

      const inferred = inferTextFromPath(relFromLocale);
      const title = findFirstTitleCandidate(data) || inferred.title || 'Sanatana Dharma';
      const subtitle = findFirstDescriptionCandidate(data) || inferred.subtitle || task.locale.toUpperCase();

      await generateOGImage(title, subtitle, outputRel, {});
      successCount++;
    } catch (err) {
      console.error(`Failed: ${task.file} -> ${err.message}`);
      failCount++;
    }
  }

  skippedCount = tasks.length - scopedTasks.length;

  console.log(`\nSuccessfully generated ${successCount} OG images`);
  if (failCount > 0) {
    console.log(`Failed to generate ${failCount} OG images`);
  }
  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} files due to limit`);
  }
  console.log(`Output directory: ${OUTPUT_DIR}`);
})();
