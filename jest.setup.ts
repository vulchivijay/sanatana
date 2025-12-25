// Polyfill MessageChannel for React SSR which may expect it in some builds
if (typeof (global as any).MessageChannel === 'undefined') {
	try {
		// Node's worker_threads provides MessageChannel
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { MessageChannel } = require('worker_threads');
		// @ts-ignore
		global.MessageChannel = MessageChannel;
	} catch (err) {
		// ignore if not available
	}
}

// Polyfill TextEncoder/TextDecoder if missing (older Node/Jest environments)
if (typeof (global as any).TextEncoder === 'undefined') {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { TextEncoder, TextDecoder } = require('util');
		// @ts-ignore
		global.TextEncoder = TextEncoder;
		// @ts-ignore
		global.TextDecoder = TextDecoder;
	} catch (err) {
		// ignore
	}
}

import '@testing-library/jest-dom';
