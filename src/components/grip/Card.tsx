'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export type CardVariant = 'glass' | 'solid' | 'blue' | 'gold' | 'hero';
export type CardAccent = 'energy' | 'prestige' | 'blue' | null;
export type CardPadding = 'lg' | 'md' | 'sm' | 'none';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  accent?: CardAccent;
  interactive?: boolean;
  padding?: CardPadding;
}

/** Card — glassmorphism 2.0 surface, the base of every bento tile. */
export function Card({
  children,
  variant = 'glass',
  accent = null,
  interactive = false,
  padding = 'lg',
  style = {},
  className = '',
  ...rest
}: CardProps) {
  mchStyle('mch-card', `
    .mch-card{position:relative;border-radius:var(--radius-lg);border:1px solid var(--glass-border);
      overflow:hidden;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);}
    .mch-card--glass{background:var(--glass-bg);backdrop-filter:blur(var(--blur-glass));-webkit-backdrop-filter:blur(var(--blur-glass));box-shadow:var(--shadow-glass);}
    .mch-card--solid{background:var(--panel-rich);box-shadow:0 1px 0 rgba(255,255,255,.04) inset,var(--shadow-lg);}
    .mch-card--blue{background:var(--panel-blue);border-color:var(--hairline-gold);box-shadow:var(--shadow-lg),var(--glow-blue);}
    .mch-card--gold{background:var(--panel-gold);border-color:var(--hairline-gold);box-shadow:var(--glow-gold-rim);}
    .mch-card--hero{background:var(--glass-bg-strong);backdrop-filter:blur(var(--blur-strong));-webkit-backdrop-filter:blur(var(--blur-strong));box-shadow:var(--shadow-xl);}
    .mch-card--pad-lg{padding:var(--space-6);}
    .mch-card--pad-md{padding:var(--space-5);}
    .mch-card--pad-sm{padding:var(--space-4);}
    .mch-card--pad-none{padding:0;}
    .mch-card--int{cursor:pointer;}
    .mch-card--int:hover{transform:translateY(-3px);border-color:var(--glass-border-bright);box-shadow:var(--shadow-xl);}
    .mch-card--acc-energy{border-color:rgba(244,209,30,.18);}
    .mch-card--acc-prestige{border-color:var(--hairline-gold);}
    .mch-card--acc-blue{border-color:rgba(58,97,166,.4);}
    .mch-card--acc-energy::before,.mch-card--acc-prestige::before,.mch-card--acc-blue::before{
      content:"";position:absolute;top:-30%;right:-10%;width:60%;height:70%;border-radius:50%;pointer-events:none;filter:blur(40px);opacity:.5;}
    .mch-card--acc-energy::before{background:radial-gradient(circle,rgba(244,209,30,.30),transparent 70%);}
    .mch-card--acc-prestige::before{background:radial-gradient(circle,rgba(232,194,74,.34),transparent 70%);}
    .mch-card--acc-blue::before{background:radial-gradient(circle,rgba(58,97,166,.4),transparent 70%);}
    .mch-card>*{position:relative;z-index:1;}
  `);
  const cls = `mch-card mch-card--${variant} mch-card--pad-${padding}` +
    (interactive ? ' mch-card--int' : '') + (accent ? ` mch-card--acc-${accent}` : '') +
    (className ? ' ' + className : '');
  return <div className={cls} style={style} {...rest}>{children}</div>;
}
