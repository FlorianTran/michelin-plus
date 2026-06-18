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
  /** 'tabs' hides the hamburger ≤700px (a BottomTabBar carries nav there); 'drawer' keeps it. */
  mobileNav?: 'drawer' | 'tabs';
}

/** Header — sticky glass app/site header with a mobile hamburger + drawer. */
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
  mobileNav = 'drawer',
  style = {},
  className = '',
  ...rest
}: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  // Lock body scroll while the drawer is open; close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  mchStyle('mch-header', `
    .mch-header{position:sticky;top:0;z-index:var(--z-header);display:flex;align-items:center;gap:24px;
      height:72px;padding:0 clamp(16px,4vw,40px);background:rgba(8,9,15,.45);
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

    /* hamburger — hidden on desktop */
    .mch-header__burger{display:none;align-items:center;justify-content:center;width:42px;height:42px;flex:none;
      border-radius:var(--radius-sm);border:1px solid var(--border);background:rgba(255,255,255,.03);color:#fff;cursor:pointer;}
    .mch-header__burger:hover{border-color:var(--border-bright);}
    .mch-header__burger svg{width:22px;height:22px;}

    /* drawer */
    .mch-drawer{position:fixed;inset:0;z-index:calc(var(--z-header) + 10);display:flex;flex-direction:column;
      background:rgba(6,7,11,.96);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
      animation:mch-drawer-in var(--dur-base) var(--ease-out);}
    @keyframes mch-drawer-in{from{opacity:0;}to{opacity:1;}}
    .mch-drawer__bar{display:flex;align-items:center;justify-content:space-between;height:72px;padding:0 clamp(16px,4vw,40px);border-bottom:1px solid var(--border);}
    .mch-drawer__close{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);
      border:1px solid var(--border);background:rgba(255,255,255,.03);color:#fff;cursor:pointer;}
    .mch-drawer__nav{display:flex;flex-direction:column;gap:2px;padding:clamp(20px,6vw,40px);}
    .mch-drawer__link{font-family:var(--font-display);font-weight:800;font-size:1.5rem;text-transform:uppercase;letter-spacing:-.01em;
      color:var(--text-secondary);padding:16px 4px;border-bottom:1px solid var(--border-soft);}
    .mch-drawer__link--active{color:#fff;}
    .mch-drawer--energy .mch-drawer__link--active{color:var(--mch-yellow);}
    .mch-drawer--prestige .mch-drawer__link--active{color:var(--gold-400);}
    .mch-drawer__foot{margin-top:auto;padding:clamp(20px,6vw,40px);display:flex;align-items:center;gap:14px;border-top:1px solid var(--border);}

    @media(max-width:960px){
      .mch-header__nav{display:none;}
      .mch-header__lang{display:none;}
      .mch-header__burger{display:inline-flex;}
      .mch-header__right .mch-btn{display:none;}
    }
    @media(min-width:961px){.mch-drawer{display:none;}}

    /* mobileNav="tabs": ≤700px the BottomTabBar replaces the drawer, so drop the burger. */
    @media(max-width:700px){.mch-header--tabs .mch-header__burger{display:none;}}
  `);

  const wordmark = logoSrc
    ? <img src={logoSrc} alt="Michelin+" />
    : <span className="mch-header__wordmark">Michelin<b>+</b></span>;

  return (
    <>
      <header className={`mch-header mch-header--${accent}${mobileNav === 'tabs' ? ' mch-header--tabs' : ''}${className ? ' ' + className : ''}`} style={style} {...rest}>
        <a className="mch-header__logo" href="/">{wordmark}</a>
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
          {links.length > 0 ? (
            <button className="mch-header__burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          ) : null}
        </div>
      </header>

      {open ? (
        <div className={`mch-drawer mch-drawer--${accent}`} role="dialog" aria-modal="true">
          <div className="mch-drawer__bar">
            <a className="mch-header__logo" href="/" onClick={() => setOpen(false)}>{wordmark}</a>
            <button className="mch-drawer__close" aria-label="Fermer le menu" onClick={() => setOpen(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="mch-drawer__nav">
            {links.map((l, i) => (
              <a key={i} href={l.href || '#'} className={`mch-drawer__link${l.active ? ' mch-drawer__link--active' : ''}`} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
          </nav>
          <div className="mch-drawer__foot">
            {authed ? (
              <>
                {points != null ? <span className="mch-header__pts">{Number(points).toLocaleString('fr-FR')}<small>pts</small></span> : null}
                {avatar}
              </>
            ) : (
              <Button variant={accent} size="md" onClick={() => { setOpen(false); onCta?.(); }}>{ctaLabel}</Button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
