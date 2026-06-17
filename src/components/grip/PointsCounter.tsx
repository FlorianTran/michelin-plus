'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface PointsCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  duration?: number;
  suffix?: string;
  tone?: 'energy' | 'prestige' | 'white';
  size?: 'sm' | 'md' | 'lg';
  prefix?: string;
}

/** PointsCounter — kinetic number that counts up to `value` on mount/change. */
export function PointsCounter({
  value = 0,
  duration = 1400,
  suffix = 'pts',
  tone = 'energy',
  size = 'lg',
  prefix = '',
  style = {},
  className = '',
  ...rest
}: PointsCounterProps) {
  mchStyle('mch-counter', `
    .mch-counter{font-family:var(--font-display);font-weight:900;line-height:1;letter-spacing:-.02em;
      font-variant-numeric:tabular-nums;display:inline-flex;align-items:baseline;gap:.3em;}
    .mch-counter--energy{color:var(--mch-yellow);}
    .mch-counter--prestige{background:linear-gradient(135deg,var(--gold-300),var(--gold-500));-webkit-background-clip:text;background-clip:text;color:transparent;}
    .mch-counter--white{color:var(--text-primary);}
    .mch-counter--sm{font-size:1.75rem;}
    .mch-counter--md{font-size:2.75rem;}
    .mch-counter--lg{font-size:clamp(2.75rem,6vw,4rem);}
    .mch-counter__suffix{font-family:var(--font-body);font-weight:700;font-size:.32em;
      letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary);align-self:flex-end;margin-bottom:.55em;}
  `);

  const [display, setDisplay] = React.useState(0);
  const fromRef = React.useRef(0);
  React.useEffect(() => {
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const to = Number(value) || 0;
    const from = fromRef.current;
    if (reduce) { setDisplay(to); fromRef.current = to; return; }
    let raf = 0;
    let start: number | undefined;
    const tick = (t: number) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  const formatted = display.toLocaleString('fr-FR');
  return (
    <span className={`mch-counter mch-counter--${tone} mch-counter--${size}${className ? ' ' + className : ''}`} style={style} {...rest}>
      {prefix}{formatted}
      {suffix ? <span className="mch-counter__suffix">{suffix}</span> : null}
    </span>
  );
}
