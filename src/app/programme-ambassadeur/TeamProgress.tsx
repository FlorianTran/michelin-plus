'use client';

import React from 'react';

interface TeamProgressProps {
  current: number;
  max: number;
}

const fr = (n: number): string => Math.round(n).toLocaleString('fr-FR').replace(/ |,/g, ' ');

/**
 * TeamProgress — team points count-up + bar fill on viewport entry.
 * easeOutCubic over 1.5s; respects prefers-reduced-motion.
 */
export function TeamProgress({ current, max }: TeamProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [display, setDisplay] = React.useState(0);
  const [filled, setFilled] = React.useState(false);
  const pct = Math.min(100, (current / max) * 100);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(current);
      setFilled(true);
      return;
    }

    let raf = 0;
    let started = false;
    const run = () => {
      const duration = 1500;
      let start: number | undefined;
      const tick = (t: number) => {
        if (start === undefined) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(current * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            setFilled(true);
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [current]);

  return (
    <div className="pa-prog mch-reveal" ref={ref}>
      <h2>Progression de l’équipe</h2>
      <p className="pa-prog__sub">Plus on est nombreux, plus on va loin.</p>
      <div className="pa-prog__nums">
        <span className="pa-prog__cur">{fr(display)}</span>
        <span className="pa-prog__max">/ {fr(max)} points</span>
      </div>
      <div className="pa-prog__bar">
        <div className="pa-prog__fill" style={{ width: filled ? `${pct}%` : '0%' }} />
      </div>
      <div className="pa-prog__scale">
        <span>0</span>
        <span>{fr(max)}</span>
      </div>
    </div>
  );
}
