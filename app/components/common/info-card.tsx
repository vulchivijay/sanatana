/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useT } from '../../hooks/useT';
import { useState } from 'react';

type InfoCardProps = {
  src: string;
  alt: string;
  captionKey: string;
  width?: number;
  height?: number;
};

export default function InfoCard({ src, alt, captionKey, width = 400, height = 300 }: InfoCardProps) {
  const t = useT();
  const [loading, setLoading] = useState(true)

  return (
    <div className="info-card relative  basis-1/5 p-3 mb-6 md:mb-0 border border-gray-500">
      {/* Wrap figure tag inside link next set href to  */}
      <Link href={`/${alt.toLowerCase().trim().replace(" ", "-")}`}>
        <figure>
          {/* Loader */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center /70">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          {/* Image */}
          <Image src={src} alt={alt} width={width} height={height} onLoad={() => setLoading(false)} />
          <figcaption className="text-sm text-center mt-2">{t(captionKey)}</figcaption>
        </figure>
      </Link>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
