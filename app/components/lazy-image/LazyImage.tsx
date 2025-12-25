"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Loader from '../loader/loader';
import useDeferAssets from '../../../lib/useDeferAssets';

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  unoptimized?: boolean;
};

export default function LazyImage({ src, alt = '', width, height, className, placeholder, onLoad, unoptimized }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const deferReady = useDeferAssets();
  const loadNow = deferReady && visible;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
          break;
        }
      }
    }, { rootMargin: '300px', threshold: 0.01 });

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ minHeight: height ? `${height}px` : undefined }}>
      {!loadNow ? (placeholder ?? <Loader />) : (
        <Image src={src} alt={alt} width={width} height={height} onLoad={onLoad} loading="eager" unoptimized={unoptimized} />
      )}
    </div>
  );
}
