/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { MongoClient } from 'mongodb';
import * as crypto from 'crypto';
import { gzipSync } from 'zlib';

function isLikelyInvalidMongoUri(uri?: string) {
  if (!uri) return true;
  const s = uri.toLowerCase();
  if (s.includes('example') || s.includes('changeme') || s.includes('<') || s.includes('yourcluster')) return true;
  return false;
}

const SAMPLE_REPORTS = [
  {
    columnHeader: {
      dimensions: ['ga:country'],
      metricHeader: { metricHeaderEntries: [{ name: 'ga:users', type: 'INTEGER' }] },
    },
    data: {
      rows: [
        { dimensions: ['India'], metrics: [{ values: ['52959'] }] },
        { dimensions: ['United States'], metrics: [{ values: ['9207'] }] },
        { dimensions: ['United Kingdom'], metrics: [{ values: ['18726'] }] },
        { dimensions: ['Saudhi Arabia'], metrics: [{ values: ['5236'] }] },
        { dimensions: ['China'], metrics: [{ values: ['53584'] }] },
        { dimensions: ['Japan'], metrics: [{ values: ['32596'] }] },
        { dimensions: ['Australia'], metrics: [{ values: ['36214'] }] },
        { dimensions: ['Russia'], metrics: [{ values: ['18456'] }] },
      ],
    },
  },
  {
    columnHeader: {
      dimensions: ['ga:pagePath'],
      metricHeader: { metricHeaderEntries: [{ name: 'ga:pageviews', type: 'INTEGER' }] },
    },
    data: {
      rows: [
        { dimensions: ['/'], metrics: [{ values: ['871236'] }] },
        { dimensions: ['/vedas'], metrics: [{ values: ['254378'] }] },
        { dimensions: ['/puranas'], metrics: [{ values: ['451236'] }] },
        { dimensions: ['/sastras'], metrics: [{ values: ['654123'] }] },
        { dimensions: ['/sastras'], metrics: [{ values: ['354123'] }] },
        { dimensions: ['/donate'], metrics: [{ values: ['174236'] }] },
      ],
    },
  },
];

export const dynamic = 'force-static';

// Simple in-memory cache for analytics reports to avoid repeated slow backend calls.
// Cache is keyed by backend + identifier and stores { reports, ts }
const cache = new Map();
const DEFAULT_TTL = 60 * 5; // 5 minutes default
function getCacheTtl() {
  const v = Number(process.env.ANALYTICS_CACHE_TTL || '') || DEFAULT_TTL;
  return Math.max(10, v);
}
function getCacheSWR() {
  const v = Number(process.env.ANALYTICS_CACHE_SWR || '') || 60;
  return Math.max(0, v);
}

function cacheKeyForBackend(backend: string | undefined) {
  if (!backend) return 'default';
  if (backend === 'google') {
    // include property/view id to separate GA/GA4 shapes
    return `google:${process.env.GA_PROPERTY_ID || process.env.GA_VIEW_ID || 'any'}`;
  }
  return backend;
}

async function fetchWithGoogle() {
  // Support both `GA_CLIENT_EMAIL` (expected) and legacy/mis-typed `GA_CLIENT_MAIL`
  const clientEmail = (process.env.GA_CLIENT_EMAIL || process.env.GA_CLIENT_MAIL) as string | undefined;
  const rawKey = process.env.GA_PRIVATE_KEY as string | undefined;
  const viewId = process.env.GA_VIEW_ID as string | undefined;

  if (!clientEmail || !rawKey || !viewId) {
    throw new Error('Missing GA env vars');
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const analytics = google.analyticsreporting({ version: 'v4', auth });

  const response = await analytics.reports.batchGet({
    requestBody: {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [{ expression: 'ga:users' }],
          dimensions: [{ name: 'ga:country' }],
        },
      ],
    },
  });

  const reports = response.data.reports || [];
  // If the reporting API returned no reports, the property may be GA4 — caller can set GA_PROPERTY_ID
  if ((!reports || reports.length === 0) && process.env.GA_PROPERTY_ID) {
    // fall through to GA4 path by throwing a sentinel error that will be caught by the caller
    const err: any = new Error('No UA reports');
    err.code = 'NO_UA_REPORTS';
    throw err;
  }

  return reports;
}

