/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
/**
 * propagate-nav-shape.js
 * Purpose: Ensure navigation shape/structure is propagated from the canonical
 * source (usually `locales/en`) to other locale files while preserving any
 * locale-specific additions. Useful when nav structure changes and needs to
 * be kept consistent across locales.
 * Usage: node scripts/propagate-nav-shape.js [--apply]
 */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const enFile = path.join(localesDir, 'en.json');

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
