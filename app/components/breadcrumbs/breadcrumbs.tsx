/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React from 'react';
import Link from 'next/link';
import { t } from '../../../lib/i18n';

type Crumb = { label: React.ReactNode; href?: string };
type CrumbInput = { label?: unknown; labelKey?: string; href?: string };

function normalizeBreadcrumbs(items: CrumbInput[], locale?: string): Crumb[] {
  return items.map((it) => {
    // Resolve label from i18n if labelKey provided, otherwise use provided label.
    let raw: unknown = it.labelKey ? (t(it.labelKey, locale) || it.labelKey) : (it.label ?? '');
    // Ensure label is a renderable ReactNode. Convert plain objects to string
    // to avoid TypeScript/React complaining about '{}' not being a valid node.
    if (raw !== null && typeof raw === 'object') {
      try {
        raw = String(raw);
      } catch (_) {
        raw = '';
      }
    }
    return { label: raw as React.ReactNode, href: it.href };
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
