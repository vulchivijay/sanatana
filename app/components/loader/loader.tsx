/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        className="w-20 h-20 text-yellow-400 animate-spin"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="30" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" strokeDasharray="5 10" />

        {/* Chakra spokes */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x1 = 50 + Math.cos(angle) * 10;
          const y1 = 50 + Math.sin(angle) * 10;
          const x2 = 50 + Math.cos(angle) * 30;
          const y2 = 50 + Math.sin(angle) * 30;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#g)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}

        {/* Inner hub */}
        <circle cx="50" cy="50" r="6" fill="#F97316" />
      </svg>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
