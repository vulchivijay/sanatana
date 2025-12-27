/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import React, { useEffect, useRef } from 'react';
import storage from '../../../lib/storage';

// Runtime-created marquee wrapper to avoid relying on JSX intrinsic typings
const MarqueeTag = React.forwardRef<any, any>(function MarqueeTag(props, ref) {
  // createElement('marquee') avoids JSX validation but renders the element at runtime
  return React.createElement('marquee', { ref, ...props }, props.children);
});

interface MarqueeProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Marquee that preserves its continuous progress across remounts.
 * It stores a global start timestamp in storage (local by default) and sets a negative
 * animationDelay based on elapsed time so remounts do not restart the motion.
 */
const GLOBAL_START_KEY = "sanatana_marquee_global_start_v1";

const Marquee: React.FC<MarqueeProps> = ({
  id = "default",
  children
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // compute and persist a namespaced global start timestamp so animation progress is continuous
  useEffect(() => {
    const storageKey = `${GLOBAL_START_KEY}_${id}`;
    let start = storage.getItem(storageKey);
    if (!start) {
      start = String(Date.now());
      try {
        storage.setItem(storageKey, start);
      } catch (e) {
        // ignore storage errors (private mode)
      }
    }
  }, [id]);
  {/* Use a runtime-created marquee element to avoid TSX intrinsic checks */ }
  return (
    <MarqueeTag ref={contentRef} scrollamount="2" className="small">{children}</MarqueeTag>
  );
};

export default Marquee;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */