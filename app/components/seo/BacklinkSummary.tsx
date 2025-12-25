import React from 'react';

type Metrics = {
  referringDomains?: number;
  newBacklinks30d?: number;
  domainAuthorityAvg?: number;
  topAnchors?: string[];
};

export default function BacklinkSummary({
  level = 'Weak',
  metrics = {}
}: {
  level?: 'Weak' | 'Moderate' | 'Strong';
  metrics?: Metrics;
  className?: string;
}) {
  return (
    <main>
      <h3>Backlink Summary</h3>
      <p>Backlink activity: <strong>{level}</strong></p>

      <ul role="list" className="list-disc">
        {metrics.referringDomains !== undefined && (
          <li>Referring domains: {metrics.referringDomains}</li>
        )}
        {metrics.newBacklinks30d !== undefined && (
          <li>New backlinks (30d): {metrics.newBacklinks30d}</li>
        )}
        {metrics.domainAuthorityAvg !== undefined && (
          <li>Avg. domain authority: {metrics.domainAuthorityAvg}</li>
        )}
        {metrics.topAnchors && metrics.topAnchors.length > 0 && (
          <li>Top anchors: {metrics.topAnchors.slice(0, 3).join(', ')}</li>
        )}
      </ul>

      <div>
        <strong>Advice:</strong>
        <ol role="list" className="list-disc">
          <li>Outreach to high-quality partner sites and relevant blogs.</li>
          <li>Create linkable assets (guides, data, infographics).</li>
          <li>Monitor referring domains and diversify anchor text.</li>
        </ol>
      </div>
    </main>
  );
}
