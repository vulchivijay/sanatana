
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

type Props = {
  className?: string;
  stroke?: string;
  fill?: string;
  fillOpacity?: number;
  borderWidth?: number;
  /** seconds for one draw cycle (slower = more relaxed) */
  loopSpeed?: number;
  /** ms gap between country starts (staggered rhythm) */
  stagger?: number;
  /** enable a gentle fill opacity pulse while looping */
  fillPulse?: boolean;
  /** pause when pointer is over the map */
  pauseOnHover?: boolean;
  /** projection scale; default fits 1200x600 viewBox nicely */
  scale?: number;
  /** show latitude/longitude lines */
  showGraticule?: boolean;
  /** optional data URL (110m = small, 50m = smoother coastlines but larger) */
  dataUrl?: string;
  /** sea color behind the land features */
  sea?: string;
};

const DEFAULTS = {
  stroke: '#5f6b7a',
  fill: '#e6eef7',
  fillOpacity: 0.30,
  borderWidth: 0.6,
  loopSpeed: 5, // seconds per draw
  stagger: 18, // ms between paths
  fillPulse: true,
  pauseOnHover: true,
  scale: 0.19,
  showGraticule: false,
  dataUrl: '/countries.json',
  sea: '#0ea5e9',
};

export default function WorldMapLoop({
  className,
  stroke = DEFAULTS.stroke,
  fill = DEFAULTS.fill,
  fillOpacity = DEFAULTS.fillOpacity,
  borderWidth = DEFAULTS.borderWidth,
  loopSpeed = DEFAULTS.loopSpeed,
  stagger = DEFAULTS.stagger,
  fillPulse = DEFAULTS.fillPulse,
  pauseOnHover = DEFAULTS.pauseOnHover,
  scale = DEFAULTS.scale,
  showGraticule = DEFAULTS.showGraticule,
  dataUrl = DEFAULTS.dataUrl,
  sea = DEFAULTS.sea,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let aborted = false;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = 1200, height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // reset before drawing

    const projection = d3.geoNaturalEarth1()
      .translate([width / 2, height / 2])
      .scale(width * scale);

    const path = d3.geoPath(projection);

    async function draw() {
      try {
        const topo = await (await fetch(dataUrl)).json();
        if (aborted) return;

        const countries = feature(topo, topo.objects.countries) as any;

        // Optional graticule
        if (showGraticule) {
          const graticule = d3.geoGraticule();
          svg.append('path')
            .attr('class', 'graticule')
            .attr('d', path(graticule()))
            .attr('opacity', 0.22);
        }

        // Country paths
        const paths = svg.append('g').attr('class', 'countries')
          .selectAll('path')
          .data(countries.features)
          .join('path')
          .attr('class', 'land')
          .attr('d', (d: any) => path(d) || '')
          .attr('fill', fill)
          .attr('fill-opacity', fillOpacity) // base opacity (we’ll pulse if enabled)
          .attr('stroke', stroke)
          .attr('stroke-width', borderWidth)
          .attr('vector-effect', 'non-scaling-stroke');

        // If user asks to reduce motion, do not animate
        if (!prefersReduced) {
            // Animate stroke draw in a continuous loop
            // Use nodes() + forEach to avoid `this` usage inside d3.each
            const nodeElems = paths.nodes() as SVGPathElement[];
            nodeElems.forEach((el, i) => {
              const length = el.getTotalLength();

              // Prepare dash
              el.style.strokeDasharray = `${length}`;
              el.style.strokeDashoffset = `${length}`;

              // Looping line draw (draw -> erase -> draw ...)
              const drawAnim = el.animate(
                [
                  { strokeDashoffset: length },
                  { strokeDashoffset: 0 },
                ],
                {
                  duration: loopSpeed * 1000,
                  iterations: Infinity,
                  direction: 'alternate',        // draw then reverse
                  easing: 'ease-in-out',
                  delay: i * stagger,
                }
              );

              // Gentle fill pulse (optional)
              if (fillPulse) {
                el.animate(
                  [
                    { fillOpacity: fillOpacity * 0.85 },
                    { fillOpacity: fillOpacity * 1.15 },
                  ] as any,
                  {
                    duration: Math.max(2000, loopSpeed * 1000 * 0.8),
                    iterations: Infinity,
                    direction: 'alternate',
                    easing: 'ease-in-out',
                    delay: i * stagger + 250,
                  }
                );
              }

              // Hover accent (temporary bump)
              el.addEventListener('mouseenter', () => {
                el.animate(
                  [
                    { strokeWidth: borderWidth, fillOpacity },
                    { strokeWidth: borderWidth + 0.4, fillOpacity: Math.min(1, fillOpacity + 0.2) },
                  ] as any,
                  { duration: 180, fill: 'forwards', easing: 'ease-out' }
                );
              });
              el.addEventListener('mouseleave', () => {
                el.animate(
                  [
                    { strokeWidth: borderWidth + 0.4, fillOpacity: Math.min(1, fillOpacity + 0.2) },
                    { strokeWidth: borderWidth, fillOpacity },
                  ] as any,
                  { duration: 200, fill: 'forwards', easing: 'ease-out' }
                );
              });
            });

          // Pause on hover over the whole map (optional)
          if (pauseOnHover && wrapRef.current) {
            wrapRef.current.addEventListener('mouseenter', () => {
              svgRef.current?.getAnimations().forEach(a => a.pause());
            });
            wrapRef.current.addEventListener('mouseleave', () => {
              svgRef.current?.getAnimations().forEach(a => a.play());
            });
          }

          // Start/stop when visible (IntersectionObserver)
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
              const anims = svgRef.current?.getAnimations() || [];
              if (e.isIntersecting) anims.forEach(a => a.play());
              else anims.forEach(a => a.pause());
            });
          }, { threshold: 0.2 });

          if (wrapRef.current) io.observe(wrapRef.current);
        }

        // Keep aspect
        svg.attr('preserveAspectRatio', 'xMidYMid meet');
      } catch (err) {
        console.error('World map load failed:', err);
        svg.append('text')
          .attr('x', width / 2).attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('fill', stroke)
          .text('World map could not be loaded');
      }
    }

    draw();
    return () => { aborted = true; };
  }, [stroke, fill, fillOpacity, borderWidth, loopSpeed, stagger, fillPulse, pauseOnHover, scale, showGraticule, dataUrl]);

  return (
    <div ref={wrapRef} aria-label="Animated world map (looping)">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        role="img"
        aria-label="World map"
      >
        <defs>
          <style>{`
            .land {
              transition: fill-opacity 200ms ease, stroke-width 150ms ease, transform 150ms ease;
              cursor: pointer;
            }
            .land:hover {
              transform: translateY(-2px);
            }
            .graticule {
              fill: none;
              stroke: ${stroke};
              stroke-width: 0.6;
              vector-effect: non-scaling-stroke;
              opacity: 0.25;
            }
          `}</style>
        </defs>
      </svg>
    </div>
  );
}