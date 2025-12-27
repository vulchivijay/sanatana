#!/usr/bin/env node
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/**
 * add-copyright.js
 * Purpose: Scan repository files and ensure a standard copyright/license
 * header is present. Supports dry-run and force modes to preview or apply
 * changes. Useful for adding or normalizing license headers across source
 * files before publishing.
 * Usage: node scripts/add-copyright.js [--dry-run] [--force] [--root <path>]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const FORCE = args.includes('--force');
const NO_BACKUP = args.includes('--no-backup');
const rootArgIndex = args.indexOf('--root');
const ROOT = rootArgIndex >= 0 && args[rootArgIndex + 1] ? path.resolve(args[rootArgIndex + 1]) : path.resolve(__dirname, '..');

let pkg = {};
try {
	pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')) || {};
} catch (e) {
	// If package.json is unreadable, continue with minimal metadata
	pkg.name = pkg.name || 'sanatanadharmam.in';
}

const COPYRIGHT = `/* Copyright (c) ${new Date().getFullYear()} ${pkg.name} Licensed under SEE LICENSE IN LICENSE. All rights reserved. */`;

const EXTS = ['.js', '.ts', '.jsx', '.tsx'];

function walkDir(dir) {
	const out = [];
	for (const name of fs.readdirSync(dir)) {
		if (['node_modules', '.git', '.next', 'out', 'public'].includes(name)) continue;
		const full = path.join(dir, name);
		try {
			const st = fs.statSync(full);
			if (st.isDirectory()) out.push(...walkDir(full));
			else if (EXTS.includes(path.extname(full))) out.push(full);
		} catch (e) {
			// ignore unreadable paths
		}
	}
	return out;
}

function ensureHeader(file, dry = true, noBackup = false) {
	const src = fs.readFileSync(file, 'utf8');
	if (src.includes(pkg.name) && src.includes('SEE LICENSE IN LICENSE')) return false;
	const newContent = COPYRIGHT + '\n\n' + src;
	if (dry) {
		console.log(`DRY: would add header to ${path.relative(process.cwd(), file)}`);
		return true;
	}
	if (!noBackup) fs.copyFileSync(file, file + '.bak');
	fs.writeFileSync(file, newContent, 'utf8');
	console.log(`WROTE: ${path.relative(process.cwd(), file)}`);
	return true;
}

function main() {
	const files = walkDir(ROOT);
	if (files.length === 0) {
		console.log('No candidate files found.');
		return;
	}
	let changed = 0;
	for (const f of files) {
		if (ensureHeader(f, DRY, NO_BACKUP)) changed++;
	}
	console.log(`Processed ${files.length} files; headers added/identified: ${changed}`);
}

if (require.main === module) main();
