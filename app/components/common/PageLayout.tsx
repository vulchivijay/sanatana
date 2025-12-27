import React from 'react';

import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

type BreadcrumbItem = { label?: string; labelKey?: string; href?: string };

type Props = {
  metaKey?: string;
  title?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  locale?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function PageLayout({ metaKey, title, breadcrumbs, locale, className, children }: Props) {
  const wrapper = className || 'content-wrapper md page-space-xl';
  return (
    <>
      {metaKey ? <StructuredData metaKey={metaKey} /> : null}
      <main className={wrapper}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        {title ? <h2>{title}</h2> : null}
        {children}
      </main>
    </>
  );
}
