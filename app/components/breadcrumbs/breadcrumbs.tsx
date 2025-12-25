/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import Link from 'next/link';
import { t } from '../../../lib/i18n';

type Crumb = { label: React.ReactNode; href?: string };
type CrumbInput = { label?: React.ReactNode; labelKey?: string; href?: string };

function normalizeBreadcrumbs(items: CrumbInput[], locale?: string): Crumb[] {
  return items.map((it) => {
    const label = it.labelKey ? (t(it.labelKey, locale) || it.labelKey) : (it.label ?? '');
    return { label, href: it.href };
  });
}

export default function Breadcrumbs({ items, locale }: { items: CrumbInput[]; locale?: string }) {
  const normalized = normalizeBreadcrumbs(items, locale);
  return (
    <nav role="menu" aria-label="Breadcrumb">
      <ul role="list" className="breadcrumb-wrapper flex items-center">
        {normalized.map((it, idx) => (
          <li key={idx}>
            {it.href ? (
              <Link href={it.href}>
                {it.label}
              </Link>
            ) : (
              <span>{it.label}</span>
            )}
            {idx < normalized.length - 1 && <span> / </span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
