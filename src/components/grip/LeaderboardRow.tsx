'use client';
import React from 'react';
import { mchStyle } from './mchStyle';
import { Avatar } from './Avatar';

export interface LeaderboardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  rank?: number;
  name?: string;
  avatar?: string | null;
  meta?: string;
  value?: string | number;
  unit?: string;
  delta?: string | null;
  deltaUp?: boolean;
  you?: boolean;
}

/** LeaderboardRow — clan ranking line: rank, member, km/points, optional delta. */
export function LeaderboardRow({
  rank = 1,
  name = '',
  avatar = null,
  meta = '',
  value = '',
  unit = 'km',
  delta = null,
  deltaUp = true,
  you = false,
  style = {},
  className = '',
  ...rest
}: LeaderboardRowProps) {
  mchStyle('mch-lbrow', `
    .mch-lbrow{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:var(--radius-md);
      border:1px solid transparent;transition:background var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);}
    .mch-lbrow:hover{background:rgba(174,197,229,.05);}
    .mch-lbrow--you{background:rgba(252,229,0,.07);border-color:rgba(252,229,0,.3);}
    .mch-lbrow__rank{font-family:var(--font-display);font-weight:900;font-size:1.0625rem;width:30px;text-align:center;
      font-variant-numeric:tabular-nums;color:var(--text-tertiary);flex:none;}
    .mch-lbrow__rank--1{color:var(--gold-400);}
    .mch-lbrow__rank--2{color:#D4E7FA;}
    .mch-lbrow__rank--3{color:#C9A23A;}
    .mch-lbrow__id{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1;}
    .mch-lbrow__name{font-family:var(--font-body);font-weight:700;font-size:.9375rem;color:var(--text-primary);
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:8px;}
    .mch-lbrow__youtag{font-family:var(--font-body);font-weight:700;font-size:.5625rem;letter-spacing:.1em;text-transform:uppercase;
      color:var(--text-on-accent);background:var(--mch-yellow);padding:2px 6px;border-radius:var(--radius-pill);}
    .mch-lbrow__meta{font-family:var(--font-body);font-size:.75rem;color:var(--text-secondary);}
    .mch-lbrow__val{font-family:var(--font-mono);font-weight:700;font-size:1rem;color:var(--text-primary);
      font-variant-numeric:tabular-nums;text-align:right;flex:none;display:flex;align-items:baseline;gap:4px;}
    .mch-lbrow__val span{font-family:var(--font-body);font-size:.625rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-tertiary);}
    .mch-lbrow__delta{font-family:var(--font-mono);font-size:.6875rem;font-weight:700;width:48px;text-align:right;flex:none;}
    .mch-lbrow__delta--up{color:var(--success-soft);}
    .mch-lbrow__delta--down{color:var(--danger-soft);}
  `);
  const top = rank <= 3 ? ` mch-lbrow__rank--${rank}` : '';
  return (
    <div className={`mch-lbrow${you ? ' mch-lbrow--you' : ''}${className ? ' ' + className : ''}`} style={style} {...rest}>
      <span className={`mch-lbrow__rank${top}`}>{rank}</span>
      <Avatar src={avatar} name={name} size="md" ring={rank === 1 ? 'prestige' : null} />
      <div className="mch-lbrow__id">
        <span className="mch-lbrow__name">{name}{you ? <span className="mch-lbrow__youtag">Vous</span> : null}</span>
        {meta ? <span className="mch-lbrow__meta">{meta}</span> : null}
      </div>
      <span className="mch-lbrow__val">{value}<span>{unit}</span></span>
      {delta != null ? <span className={`mch-lbrow__delta mch-lbrow__delta--${deltaUp ? 'up' : 'down'}`}>{deltaUp ? '▲' : '▼'}{delta}</span> : null}
    </div>
  );
}
