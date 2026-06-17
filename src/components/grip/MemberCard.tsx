'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface MemberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  tier?: string;
  memberId?: string;
  points?: number;
  variant?: 'prestige' | 'energy';
  since?: string;
}

/** MemberCard — digital loyalty card (carte de fidélité). Tread motif, tier, points. */
export function MemberCard({
  name = 'Léa Moreau',
  tier = 'Or',
  memberId = 'M+ 0042 1180',
  points = 12480,
  variant = 'prestige',
  since = '2024',
  style = {},
  className = '',
  ...rest
}: MemberCardProps) {
  mchStyle('mch-membercard', `
    .mch-mcard{position:relative;aspect-ratio:1.586/1;width:100%;border-radius:var(--radius-2xl);overflow:hidden;
      padding:26px;display:flex;flex-direction:column;justify-content:space-between;color:#fff;
      box-shadow:var(--shadow-xl);border:1px solid var(--glass-border-bright);isolation:isolate;}
    .mch-mcard--prestige{background:linear-gradient(135deg,#11152A 0%,#0A1A3F 55%,#000C34 100%);}
    .mch-mcard--energy{background:linear-gradient(135deg,#0E1120 0%,#00205B 60%,#08090F 100%);}
    .mch-mcard::before{content:"";position:absolute;inset:0;z-index:-1;opacity:.5;
      background:radial-gradient(60% 80% at 85% 10%,rgba(232,194,74,.4),transparent 55%),
                 radial-gradient(70% 90% at 10% 110%,rgba(39,80,155,.5),transparent 60%);}
    .mch-mcard__tread{position:absolute;inset:auto 0 0 0;height:46px;z-index:-1;opacity:.5;
      -webkit-mask:linear-gradient(180deg,transparent,#000);mask:linear-gradient(180deg,transparent,#000);}
    .mch-mcard--prestige .mch-mcard__tread{background-image:var(--tread-prestige);}
    .mch-mcard--energy .mch-mcard__tread{background-image:var(--tread-energy);}
    .mch-mcard__top{display:flex;align-items:flex-start;justify-content:space-between;}
    .mch-mcard__brand{font-family:var(--font-wordmark);font-style:italic;font-weight:800;font-size:1.4rem;letter-spacing:-.01em;text-transform:uppercase;}
    .mch-mcard__brand b{font-weight:900;background:var(--gold-grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
    .mch-mcard__tier{font-family:var(--font-body);font-weight:700;font-size:.625rem;letter-spacing:.16em;
      text-transform:uppercase;padding:6px 11px;border-radius:var(--radius-pill);}
    .mch-mcard--prestige .mch-mcard__tier{color:var(--gold-300);border:1px solid rgba(232,194,74,.5);background:rgba(232,194,74,.1);}
    .mch-mcard--energy .mch-mcard__tier{color:var(--mch-yellow);border:1px solid rgba(252,229,0,.5);background:rgba(252,229,0,.1);}
    .mch-mcard__name{font-family:var(--font-display);font-weight:900;text-transform:uppercase;letter-spacing:-.01em;
      font-size:clamp(1.4rem,3vw,1.9rem);line-height:1;}
    .mch-mcard__row{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;}
    .mch-mcard__id{font-family:var(--font-mono);font-size:.8125rem;letter-spacing:.12em;color:var(--blue-200);}
    .mch-mcard__since{font-family:var(--font-body);font-size:.625rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text-tertiary);margin-top:4px;}
    .mch-mcard__pts{text-align:right;}
    .mch-mcard__pts b{font-family:var(--font-display);font-weight:900;font-size:1.6rem;font-variant-numeric:tabular-nums;display:block;line-height:1;}
    .mch-mcard--prestige .mch-mcard__pts b{color:var(--gold-300);}
    .mch-mcard--energy .mch-mcard__pts b{color:var(--mch-yellow);}
    .mch-mcard__pts span{font-family:var(--font-body);font-size:.5625rem;text-transform:uppercase;letter-spacing:.12em;color:var(--text-secondary);}
  `);
  return (
    <div className={`mch-mcard mch-mcard--${variant}${className ? ' ' + className : ''}`} style={style} {...rest}>
      <div className="mch-mcard__tread" />
      <div className="mch-mcard__top">
        <span className="mch-mcard__brand">MICHELIN<b>+</b></span>
        <span className="mch-mcard__tier">Palier {tier}</span>
      </div>
      <div className="mch-mcard__name">{name}</div>
      <div className="mch-mcard__row">
        <div>
          <div className="mch-mcard__id">{memberId}</div>
          <div className="mch-mcard__since">Membre depuis {since}</div>
        </div>
        <div className="mch-mcard__pts">
          <b>{points.toLocaleString('fr-FR')}</b>
          <span>points</span>
        </div>
      </div>
    </div>
  );
}
