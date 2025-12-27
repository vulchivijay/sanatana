import { t, getMeta, detectLocale, DEFAULT_LOCALE, detectServerLocaleFromHeaders } from './i18n';
import { headers } from 'next/headers';

export function resolveLocaleFromHeaders() {
  try {
    const h = headers() as unknown;
    return detectServerLocaleFromHeaders(h as Record<string, unknown>);
  } catch (e) {
    return DEFAULT_LOCALE;
  }
}

export function createGenerateMetadata(metaKey: string, titleKey?: string, descriptionKey?: string) {
  return async function generateMetadata(props: Record<string, unknown> | undefined) {
    const { searchParams } = (props || {}) as { searchParams?: unknown };
    // `searchParams` can be a Promise in newer Next.js versions — unwrap it first
    let resolvedSearchParams: unknown = searchParams;
    try {
      if (resolvedSearchParams && typeof resolvedSearchParams.then === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error - resolvedSearchParams is a Promise here
        resolvedSearchParams = await resolvedSearchParams;
      }
    } catch (e) {
      resolvedSearchParams = undefined;
    }

    let locale = detectLocale(resolvedSearchParams);
    if (!locale) locale = resolveLocaleFromHeaders();
    const title = titleKey ? t(titleKey, locale) : undefined;
    const meta = getMeta(metaKey, {}, locale) || {};
    const description = descriptionKey ? (t(descriptionKey, locale) || meta.description) : meta.description;
    return {
      title,
      description,
      keywords: meta.keywords || undefined,
      openGraph: { title, description, images: meta.ogImage ? [meta.ogImage] : undefined },
      alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
    };
  };
}
