/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, getMeta, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';

type TimelinePoint = {
  name?: string;
  nature?: string;
  symbolic_origin?: string;
  role?: string;
  time_reference?: string;
  label?: string;
  year?: number;
};


export const generateMetadata = createGenerateMetadata('timelapse');
export default function TimelapsePage() {
  // timelinePoints is an object, not array, so convert to array
  const timelineObj = t("timelinePoints");
  const timelinePoints: TimelinePoint[] = timelineObj ? Object.values(timelineObj) : [];
  return (
    <PageLayout metaKey="timelapse" title={'Timelapse'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Timelapse' }]}>
      <div>
        {timelinePoints.map((point, index) => (
          <div key={index}>
            <div>
              <div>
                <h4><span>Label:</span> {point.label ?? ''}</h4>
                <p>{point.time_reference ?? ''}</p>
                <p><span>Name:</span> {point.name ?? ''}</p>
              </div>
              <div>
                <p><span>Nature:</span> {point.nature ?? ''}</p>
                <p><span>Origin:</span> {point.symbolic_origin ?? ''}</p>
                <p><span>Role:</span> {point.role ?? ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
