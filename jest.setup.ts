// Polyfill MessageChannel for React SSR which may expect it in some builds
if (typeof (global as any).MessageChannel === 'undefined') {
	try {
		// Use dynamic import to avoid `require()` style imports in ESM
		// top-level await is supported in our test environment.
		// eslint-disable-next-line no-empty
		const mod = await import('worker_threads').catch(() => null);
		if (mod && (mod as any).MessageChannel) {
			// @ts-expect-error - assigning polyfill to global
			(global as any).MessageChannel = (mod as any).MessageChannel;
		}
	} catch (err) {
		// ignore if not available
	}
}

// Polyfill TextEncoder/TextDecoder if missing (older Node/Jest environments)
if (typeof (global as any).TextEncoder === 'undefined') {
	try {
		const util = await import('util').catch(() => null);
		if (util) {
			// @ts-expect-error - assigning polyfill to global
			(global as any).TextEncoder = (util as any).TextEncoder;
			// @ts-expect-error - assigning polyfill to global
			(global as any).TextDecoder = (util as any).TextDecoder;
		}
	} catch (err) {
		// ignore
	}
}

import '@testing-library/jest-dom';
