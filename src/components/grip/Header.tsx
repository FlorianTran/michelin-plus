'use client';
import React from 'react';
import { mchStyle } from './mchStyle';
import { Button } from './Button';

export interface HeaderLink {
  label: string;
  href?: string;
  active?: boolean;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logoSrc?: string | null;
  links?: HeaderLink[];
  authed?: boolean;
  points?: number | null;
  avatar?: React.ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
  lang?: string;
  accent?: 'energy' | 'prestige';
}

/** Header — sticky glass app/site header. */
export function Header({
  logoSrc = null,
  links = [],
  authed = false,
  points = null,
  avatar = null,
  ctaLabel = 'Rejoindre',
  onCta,
  lang = 'FR',
  accent = 'energy',
  style = {},
  className = '',
  ...rest
}: HeaderProps) {
  mchStyle('mch-header', `
    .mch-header{position:sticky;top:0;z-index:var(--z-header);display:flex;align-items:center;gap:24px;
      height:72px;padding:0 clamp(16px,4vw,40px);background:rgba(8,9,15,.72);
      backdrop-filter:blur(var(--blur-glass));-webkit-backdrop-filter:blur(var(--blur-glass));
      border-bottom:1px solid var(--border);}
    .mch-header__logo{display:flex;align-items:center;flex:none;}
    .mch-header__logo img{height:30px;width:auto;}
    .mch-header__wordmark{font-family:var(--font-wordmark);font-style:italic;font-weight:800;font-size:1.5rem;letter-spacing:-.01em;
      text-transform:uppercase;color:#fff;}
    .mch-header__wordmark b{font-weight:900;background:var(--gold-grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
    .mch-header__nav{display:flex;align-items:center;gap:4px;margin-left:8px;}
    .mch-header__link{font-family:var(--font-body);font-weight:600;font-size:.875rem;color:var(--text-secondary);
      padding:8px 14px;border-radius:var(--radius-pill);transition:color var(--dur-fast) var(--ease-out),background var(--dur-fast) var(--ease-out);}
    .mch-header__link:hover{color:#fff;background:rgba(174,197,229,.07);}
    .mch-header__link--active{color:#fff;}
    .mch-header__link--active.mch-header--energy{color:var(--mch-yellow);}
    .mch-header__spacer{flex:1;}
    .mch-header__right{display:flex;align-items:center;gap:14px;flex:none;}
    .mch-header__lang{font-family:var(--font-mono);font-weight:700;font-size:.75rem;color:var(--text-secondary);
      padding:6px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);cursor:pointer;}
    .mch-header__lang:hover{color:#fff;border-color:var(--border-bright);}
    .mch-header__pts{display:inline-flex;align-items:baseline;gap:5px;font-family:var(--font-mono);font-weight:700;
      font-size:.9375rem;color:var(--text-on-accent);padding:8px 15px;border-radius:var(--radius-pill);
      background:var(--gloss-energy);box-shadow:var(--gloss-shadow-energy);}
    .mch-header--prestige .mch-header__pts{background:var(--gloss-prestige);box-shadow:var(--gloss-shadow-prestige);}
    .mch-header__pts small{font-family:var(--font-body);font-size:.5625rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(10,10,12,.65);}
    @media(max-width:960px){.mch-header__nav{display:none;}}
  `);
  return (
    <header className={`mch-header mch-header--${accent}${className ? ' ' + className : ''}`} style={style} {...rest}>
      <a className="mch-header__logo" href="/">
        {logoSrc ? <img src={logoSrc} alt="Michelin+" /> : <span className="mch-header__wordmark">Michelin<b>+</b></span>}
      </a>
      <nav className="mch-header__nav">
        {links.map((l, i) => (
          <a key={i} href={l.href || '#'} className={`mch-header__link${l.active ? ' mch-header__link--active mch-header--' + accent : ''}`}>{l.label}</a>
        ))}
      </nav>
      <span className="mch-header__spacer" />
      <div className="mch-header__right">
        <span className="mch-header__lang">{lang}</span>
        {authed ? (
          <>
            {points != null ? <span className="mch-header__pts">{Number(points).toLocaleString('fr-FR')}<small>pts</small></span> : null}
            {avatar}
          </>
        ) : (
          <Button variant={accent} size="sm" onClick={onCta}>{ctaLabel}</Button>
        )}
      </div>
    </header>
  );
}
