'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export type ButtonVariant = 'energy' | 'prestige' | 'blue' | 'ghost' | 'outline';
export type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button — primary action control for Michelin+ Grip.
 * Variants: energy (jaune CTA), prestige (or, rare), blue (groupe), ghost, outline.
 */
export function Button({
  children,
  variant = 'energy',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  full = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  className = '',
  ...rest
}: ButtonProps) {
  mchStyle('mch-button', `
    .mch-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;
      gap:9px;font-family:var(--font-body);font-weight:700;white-space:nowrap;cursor:pointer;
      border:1px solid transparent;border-radius:var(--radius-pill);text-decoration:none;
      transition:transform var(--dur-fast) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),
      background var(--dur-base) var(--ease-out),filter var(--dur-base) var(--ease-out);
      -webkit-tap-highlight-color:transparent;}
    .mch-btn:active{transform:translateY(1px) scale(0.99);}
    .mch-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;filter:grayscale(.3);}
    .mch-btn--lg{height:var(--control-h-lg);padding:0 28px;font-size:1rem;}
    .mch-btn--md{height:var(--control-h);padding:0 22px;font-size:.9375rem;}
    .mch-btn--sm{height:var(--control-h-sm);padding:0 16px;font-size:.8125rem;}
    .mch-btn--full{width:100%;}
    .mch-btn--energy{background:var(--btn-gold);color:#1A1405;box-shadow:none;}
    .mch-btn--energy:hover:not(:disabled){background:var(--btn-gold-hover);}
    .mch-btn--prestige{background:var(--gloss-prestige);color:var(--text-on-accent);box-shadow:var(--gloss-shadow-prestige);}
    .mch-btn--prestige:hover:not(:disabled){filter:brightness(1.04);box-shadow:var(--gloss-shadow-prestige),var(--glow-prestige);}
    .mch-btn--blue{background:var(--gloss-blue);color:#fff;box-shadow:var(--gloss-shadow-blue);}
    .mch-btn--blue:hover:not(:disabled){filter:brightness(1.06);box-shadow:var(--gloss-shadow-blue),var(--glow-blue);}
    .mch-btn--ghost{background:rgba(174,197,229,.06);color:var(--text-primary);border-color:transparent;}
    .mch-btn--ghost:hover:not(:disabled){background:rgba(174,197,229,.12);}
    .mch-btn--outline{background:transparent;color:var(--text-primary);border-color:var(--border-bright);}
    .mch-btn--outline:hover:not(:disabled){border-color:var(--mch-yellow);color:var(--mch-yellow);}
    .mch-btn__ic{display:inline-flex;align-items:center;}
  `);

  const cls = `mch-btn mch-btn--${size} mch-btn--${variant}${full ? ' mch-btn--full' : ''}${className ? ' ' + className : ''}`;
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} style={style} {...rest}>
      {iconLeft ? <span className="mch-btn__ic">{iconLeft}</span> : null}
      {children}
      {iconRight ? <span className="mch-btn__ic">{iconRight}</span> : null}
    </button>
  );
}
