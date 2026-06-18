'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export type BadgeTone =
  | 'energy' | 'prestige' | 'blue' | 'neutral' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  size?: 'md' | 'sm';
}

/** Badge — compact status/tier label. Use prestige for gold tiers / editions. */
export function Badge({ children, tone = 'neutral', dot = false, size = 'md', style = {}, className = '', ...rest }: BadgeProps) {
  mchStyle('mch-badge', `
    .mch-badge{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-body);
      font-weight:700;letter-spacing:.04em;text-transform:uppercase;border-radius:var(--radius-pill);
      white-space:nowrap;line-height:1;
      /* never stretch to fill a flex/grid parent — a tag hugs its text
         (fit-content disables cross-axis stretch without changing alignment) */
      width:fit-content;max-width:100%;}
    .mch-badge--md{font-size:.6875rem;padding:5px 11px;}
    .mch-badge--sm{font-size:.625rem;padding:3px 9px;}
    .mch-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;}
    .mch-badge--energy{background:rgba(252,229,0,.14);color:var(--mch-yellow);}
    .mch-badge--prestige{background:rgba(232,194,74,.16);color:var(--gold-400);}
    .mch-badge--blue{background:rgba(39,80,155,.22);color:var(--blue-200);}
    .mch-badge--neutral{background:rgba(255,255,255,.06);color:var(--text-secondary);}
    .mch-badge--success{background:rgba(46,125,50,.2);color:var(--success-soft);}
    .mch-badge--warning{background:rgba(249,168,37,.18);color:var(--warning-soft);}
    .mch-badge--danger{background:rgba(183,28,28,.2);color:var(--danger-soft);}
  `);
  return (
    <span className={`mch-badge mch-badge--${size} mch-badge--${tone}${className ? ' ' + className : ''}`} style={style} {...rest}>
      {dot ? <span className="mch-badge__dot" /> : null}
      {children}
    </span>
  );
}
