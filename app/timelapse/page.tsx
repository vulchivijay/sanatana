/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale } from '../../lib/i18n';
import StructuredData from '@components/structured-data/StructuredData';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

type TimelinePoint = {
  name?: string;
  nature?: string;
  symbolic_origin?: string;
  role?: string;
  time_reference?: string;
  label?: string;
  year?: number;
};


export async function generateMetadata(props: any) {
  const { searchParams } = props || {};
  const locale = await detectLocale(searchParams);
  const meta = getMeta('timelapse', undefined, locale) || {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, images: meta.ogImage ? [meta.ogImage] : undefined },
    alternates: { canonical: meta.canonical || meta.url || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in' }
  };
}
export default function TimelapsePage() {
  // timelinePoints is an object, not array, so convert to array
  const timelineObj = t("timelinePoints");
  const timelinePoints: TimelinePoint[] = timelineObj ? Object.values(timelineObj) : [];
  return (
    <>
      <StructuredData metaKey="timelapse" />
      <Breadcrumbs items={[{ labelKey: 'nav.home', href: '/' }, { label: 'Timelapse' }]} />
      <main>
        <div>
          <div>
            <div>
              <div>
                {timelinePoints.map((point, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <div>
                          <h4><span>Label:</span> {point.label ?? ""}</h4>
                          <p>{point.time_reference ?? ""}</p>
                          <p><span>Name:</span> {point.name ?? ""}</p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <p><span>Nature:</span> {point.nature ?? ""}</p>
                          <p><span>Origin:</span> {point.symbolic_origin ?? ""}</p>
                          <p><span>Role:</span> {point.role ?? ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
