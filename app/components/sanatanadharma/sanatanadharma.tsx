/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useRef, useEffect, useState } from 'react';
import { useT } from '../../hooks/useT';

export default function SanatanaDharma() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const t = useT();

  const titleLines: string = t("home.SanatanaDharma.title") as string;
  const definitionLines: string = t("home.SanatanaDharma.Definition") as string;
  const corePrinciplesLines: any = t("home.SanatanaDharma.CorePrinciples") || [];
  const philosophicalThemesLines: any = t("home.SanatanaDharma.PhilosophicalThemes") || [];
  const practicesLines: any = t("home.SanatanaDharma.Practices") || [];
  const valuesLines: any = t("home.SanatanaDharma.Values") || [];
  const ultimateGoalLines: string = t("home.SanatanaDharma.UltimateGoal")

  return (
    <section ref={ref} className="background-alternative">
      <div className="content-wrapper sanatana-dharma">
        <h2 className="text-xl/8! md:text-2xl/10!">{titleLines}</h2>
        <p>{definitionLines}</p>
        <p>
          <strong>Core Principles - </strong>
          {Array.isArray(corePrinciplesLines) && corePrinciplesLines.map((ln: string, idx: number) => (
            <span key={idx}>{ln} </span>))
          }
        </p>
        <p>
          <strong>Philosophical Themes - </strong>
          {Array.isArray(philosophicalThemesLines) && philosophicalThemesLines.map((ln: string, idx: number) => (
            <span key={idx}>{ln} </span>))
          }
        </p>
        <p>
          <strong>Practicles - </strong>
          {Array.isArray(practicesLines) && practicesLines.map((ln: string, idx: number) => (
            <span key={idx}>{ln} </span>))
          }
        </p>
        <p>
          <strong>Values - </strong>
          {Array.isArray(valuesLines) && valuesLines.map((ln: string, idx: number) => (
            <span key={idx}>{ln} </span>))
          }
        </p>
        <p>
          <strong>UltimateGoal - </strong>
          <span>{ultimateGoalLines}</span>
        </p>
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */