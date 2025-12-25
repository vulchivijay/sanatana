import type { NextConfig } from "next";
import path from 'path';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Allow choosing static export vs server deployment via env var.
// When `NEXT_STATIC_EXPORT="true"` the build sets `output: 'export'` and `trailingSlash: true`.
// Otherwise the app builds as a server-capable Next app (API routes and server runtime available).
// Allow forcing server-start even when `NEXT_STATIC_EXPORT` is set by using
// `NEXT_ALLOW_START=true` in the environment. This keeps the default behavior
// of static export but allows local `next start` when explicitly requested.
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true' && process.env.NEXT_ALLOW_START !== 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicit turbopack config (empty) to avoid the runtime error when
  // a custom `webpack` function is present. Next.js 16 enables Turbopack
  // by default; providing an explicit `turbopack` field silences the
  // conflict warning and allows webpack overrides to continue working.
  turbopack: {},
  reactStrictMode: true,

  // Client-side (browser) source maps in production:
  productionBrowserSourceMaps: true,

  // SWC minify removed — Next.js may warn about `swcMinify` in newer versions.
  // Experimental CSS optimization (dedupe & minimize CSS across pages).
  experimental: {
    optimizeCss: true,
  },
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport ? true : false,
  images: {
    // Disable Next Image optimization for static export / GitHub Pages
    unoptimized: true,
    minimumCacheTTL: 86400 // 1 day
  },
  outputFileTracingRoot: __dirname,
  // Configure webpack persistent caching so subsequent builds can reuse
  // compiled artifacts. This reduces build times and avoids "No build
  // cache found" warnings in environments that support a writable
  // filesystem cache (CI or developer machines).
  webpack(config: any, { dev }: { dev: boolean }) {
    try {
      if (!config.cache) {
        config.cache = {
          type: 'filesystem',
          cacheDirectory: path.join(__dirname, '.next', '.cache', 'webpack'),
          buildDependencies: {
            config: [__filename],
          },
        };
      }
      if (!dev) {
        // Emit source maps but don't link them in the JS files:
        config.devtool = 'hidden-source-map';  // emit maps, don't link in JS
      }
    } catch (e) {
      // ignore cache configuration errors
    }
    return config;
  },
  async headers() {
    return [
      // Long-term immutable caching for fingerprinted assets (images, js, css, fonts)
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|svg|webp|css|js|woff2|woff|ttf)$',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable, stale-while-revalidate=259200' },
        ],
      },
      // JSON or locale files: moderate caching with revalidation
      {
        source: '/locales/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=259200' },
        ],
      },
      // HTML/SSR content: allow CDN short caching while keeping origin authoritative
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=604800' },
          { key: 'Vary', value: 'Accept-Encoding' }
        ],
      }
    ];
  }
};

module.exports = withBundleAnalyzer(nextConfig);