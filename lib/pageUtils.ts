/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getLocaleNamespaceObjectAsync, DEFAULT_LOCALE, detectLocale } from './i18n';
import { secrets } from './secrets';

// Inlined generateSEO from lib/seo.ts to avoid cross-module dependency
type SEOOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sanatanadharmam.in").replace(/\/$/, "");
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Sanatana";
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Explore Sanātana Dharma: eternal principles of Hinduism, Vedic traditions, and spiritual practices.';

function absoluteUrl(path = "/") {
  if (!path) return SITE_URL + "/";
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

function generateSEO(opts: SEOOptions) {
  const title = opts.title ? `${opts.title} | ${SITE_NAME}` : SITE_NAME;
  const description = opts.description || SITE_DESCRIPTION;
  const url = absoluteUrl(opts.path || "/");

  const images = opts.image ? [{ url: opts.image }] : undefined;

  const metadata: any = {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images,
      type: "website",
    },
    twitter: {
      title,
      description,
      images: images ? images.map((i) => String(i.url)) : undefined,
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
  };

  if (opts.keywords && opts.keywords.length) {
    // attach as `other.keywords`
    metadata.other = { keywords: opts.keywords.join(', ') };
  }

  return metadata;
}

export function createGenerateMetadata(metaKey: string, titleKey?: string, descriptionKey?: string) {
  // Simple in-process memoization to avoid repeated concurrent loads of the
  // same locale namespace during static generation/build. This reduces IO
  // pressure when Next.js invokes metadata generation for many pages.
  const metadataCache = new Map<string, Promise<any>>();

  function isPlainObject(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  function firstString(...candidates: unknown[]): string | undefined {
    for (const c of candidates) {
      if (typeof c === 'string') {
        const s = c.trim();
        if (s) return s;
      }
    }
    return undefined;
  }

  function toAbsoluteUrl(maybeUrl: unknown, baseUrl: string): string | undefined {
    if (!maybeUrl) return undefined;
    const s = String(maybeUrl).trim();
    if (!s) return undefined;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    if (s.startsWith('/')) return `${baseUrl}${s}`;
    return `${baseUrl}/${s}`;
  }

  function normalizeCanonical(maybeUrl: unknown): string | undefined {
    const raw = typeof maybeUrl === 'string' ? maybeUrl : (maybeUrl != null ? String(maybeUrl) : '');
    let canonical = raw.trim();
    if (!canonical) return undefined;
    try {
      const urlObj = new URL(canonical);
      const isRoot = urlObj.pathname === '/' || urlObj.pathname === '';
      const looksLikeFile = /\.[a-z0-9]{1,6}$/i.test(urlObj.pathname);
      if (!isRoot && !looksLikeFile && !urlObj.pathname.endsWith('/')) {
        urlObj.pathname = urlObj.pathname + '/';
      }
      return urlObj.toString();
    } catch (_) {
      if (canonical && canonical !== 'https://sanatanadharmam.in' && !canonical.endsWith('/') && !/\.[a-z0-9]{1,6}$/i.test(canonical)) {
        canonical += '/';
      }
      return canonical;
    }
  }

  function canonicalPathFromMetaKey(key: string): string {
    const raw = String(key || '').trim();
    if (!raw || raw === 'home') return '/';

    let cleaned = raw.replace(/^\/+/, '');
    if (cleaned.endsWith('/index')) {
      cleaned = cleaned.slice(0, -'/index'.length);
    }
    if (!cleaned) return '/';
    return `/${cleaned}`;
  }

  function isSameHost(url: string, baseUrl: string): boolean {
    try {
      return new URL(url).host === new URL(baseUrl).host;
    } catch (_) {
      return false;
    }
  }

  function sanitizeCanonical(rawCanonical: unknown, fallbackCanonical: string, baseUrl: string): string {
    const raw = typeof rawCanonical === 'string' ? rawCanonical.trim() : (rawCanonical != null ? String(rawCanonical).trim() : '');
    if (!raw) return fallbackCanonical;

    // Ignore common placeholder values that should never be emitted.
    if (/yourdomain\.com/i.test(raw)) return fallbackCanonical;

    // If canonical is off-domain, prefer a same-origin canonical for indexing safety.
    if ((raw.startsWith('http://') || raw.startsWith('https://')) && !isSameHost(raw, baseUrl)) {
      return fallbackCanonical;
    }

    return raw;
  }

  function unwrapPageObject(rawNs: unknown): Record<string, unknown> {
    if (!isPlainObject(rawNs)) return {};

    // Common structure: { "metaKey": { ...page... } }
    if (isPlainObject((rawNs as any)[metaKey])) return (rawNs as any)[metaKey] as Record<string, unknown>;

    // Alternate: file directly exports the page object
    if ((rawNs as any).meta || (rawNs as any).openGraph || (rawNs as any).schema) return rawNs as Record<string, unknown>;

    // Auto-unwrap: exactly 1 top-level object key
    const keys = Object.keys(rawNs);
    if (keys.length === 1 && isPlainObject((rawNs as any)[keys[0]])) return (rawNs as any)[keys[0]] as Record<string, unknown>;

    return rawNs as Record<string, unknown>;
  }

  function extractSchemaFallback(schema: unknown): { title?: string; description?: string; url?: string; image?: string } {
    if (!isPlainObject(schema)) return {};

    const pickFromNode = (node: Record<string, unknown>) => {
      const title = firstString(node.headline, node.name);
      const description = firstString(node.description);
      const url = firstString(node.url);
      let image: string | undefined;
      const img = (node as any).image;
      if (typeof img === 'string') image = img;
      else if (Array.isArray(img) && img.length > 0) image = typeof img[0] === 'string' ? img[0] : firstString((img[0] as any)?.url);
      else if (isPlainObject(img)) image = firstString((img as any).url);
      return { title, description, url, image };
    };

    // Handle schema with @graph
    const graph = (schema as any)['@graph'];
    if (Array.isArray(graph)) {
      for (const node of graph) {
        if (!isPlainObject(node)) continue;
        const t = String((node as any)['@type'] || '');
        if (/Article|WebPage|CollectionPage|CreativeWork|AboutPage|WebSite|Book/i.test(t)) {
          const picked = pickFromNode(node);
          if (picked.title || picked.description || picked.url || picked.image) return picked;
        }
      }
      // fallback to first node
      const first = graph.find((n) => isPlainObject(n)) as Record<string, unknown> | undefined;
      return first ? pickFromNode(first) : {};
    }

    return pickFromNode(schema);
  }

  return async function generateMetadata(props: Record<string, unknown> | undefined) {
    const { searchParams } = (props || {}) as { searchParams?: unknown };
    // `searchParams` can be a Promise in newer Next.js versions.
    // Do NOT await it here because awaiting makes the metadata generation
    // depend on runtime values and prevents static rendering. If it's
    // a Promise-like object, treat it as unresolved so we fall back to
    // header-based detection on the server.
    let resolvedSearchParams: unknown = searchParams;
    try {
      if (resolvedSearchParams && typeof (resolvedSearchParams as any).then === 'function') {
        resolvedSearchParams = undefined;
      }
    } catch (e) {
      resolvedSearchParams = undefined;
    }
    let searchParamsObj: Record<string, any> | undefined =
      resolvedSearchParams && typeof resolvedSearchParams === 'object' && !Array.isArray(resolvedSearchParams)
        ? (resolvedSearchParams as Record<string, any>)
        : undefined;
    let locale = detectLocale(searchParamsObj);
    if (!locale) locale = DEFAULT_LOCALE;

    const cacheKey = `${locale}::${metaKey}`;
    let rawNsPromise = metadataCache.get(cacheKey);
    if (!rawNsPromise) {
      rawNsPromise = getLocaleNamespaceObjectAsync(locale, metaKey);
      metadataCache.set(cacheKey, rawNsPromise);
    }
    const rawNs = await rawNsPromise;
    const pageObj = unwrapPageObject(rawNs);
    const meta = isPlainObject(pageObj.meta) ? (pageObj.meta as Record<string, unknown>) : {};
    const openGraph = isPlainObject(pageObj.openGraph) ? (pageObj.openGraph as Record<string, unknown>) : {};
    const schema = isPlainObject(pageObj.schema) ? (pageObj.schema as Record<string, unknown>) : {};
    const schemaFallback = extractSchemaFallback(schema);

    const baseUrl = String(secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '');

    // Prefer explicit titleKey/descriptionKey -> translation, otherwise fall back to meta values.
    // The `t()` function returns the key string when a translation is missing, so
    // treat that case as "not found" and use `meta` as the fallback.
    let title: string | undefined;
    if (titleKey) {
      const tv = t(titleKey, locale);
      title = (typeof tv === 'string' && tv !== titleKey) ? tv : firstString(meta.title, (pageObj as any).title, (openGraph as any).title, schemaFallback.title);
    } else {
      title = firstString(meta.title, (pageObj as any).title, (openGraph as any).title, schemaFallback.title);
    }
    let description: string | undefined;
    if (descriptionKey) {
      const dv = t(descriptionKey, locale);
      description = (typeof dv === 'string' && dv !== descriptionKey) ? dv : firstString(meta.description, (pageObj as any).description, (openGraph as any).description, schemaFallback.description);
    } else {
      description = firstString(meta.description, (pageObj as any).description, (openGraph as any).description, schemaFallback.description);
    }

    // Canonical (prefer locale value, but sanitize placeholders/off-domain values).
    const canonicalFallback = `${baseUrl}${canonicalPathFromMetaKey(metaKey)}`;
    const canonicalCandidate =
      (meta as any).canonical || (meta as any).url || (openGraph as any).url || schemaFallback.url;
    const canonical = normalizeCanonical(
      sanitizeCanonical(canonicalCandidate, canonicalFallback, baseUrl)
    );

    // OpenGraph
    type OgImage = string | { url: string; width?: number; height?: number; alt?: string };
    function isOgImage(v: OgImage | null): v is OgImage {
      return v !== null;
    }
    let ogImages: OgImage[] | undefined;
    const ogFromLocale = (openGraph as any).images as unknown;
    if (Array.isArray(ogFromLocale) && ogFromLocale.length > 0) {
      ogImages = (ogFromLocale as unknown[])
        .map<OgImage | null>((img) => {
          if (!img) return null;
          if (typeof img === 'string') {
            const url = toAbsoluteUrl(img, baseUrl);
            return url ? url : null;
          }
          if (isPlainObject(img)) {
            const url = toAbsoluteUrl((img as any).url, baseUrl);
            if (!url) return null;
            const width = typeof (img as any).width === 'number' ? (img as any).width : undefined;
            const height = typeof (img as any).height === 'number' ? (img as any).height : undefined;
            const alt = typeof (img as any).alt === 'string' ? (img as any).alt : undefined;
            return { url, width, height, alt };
          }
          return null;
        })
        .filter(isOgImage);
    }
    if (!ogImages || ogImages.length === 0) {
      const img = toAbsoluteUrl((meta as any).ogImage || schemaFallback.image, baseUrl);
      if (img) ogImages = [{ url: img }];
    }

    // const ogTitle = firstString((openGraph as any).title, title, meta.title, (pageObj as any).title, schemaFallback.title);
    // const ogDescription = firstString((openGraph as any).description, description, meta.description, (pageObj as any).description, schemaFallback.description);
    const ogCandidate = (openGraph as any).url || (meta as any).url || canonical;
    const ogUrl = normalizeCanonical(
      sanitizeCanonical(ogCandidate, canonical || canonicalFallback, baseUrl)
    );
    // const ogSiteName = firstString((openGraph as any).siteName, 'Sanatanadharmam');
    // const ogType = firstString((openGraph as any).type, 'website');

    // const robots = parseRobots((meta as any).robots);

    // Build a path relative to the site base for use with generateSEO
    // reuse `baseUrl` defined earlier in this function
    let pathForSeo: string | undefined = undefined;
    try {
      const u = new URL(ogUrl || canonical || baseUrl);
      if (u.origin === baseUrl) pathForSeo = u.pathname + (u.search || '');
      else pathForSeo = u.toString();
    } catch (e) {
      pathForSeo = String(canonical || '/');
    }

    // prefer plain string image if available
    let imageForSeo: string | undefined;
    if (Array.isArray(ogImages) && ogImages.length > 0) {
      const first = ogImages[0] as any;
      imageForSeo = typeof first === 'string' ? first : first?.url;
    }

    return generateSEO({
      title: title || undefined,
      description: description || undefined,
      path: pathForSeo,
      image: imageForSeo,
      keywords: (meta as any).keywords || undefined,
    });
  };
}

export async function resolveParams<T>(params: T | Promise<T> | null | undefined): Promise<T | undefined> {
  if (params == null) return undefined;

  try {
    return await params;
  } catch {
    return undefined;
  }
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */ 