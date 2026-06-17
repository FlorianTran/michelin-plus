'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value?: React.ReactNode;
  unit?: string;
  delta?: string | null;
  deltaUp?: boolean;
  icon?: React.ReactNode;
  tone?: 'energy' | 'prestige' | 'blue' | 'neutral';
}

/** StatTile — bento KPI tile: label, big value, optional delta + icon. */
export function StatTile({
  label = '',
  value = '',
  unit = '',
  delta = null,
  deltaUp = true,
  icon = null,
  tone = 'neutral',
  style = {},
  className = '',
  ...rest
}: StatTileProps) {
  mchStyle('mch-stattile', `
    .mch-stat{display:flex;flex-direction:column;gap:12px;height:100%;}
    .mch-stat__top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
    .mch-stat__label{font-family:var(--font-body);font-weight:700;font-size:.6875rem;letter-spacing:.14em;
      text-transform:uppercase;color:var(--text-tertiary);}
    .mch-stat__ic{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;
      border-radius:10px;background:rgba(174,197,229,.08);border:1px solid var(--border);}
    .mch-stat__ic--energy{color:var(--mch-yellow);background:rgba(252,229,0,.1);border-color:rgba(252,229,0,.3);}
    .mch-stat__ic--prestige{color:var(--gold-400);background:rgba(232,194,74,.1);border-color:rgba(232,194,74,.32);}
    .mch-stat__ic--blue{color:var(--blue-200);}
    .mch-stat__ic--neutral{color:var(--text-secondary);}
    .mch-stat__val{font-family:var(--font-display);font-weight:900;line-height:1;letter-spacing:-.02em;
      font-size:clamp(1.9rem,3.2vw,2.6rem);color:var(--text-primary);font-variant-numeric:tabular-nums;
      display:flex;align-items:baseline;gap:.25em;}
    .mch-stat__val--energy{color:var(--mch-yellow);}
    .mch-stat__val--prestige{color:var(--gold-400);}
    .mch-stat__unit{font-family:var(--font-body);font-weight:700;font-size:.4em;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em;}
    .mch-stat__delta{font-family:var(--font-mono);font-size:.75rem;font-weight:700;display:inline-flex;align-items:center;gap:4px;}
    .mch-stat__delta--up{color:var(--success-soft);}
    .mch-stat__delta--down{color:var(--danger-soft);}
  `);
  return (
    <div className={`mch-stat${className ? ' ' + className : ''}`} style={style} {...rest}>
      <div className="mch-stat__top">
        <span className="mch-stat__label">{label}</span>
        {icon ? <span className={`mch-stat__ic mch-stat__ic--${tone}`}>{icon}</span> : null}
      </div>
      <div className={`mch-stat__val mch-stat__val--${tone}`}>
        {value}{unit ? <span className="mch-stat__unit">{unit}</span> : null}
      </div>
      {delta != null ? (
        <span className={`mch-stat__delta mch-stat__delta--${deltaUp ? 'up' : 'down'}`}>
          {deltaUp ? '▲' : '▼'} {delta}
        </span>
      ) : null}
    </div>
  );
}
