'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  tone?: 'energy' | 'prestige' | 'success' | 'info';
  icon?: React.ReactNode;
  points?: string | null;
  onClose?: () => void;
}

/** Toast — points-gain / status notification. Caller controls mount/visibility. */
export function Toast({
  title = '',
  message = '',
  tone = 'energy',
  icon = null,
  points = null,
  onClose,
  style = {},
  className = '',
  ...rest
}: ToastProps) {
  mchStyle('mch-toast', `
    .mch-toast{display:flex;align-items:center;gap:14px;min-width:280px;max-width:380px;
      padding:14px 16px;border-radius:var(--radius-md);background:var(--glass-bg-strong);
      backdrop-filter:blur(var(--blur-glass));-webkit-backdrop-filter:blur(var(--blur-glass));
      border:1px solid var(--glass-border-bright);box-shadow:var(--shadow-lg);}
    .mch-toast__ic{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;
      border-radius:11px;flex:none;}
    .mch-toast--energy .mch-toast__ic{background:rgba(252,229,0,.14);color:var(--mch-yellow);border:1px solid rgba(252,229,0,.4);}
    .mch-toast--prestige .mch-toast__ic{background:rgba(232,194,74,.14);color:var(--gold-400);border:1px solid rgba(232,194,74,.42);}
    .mch-toast--success .mch-toast__ic{background:rgba(46,125,50,.16);color:var(--success-soft);border:1px solid rgba(46,125,50,.5);}
    .mch-toast--info .mch-toast__ic{background:rgba(39,80,155,.18);color:var(--blue-200);border:1px solid rgba(58,97,166,.5);}
    .mch-toast__body{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1;}
    .mch-toast__title{font-family:var(--font-body);font-weight:700;font-size:.875rem;color:var(--text-primary);}
    .mch-toast__msg{font-family:var(--font-body);font-size:.8125rem;color:var(--text-secondary);}
    .mch-toast__pts{font-family:var(--font-mono);font-weight:700;font-size:1rem;font-variant-numeric:tabular-nums;flex:none;}
    .mch-toast--energy .mch-toast__pts{color:var(--mch-yellow);}
    .mch-toast--prestige .mch-toast__pts{color:var(--gold-400);}
    .mch-toast__x{background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:18px;line-height:1;padding:4px;border-radius:6px;}
    .mch-toast__x:hover{color:var(--text-primary);background:rgba(174,197,229,.08);}
  `);
  return (
    <div className={`mch-toast mch-toast--${tone}${className ? ' ' + className : ''}`} style={style} role="status" {...rest}>
      {icon ? <span className="mch-toast__ic">{icon}</span> : null}
      <div className="mch-toast__body">
        <span className="mch-toast__title">{title}</span>
        {message ? <span className="mch-toast__msg">{message}</span> : null}
      </div>
      {points != null ? <span className="mch-toast__pts">{points}</span> : null}
      {onClose ? <button className="mch-toast__x" onClick={onClose} aria-label="Fermer">×</button> : null}
    </div>
  );
}