// GA4 Data API fallback when `GA_PROPERTY_ID` is set (property numeric id)
async function fetchWithGoogleGA4() {
  // Support both `GA_CLIENT_EMAIL` (expected) and legacy/mis-typed `GA_CLIENT_MAIL`
  const clientEmail = (process.env.GA_CLIENT_EMAIL || process.env.GA_CLIENT_MAIL) as string | undefined;
  const rawKey = process.env.GA_PRIVATE_KEY as string | undefined;
  const propertyId = process.env.GA_PROPERTY_ID as string | undefined;

  if (!clientEmail || !rawKey || !propertyId) {
    throw new Error('Missing GA4 env vars');
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });

  // request a simple report: users by country and page path pageviews
  const countryRes = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      limit: '100',
    },
  });

  const pageRes = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      limit: '100',
    },
  });

  const toRows = (res: any, dimKey: string, metricIdx = 0) => {
    const rows = (res?.data?.rows || []).map((r: any) => {
      const dimension = r.dimensionValues?.[0]?.value || r.dimensionValues?.map((d: any) => d.value).join('/') || '';
      const val = r.metricValues?.[metricIdx]?.value || '0';
      return { dimensions: [dimension], metrics: [{ values: [String(val)] }] };
    });
    return rows;
  };

  const reports = [
    {
      columnHeader: {
        dimensions: ['ga:country'],
        metricHeader: { metricHeaderEntries: [{ name: 'ga:activeUsers', type: 'INTEGER' }] },
      },
      data: { rows: toRows(countryRes, 'country', 0) },
    },
    {
      columnHeader: {
        dimensions: ['ga:pagePath'],
        metricHeader: { metricHeaderEntries: [{ name: 'ga:pageviews', type: 'INTEGER' }] },
      },
      data: { rows: toRows(pageRes, 'pagePath', 0) },
    },
  ];

  return reports;
}

