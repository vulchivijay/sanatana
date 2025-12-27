/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../../lib/i18n';



import PageLayout from '@components/common/PageLayout';
import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata(props: any) {
  const { params, searchParams } = props || {};
  const locale = await detectLocale(searchParams);

  const S = (k: string) => String(t(k, locale));

  const meta = getMeta('kidsZone_illustratedStories_item', undefined, locale) || {};
  return {
    title: meta.title || `Story ${params.id}`,
    description: meta.description,
  };
}

export async function generateStaticParams() {
  const file = path.join(process.cwd(), 'locales', 'en', 'illustratedstories.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    const doc = JSON.parse(raw);
    const items = doc?.illustratedStories?.kids_indian_stories ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((s: any) => ({ id: String(s.id) }));
  } catch (err) {
    return [];
  }
}

async function loadStories(locale: string) {
  const file = path.join(process.cwd(), 'locales', locale, 'illustratedstories.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    const doc = JSON.parse(raw);
    return doc?.illustratedStories?.kids_indian_stories ?? [];
  } catch (err) {
    if (locale !== 'en') return loadStories('en');
    return [];
  }
}

export default async function Page({ params, searchParams }: any) {
  const locale = await detectLocale(searchParams);
  const stories = await loadStories(locale);
  const id = String(params.id);
  const idx = stories.findIndex((s: any) => String(s.id) === id);
  const item = idx >= 0 ? stories[idx] : null;

  if (!item) {
    return (
      <PageLayout title={S('kidsZone.illustratedStories.comicNotFoundTitle', locale)} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]} locale={locale}>
        <p>{S('kidsZone.illustratedStories.comicNotFoundDesc', locale)}</p>
      </PageLayout>
    );
  }

  const prev = idx > 0 ? stories[idx - 1] : null;
  const next = idx < stories.length - 1 ? stories[idx + 1] : null;

  return (
    <>
      <PageLayout title={item.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: S('kidsZone.illustratedStories.title', locale), href: '/kidsZone/illustratedStories' }, { label: item.title }]}>
        <div>{item.origin}</div>
        <div>
          <div>
            <Image src={item.imgSrc || `/images/stories/${item.id}.webp`} alt={item.imgAlt || item.title} fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <p>{item.summary}</p>
        {item.moral ? <p><strong>{S('kidsZone.illustratedStories.moralLabel', locale)}</strong> {item.moral}</p> : null}
        {item.characters?.length ? <div><strong>{S('kidsZone.illustratedStories.charactersLabel', locale)}</strong> {item.characters.join(', ')}</div> : null}
        {item.themes?.length ? <div><strong>{S('kidsZone.illustratedStories.themesLabel', locale)}</strong> {item.themes.join(', ')}</div> : null}

        <div>
          {prev ? (
            <Link href={`/kidsZone/illustratedStories/${prev.id}`}>&larr; {prev.title}</Link>
          ) : <div />}
          {next ? (
            <Link href={`/kidsZone/illustratedStories/${next.id}`}>{next.title} &rarr;</Link>
          ) : <div />}
        </div>
      </PageLayout>
    </>
  );
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
