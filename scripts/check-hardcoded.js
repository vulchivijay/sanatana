#!/usr/bin/env node
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/**
 * check-hardcoded.js
 * Purpose: Scan source files for hardcoded strings or assets that should be
 * localized or moved to `locales/`. Useful for finding missed i18n keys,
 * hardcoded URLs, or literals in React components.
 * Usage: node scripts/check-hardcoded.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = [path.join(ROOT, 'app')];
const EXT = ['.tsx', '.jsx'];

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