async function fetchWithPlausible() {
  const key = process.env.PLAUSIBLE_API_KEY as string | undefined;
  const site = process.env.PLAUSIBLE_SITE_ID as string | undefined;

  if (!key || !site) throw new Error('Missing Plausible env vars');

  const url = `https://plausible.io/api/v1/stats/aggregate?site_id=${encodeURIComponent(site)}&period=30d&metrics=visitors,pageviews`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Plausible API error ${res.status}`);
  const json = await res.json();

  return [
    {
      columnHeader: {
        dimensions: ['ga:metric'],
        metricHeader: { metricHeaderEntries: [{ name: 'visitors' }, { name: 'pageviews' }] },
      },
      data: {
        rows: [
          { dimensions: ['totals'], metrics: [{ values: [String(json.results?.visitors || json.visitors || 0), String(json.results?.pageviews || json.pageviews || 0)] }] },
        ],
      },
    },
  ];
}

async function fetchWithMongoAggregate() {
  const uri = process.env.MONGODB_URI as string | undefined;
  if (!uri) {
    const e: any = new Error('Missing MONGODB_URI');
    e.code = 'MISSING_MONGODB_URI';
    throw e;
  }
  if (isLikelyInvalidMongoUri(uri)) {
    const e: any = new Error('Invalid or placeholder MONGODB_URI');
    e.code = 'INVALID_MONGODB_URI';
    throw e;
  }

  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db();
    const col = db.collection('analytics_events');

    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const rows = await col.aggregate([
      { $match: { ts: { $gte: since } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray();

    const report = {
      columnHeader: {
        dimensions: ['ga:pagePath'],
        metricHeader: { metricHeaderEntries: [{ name: 'ga:pageviews', type: 'INTEGER' }] },
      },
      data: { rows: rows.map((r: any) => ({ dimensions: [r._id || '/'], metrics: [{ values: [String(r.count)] }] })) },
    };

    return [report];
  } finally {
    await client.close();
  }
}

export async function GET(request: Request) {
  try {
    const backend = process.env.ANALYTICS_BACKEND || (process.env.GA_CLIENT_EMAIL || process.env.GA_CLIENT_MAIL ? 'google' : undefined);

    // During local development, if no analytics backend or credentials are
    // configured, short-circuit and return the sample reports immediately to
    // avoid noisy external API calls and 404 logs. This keeps `npm run dev`
    // quiet while you develop without requiring secrets.
    // Short-circuit in development with sample data to avoid external API calls
    if (process.env.NODE_ENV === 'development' && !process.env.ANALYTICS_BACKEND && !process.env.GA_CLIENT_EMAIL && !process.env.GA_CLIENT_MAIL && !process.env.PLAUSIBLE_API_KEY && !process.env.MONGODB_URI) {
      const browserMax = Math.min(60, getCacheTtl());
      const headersObj = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${getCacheTtl()}, stale-while-revalidate=${getCacheSWR()}` };
      return buildJsonResponse({ reports: SAMPLE_REPORTS, _dev_short_circuit: true }, headersObj, request);
    }

    const ttl = getCacheTtl();
    const swr = getCacheSWR();
    const cacheKey = cacheKeyForBackend(backend);

    // Serve from in-memory cache when valid
    const cached = cache.get(cacheKey) as { reports: any; ts: number } | undefined;
    const now = Date.now();
    if (cached && (now - cached.ts) < ttl * 1000) {
      const browserMax = Math.min(60, ttl);
      const headers = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${ttl}, stale-while-revalidate=${swr}` };
      return buildJsonResponse({ reports: cached.reports }, headers, request);
    }

    if (backend === 'plausible') {
      try {
        const reports = await fetchWithPlausible();
        cache.set(cacheKey, { reports, ts: Date.now() });
        const browserMax = Math.min(60, ttl);
        const headers = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${ttl}, stale-while-revalidate=${swr}` };
        return buildJsonResponse({ reports }, headers, request);
      } catch (err) {
        console.error('Plausible fetch failed', err);
      }
    }

    if (backend === 'mongo') {
      // Validate URI early and return a helpful 503 if misconfigured
      const uri = process.env.MONGODB_URI as string | undefined;
      if (isLikelyInvalidMongoUri(uri)) {
        console.warn('MongoDB URI invalid or not configured for analytics');
        return NextResponse.json({ error: 'MongoDB not configured for analytics' }, { status: 503 });
      }

      try {
        const reports = await fetchWithMongoAggregate();
        cache.set(cacheKey, { reports, ts: Date.now() });
        const browserMax = Math.min(60, ttl);
        const headers = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${ttl}, stale-while-revalidate=${swr}` };
        return buildJsonResponse({ reports }, headers, request);
      } catch (err) {
        // If the error signals an invalid URI, make that explicit
        if ((err as any)?.code === 'INVALID_MONGODB_URI' || (err as any)?.code === 'MISSING_MONGODB_URI') {
          console.warn('Mongo analytics disabled:', err);
          return NextResponse.json({ error: 'MongoDB not configured for analytics' }, { status: 503 });
        }
        console.error('Mongo analytics fetch failed', err);
      }
    }

    if (backend === 'google' || process.env.GA_CLIENT_EMAIL || process.env.GA_CLIENT_MAIL) {
      try {
        const reports = await fetchWithGoogle();
        cache.set(cacheKey, { reports, ts: Date.now() });
        const browserMax = Math.min(60, ttl);
        const headers = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${ttl}, stale-while-revalidate=${swr}` };
        return buildJsonResponse({ reports }, headers, request);
      } catch (err) {
        console.error('Google analytics fetch failed', err);
        // If UA reporting returned no reports and GA4 property id is available, try GA4 Data API
        // (some properties are GA4 and won't have UA view data)
        try {
          if ((err as any)?.code === 'NO_UA_REPORTS' && process.env.GA_PROPERTY_ID) {
            const reports = await fetchWithGoogleGA4();
            cache.set(cacheKey, { reports, ts: Date.now() });
            const browserMax = Math.min(60, ttl);
            const headers = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${ttl}, stale-while-revalidate=${swr}` };
            return buildJsonResponse({ reports }, headers, request);
          }
        } catch (err2) {
          console.error('GA4 fallback failed', err2);
        }
      }
    }

    // final fallback - sample reports (cache these briefly so clients don't hammer)
    cache.set('default', { reports: SAMPLE_REPORTS, ts: Date.now() });
    const browserMax = Math.min(60, ttl);
    const headers = { 'Cache-Control': `public, max-age=${browserMax}, s-maxage=${ttl}, stale-while-revalidate=${swr}` };
    return buildJsonResponse({ reports: SAMPLE_REPORTS }, headers, request);
  } catch (err) {
    console.error('Analytics fetch error', err);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}

// Build an HTTP response for JSON with ETag, gzip opt-in and caching headers.
function buildJsonResponse(payload: any, baseHeaders: Record<string, string> = {}, request?: Request) {
  const payloadStr = JSON.stringify(payload);
  const payloadBuf = Buffer.from(payloadStr, 'utf8');

  // ETag derived from sha256 hash of payload
  const hash = crypto.createHash('sha256').update(payloadBuf).digest('hex');
  const etag = `"${hash}"`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    ETag: etag,
    Vary: 'Accept-Encoding',
    ...baseHeaders,
  };

  // If client provided If-None-Match and it matches, return 304
  try {
    const ifNoneMatch = request?.headers.get('if-none-match');
    if (ifNoneMatch && ifNoneMatch.split(',').map(s => s.trim()).includes(etag)) {
      return new Response(null, { status: 304, headers });
    }
  } catch (e) {
    // ignore header parsing errors
  }

  // If client accepts gzip, serve gzipped buffer
  const acceptEncoding = request?.headers.get('accept-encoding') || '';
  if (acceptEncoding.includes('gzip')) {
    const gz = gzipSync(payloadBuf);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = String(gz.length);
    return new Response(gz, { status: 200, headers });
  }

  headers['Content-Length'] = String(payloadBuf.length);
  return new Response(payloadBuf, { status: 200, headers });
}

export async function POST(request: Request) {
  try {
    const backend = process.env.ANALYTICS_BACKEND;
    if (backend !== 'mongo') {
      return NextResponse.json({ error: 'Event collection not enabled' }, { status: 400 });
    }

    const payload = await request.json().catch(() => null);
    if (!payload) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const uri = process.env.MONGODB_URI as string | undefined;
    if (!uri || isLikelyInvalidMongoUri(uri)) {
      console.warn('Analytics POST rejected: invalid or missing MONGODB_URI');
      return NextResponse.json({ error: 'MongoDB not configured for analytics' }, { status: 503 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    try {
      const db = client.db();
      const col = db.collection('analytics_events');
      await col.insertOne({ ...payload, ts: new Date() });
      // Invalidate mongo cache so recent events show up on next GET
      try {
        const key = cacheKeyForBackend('mongo');
        cache.delete(key);
      } catch (e) {
        // ignore
      }
      return NextResponse.json({ ok: true });
    } finally {
      await client.close();
    }
  } catch (err) {
    console.error('Analytics POST error', err);
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
