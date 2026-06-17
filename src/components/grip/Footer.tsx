'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface FooterColumn {
  title: string;
  links: { label: string; href?: string }[];
}

export interface FooterLegalLink {
  label: string;
  href?: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  columns?: FooterColumn[];
  legal?: FooterLegalLink[];
  tagline?: string;
  disclaimer?: string;
}

const DEFAULT_LEGAL: FooterLegalLink[] = [
  { label: 'Mentions légales', href: '/confidentialite' },
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Cookies', href: '/confidentialite#cookies' },
  { label: 'Accessibilité', href: '/confidentialite' },
];

/** Footer — charte-required: wordmark + tagline, sitemap columns, legal links, demo disclaimer. */
export function Footer({
  columns = [],
  legal = DEFAULT_LEGAL,
  tagline = 'Le programme qui transforme chaque achat — en appartenance.',
  disclaimer = 'Noms, images et logos présentés sont des exemples fictifs à but de démonstration.',
  style = {},
  className = '',
  ...rest
}: FooterProps) {
  mchStyle('mch-footer', `
    .mch-footer{position:relative;background:var(--ink-1000);border-top:1px solid var(--border);
      padding:clamp(40px,6vw,72px) clamp(16px,4vw,40px) 28px;}
    .mch-footer__tread{position:absolute;top:0;left:0;right:0;height:6px;background-image:var(--tread-energy);opacity:.6;}
    .mch-footer__grid{max-width:var(--container-max);margin:0 auto;display:grid;
      grid-template-columns:minmax(220px,1.5fr) repeat(3,minmax(0,1fr));gap:40px;align-items:start;}
    .mch-footer__brand{display:flex;flex-direction:column;gap:14px;}
    .mch-footer__hello{display:flex;align-items:center;gap:10px;}
    .mch-footer__wordmark{font-family:var(--font-wordmark);font-style:italic;font-weight:800;font-size:1.7rem;text-transform:uppercase;letter-spacing:-.01em;color:#fff;}
    .mch-footer__wordmark b{font-weight:900;background:var(--gold-grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
    .mch-footer__hellotxt{font-family:var(--font-display);font-weight:900;font-size:1.05rem;color:var(--mch-yellow);text-transform:uppercase;}
    .mch-footer__tag{font-family:var(--font-body);font-size:.875rem;color:var(--text-secondary);max-width:34ch;line-height:1.5;}
    .mch-footer__col h5{font-family:var(--font-body);font-weight:700;font-size:.6875rem;letter-spacing:.14em;
      text-transform:uppercase;color:var(--text-tertiary);margin-bottom:14px;}
    .mch-footer__col a{display:block;font-family:var(--font-body);font-size:.875rem;color:var(--text-secondary);
      padding:5px 0;transition:color var(--dur-fast) var(--ease-out);}
    .mch-footer__col a:hover{color:var(--mch-yellow);}
    .mch-footer__bottom{max-width:var(--container-max);margin:40px auto 0;padding-top:22px;border-top:1px solid var(--border);
      display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;}
    .mch-footer__legal{display:flex;flex-wrap:wrap;gap:18px;}
    .mch-footer__legal a{font-family:var(--font-body);font-size:.75rem;color:var(--text-tertiary);}
    .mch-footer__legal a:hover{color:var(--text-secondary);}
    .mch-footer__copy{font-family:var(--font-body);font-size:.75rem;color:var(--text-muted);}
    .mch-footer__disclaimer{max-width:var(--container-max);margin:14px auto 0;font-family:var(--font-body);
      font-size:.7rem;color:var(--text-muted);line-height:1.5;}
    @media(max-width:760px){
      .mch-footer__grid{grid-template-columns:1fr 1fr;gap:28px 24px;}
      .mch-footer__brand{grid-column:1 / -1;}
    }
    @media(max-width:440px){
      .mch-footer__grid{grid-template-columns:1fr;}
    }
  `);
  const year = new Date().getFullYear();
  return (
    <footer className={`mch-footer${className ? ' ' + className : ''}`} style={style} {...rest}>
      <div className="mch-footer__tread" />
      <div className="mch-footer__grid">
        <div className="mch-footer__brand">
          <div className="mch-footer__hello">
            <span className="mch-footer__wordmark">Michelin<b>+</b></span>
            <span className="mch-footer__hellotxt">Hello&nbsp;!</span>
          </div>
          <p className="mch-footer__tag">{tagline}</p>
        </div>
        {columns.map((c, i) => (
          <div className="mch-footer__col" key={i}>
            <h5>{c.title}</h5>
            {c.links.map((l, j) => <a key={j} href={l.href || '#'}>{l.label}</a>)}
          </div>
        ))}
      </div>
      <div className="mch-footer__bottom">
        <span className="mch-footer__copy">© {year} Michelin+ · Démo hackathon ESGI × Skolae × Michelin — non affilié officiellement.</span>
        <nav className="mch-footer__legal">
          {legal.map((l, i) => <a key={i} href={l.href || '#'}>{l.label}</a>)}
        </nav>
      </div>
      {disclaimer ? <p className="mch-footer__disclaimer">{disclaimer}</p> : null}
    </footer>
  );
}
