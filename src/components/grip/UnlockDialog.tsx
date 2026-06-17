'use client';
import React from 'react';
import { mchStyle } from './mchStyle';
import { Button } from './Button';
import { Badge } from './Badge';

export interface UnlockDialogProps {
  open?: boolean;
  eyebrow?: string;
  title?: string;
  image?: string | null;
  edition?: string | null;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string | null;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
}

/** UnlockDialog — celebratory modal for unlocking a reward / numbered edition. */
export function UnlockDialog({
  open = true,
  eyebrow = 'Récompense débloquée',
  title = '',
  image = null,
  edition = null,
  description = '',
  primaryLabel = 'Ajouter à mes récompenses',
  secondaryLabel = 'Plus tard',
  onPrimary,
  onSecondary,
  onClose,
}: UnlockDialogProps) {
  mchStyle('mch-unlock', `
    .mch-unlock__scrim{position:fixed;inset:0;z-index:var(--z-modal);display:flex;align-items:center;justify-content:center;
      padding:24px;background:rgba(5,6,9,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      animation:mchFade var(--dur-base) var(--ease-out);}
    .mch-unlock{position:relative;width:min(460px,100%);border-radius:var(--radius-2xl);overflow:hidden;
      background:var(--glass-bg-strong);backdrop-filter:blur(var(--blur-strong));-webkit-backdrop-filter:blur(var(--blur-strong));
      border:1px solid var(--glass-border-bright);box-shadow:var(--shadow-xl);animation:mchPop var(--dur-slow) var(--ease-spring);}
    .mch-unlock::before{content:"";position:absolute;inset:0;z-index:0;opacity:.6;pointer-events:none;
      background:radial-gradient(60% 50% at 50% 0%,rgba(232,194,74,.3),transparent 60%),
                 radial-gradient(70% 60% at 50% 110%,rgba(39,80,155,.4),transparent 60%);}
    .mch-unlock__media{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--blue-900);}
    .mch-unlock__media img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.08);}
    .mch-unlock__media::after{content:"";position:absolute;inset:0;background:var(--photo-overlay);}
    .mch-unlock__edition{position:absolute;left:18px;bottom:14px;font-family:var(--font-mono);font-weight:700;
      font-size:1rem;color:var(--gold-300);letter-spacing:.05em;text-shadow:0 1px 10px rgba(0,0,0,.85);}
    .mch-unlock__body{position:relative;z-index:1;padding:26px;display:flex;flex-direction:column;gap:14px;text-align:center;align-items:center;}
    .mch-unlock__eyebrow{font-family:var(--font-body);font-weight:700;font-size:.6875rem;letter-spacing:.18em;
      text-transform:uppercase;color:var(--gold-400);}
    .mch-unlock__title{font-family:var(--font-display);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;
      font-size:clamp(1.6rem,4vw,2.25rem);line-height:1.02;color:var(--text-primary);}
    .mch-unlock__desc{font-family:var(--font-body);font-size:.9375rem;color:var(--text-secondary);max-width:34ch;}
    .mch-unlock__actions{display:flex;flex-direction:column;gap:10px;width:100%;margin-top:6px;}
    .mch-unlock__x{position:absolute;top:14px;right:14px;z-index:2;width:34px;height:34px;border-radius:50%;
      border:1px solid var(--glass-border-bright);background:rgba(8,9,15,.5);color:var(--text-secondary);cursor:pointer;font-size:18px;line-height:1;}
    .mch-unlock__x:hover{color:#fff;border-color:var(--mch-yellow);}
    @keyframes mchFade{from{opacity:0}to{opacity:1}}
    @keyframes mchPop{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
  `);
  if (!open) return null;
  return (
    <div className="mch-unlock__scrim" role="dialog" aria-modal="true">
      <div className="mch-unlock">
        {onClose ? <button className="mch-unlock__x" onClick={onClose} aria-label="Fermer">×</button> : null}
        {image ? (
          <div className="mch-unlock__media">
            <img src={image} alt={title} />
            {edition ? <span className="mch-unlock__edition">{edition}</span> : null}
          </div>
        ) : null}
        <div className="mch-unlock__body">
          <span className="mch-unlock__eyebrow">{eyebrow}</span>
          {edition && !image ? <Badge tone="prestige" dot>{edition}</Badge> : null}
          <h3 className="mch-unlock__title">{title}</h3>
          {description ? <p className="mch-unlock__desc">{description}</p> : null}
          <div className="mch-unlock__actions">
            <Button variant="prestige" full onClick={onPrimary}>{primaryLabel}</Button>
            {secondaryLabel ? <Button variant="ghost" full onClick={onSecondary || onClose}>{secondaryLabel}</Button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
