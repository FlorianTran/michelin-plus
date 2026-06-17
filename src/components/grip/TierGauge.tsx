'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface TierGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  current?: string;
  next?: string;
  unit?: string;
  tone?: 'energy' | 'prestige';
}

/** TierGauge — palier progress bar that fills on mount, with tire-tread texture. */
export function TierGauge({
  value = 0,
  max = 100,
  current = 'Titane',
  next = 'Carbone',
  unit = 'pts',
  tone = 'energy',
  style = {},
  className = '',
  ...rest
}: TierGaugeProps) {
  mchStyle('mch-gauge', `
    .mch-gauge{display:flex;flex-direction:column;gap:10px;width:100%;}
    .mch-gauge__head{display:flex;justify-content:space-between;align-items:baseline;font-family:var(--font-body);}
    .mch-gauge__cur{font-weight:700;font-size:.9375rem;color:var(--text-primary);}
    .mch-gauge__next{font-size:.8125rem;color:var(--text-secondary);font-weight:600;}
    .mch-gauge__track{position:relative;height:14px;border-radius:var(--radius-pill);
      background:rgba(174,197,229,.1);border:1px solid var(--border);overflow:hidden;}
    .mch-gauge__fill{position:absolute;inset:0 auto 0 0;height:100%;border-radius:var(--radius-pill);
      width:0;transition:width 1.1s var(--ease-out);background-blend-mode:overlay;}
    .mch-gauge--energy .mch-gauge__fill{background:var(--mch-yellow),var(--tread-energy);background-image:var(--tread-energy),linear-gradient(90deg,var(--yellow-300),var(--mch-yellow));box-shadow:var(--glow-energy-soft);}
    .mch-gauge--prestige .mch-gauge__fill{background-image:var(--tread-prestige),linear-gradient(90deg,var(--gold-400),var(--gold-600));box-shadow:var(--glow-prestige-soft);}
    .mch-gauge__meta{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:.6875rem;color:var(--text-tertiary);font-variant-numeric:tabular-nums;}
    .mch-gauge__rem{color:var(--text-secondary);}
  `);

  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setW(pct); return; }
    const id = setTimeout(() => setW(pct), 120);
    return () => clearTimeout(id);
  }, [pct]);

  const remaining = Math.max(0, max - value);
  return (
    <div className={`mch-gauge mch-gauge--${tone}${className ? ' ' + className : ''}`} style={style} {...rest}>
      <div className="mch-gauge__head">
        <span className="mch-gauge__cur">Palier {current}</span>
        <span className="mch-gauge__next">→ {next}</span>
      </div>
      <div className="mch-gauge__track">
        <div className="mch-gauge__fill" style={{ width: `${w}%` }} />
      </div>
      <div className="mch-gauge__meta">
        <span>{value.toLocaleString('fr-FR')} / {max.toLocaleString('fr-FR')} {unit}</span>
        <span className="mch-gauge__rem">{remaining.toLocaleString('fr-FR')} {unit} restants</span>
      </div>
    </div>
  );
}
