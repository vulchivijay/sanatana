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
try { pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')); } catch (e) { 
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
