/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useMemo } from 'react';

type Item = { id: string; label?: string };

function TwoColGrid({ items }: { items: Item[] }) {
  // Render items in rows of two
  const rows = useMemo(() => {
    const r: Item[][] = [];
    for (let i = 0; i < items.length; i += 2) r.push(items.slice(i, i + 2));
    return r;
  }, [items]);

  return (
    <div>
      {rows.map((row, idx) => (
        <div key={idx}>
          {row.map((it) => (
            <div key={it.id}>{it.label ?? it.id}</div>
          ))}
          {row.length === 1 ? <div /> : null}
        </div>
      ))}
    </div>
  );
}

function VerticalList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((it) => (
        <div key={it.id}>{it.label ?? it.id}</div>
      ))}
    </div>
  );
}

export default function SecondFold() {
  const leftSections = useMemo(() => ({
    panchang: Array.from({ length: 4 }, (_, i) => ({ id: `p-${i + 1}`, label: String(i + 1) })),
    scriptures: Array.from({ length: 4 }, (_, i) => ({ id: `s-${i + 1}`, label: String(i + 1) })),
    stotras: Array.from({ length: 8 }, (_, i) => ({ id: `st-${i + 1}`, label: String(i + 1) })),
  }), []);

  const rightSections = useMemo(() => ({
    puranas: Array.from({ length: 8 }, (_, i) => ({ id: `pura-${i + 1}`, label: String(i + 1) })),
    kids: Array.from({ length: 10 }, (_, i) => ({ id: `kids-${i + 1}`, label: String(i + 1) })),
  }), []);

  return (
    <section>
      <div>
        <div>
          <h4>Today's Panchang:</h4>
          <TwoColGrid items={leftSections.panchang} />
          <p>view more...</p>

          <h4>Featured Scriptures:</h4>
          <TwoColGrid items={leftSections.scriptures} />
          <p>view more...</p>

          <h4>Popular Stotras:</h4>
          <VerticalList items={leftSections.stotras} />
          <p>view more...</p>
        </div>

        <div>
          <h4>Stories from Puranas:</h4>
          <TwoColGrid items={rightSections.puranas} />
          <p>view more...</p>

          <h4>Kids illustration stories:</h4>
          <TwoColGrid items={rightSections.kids} />
          <p>view more...</p>
        </div>
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
