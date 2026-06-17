'use client';
import React from 'react';
import Link from 'next/link';
import { mchStyle } from '@/components/grip/mchStyle';

const KEY = 'mch_cookie_consent'; // 'all' | 'essential'

/** Minimal RGPD cookie banner — non-essential cookies refused by default. */
export function CookieBanner() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked — stay hidden */
    }
  }, []);

  function decide(choice: 'all' | 'essential') {
    try { localStorage.setItem(KEY, choice); } catch { /* ignore */ }
    setShow(false);
  }

  mchStyle('mch-cookie', `
    .mch-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:2000;margin:0 auto;max-width:680px;
      display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:16px 18px;border-radius:var(--radius-lg);
      background:rgba(10,11,16,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
      border:1px solid var(--border-bright);box-shadow:var(--shadow-xl);}
    .mch-cookie__txt{flex:1;min-width:220px;font-family:var(--font-body);font-size:.82rem;color:var(--text-secondary);line-height:1.5;}
    .mch-cookie__txt a{color:var(--mch-yellow);}
    .mch-cookie__row{display:flex;gap:10px;flex-wrap:wrap;}
    .mch-cookie__btn{font-family:var(--font-body);font-weight:700;font-size:.8rem;padding:9px 16px;border-radius:var(--radius-pill);cursor:pointer;border:1px solid var(--border);}
    .mch-cookie__btn--ghost{background:transparent;color:var(--text-secondary);}
    .mch-cookie__btn--ghost:hover{color:#fff;border-color:var(--border-bright);}
    .mch-cookie__btn--accent{background:var(--mch-yellow);color:#0a0a0c;border-color:var(--mch-yellow);}
    .mch-cookie__btn--accent:hover{filter:brightness(1.06);}
    @media(max-width:520px){.mch-cookie__row{width:100%;}.mch-cookie__btn{flex:1;}}
  `);

  if (!show) return null;
  return (
    <div className="mch-cookie" role="dialog" aria-label="Préférences cookies">
      <p className="mch-cookie__txt">
        On utilise un cookie de session essentiel. Les cookies de mesure et de personnalisation
        restent désactivés tant que tu ne les acceptes pas.{' '}
        <Link href="/confidentialite#cookies">En savoir plus</Link>.
      </p>
      <div className="mch-cookie__row">
        <button className="mch-cookie__btn mch-cookie__btn--ghost" onClick={() => decide('essential')}>
          Refuser le non-essentiel
        </button>
        <button className="mch-cookie__btn mch-cookie__btn--accent" onClick={() => decide('all')}>
          Tout accepter
        </button>
      </div>
    </div>
  );
}
