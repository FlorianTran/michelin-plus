'use client';
import React from 'react';
import { mchStyle } from './mchStyle';
import { Badge } from './Badge';
import { Button } from './Button';

export interface RewardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  image?: string | null;
  tier?: string;
  cost?: number;
  edition?: string | null;
  locked?: boolean;
  cta?: string;
  onUnlock?: () => void;
}

/** RewardCard — catalogue / drop tile. B&W image + tier lock + numbered-edition flag. */
export function RewardCard({
  title = '',
  image = null,
  tier = 'Aluminium',
  cost = 0,
  edition = null,
  locked = false,
  cta = 'Débloquer',
  onUnlock,
  style = {},
  className = '',
  ...rest
}: RewardCardProps) {
  mchStyle('mch-reward', `
    .mch-reward{position:relative;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--glass-border);
      background:var(--surface-2);box-shadow:var(--shadow-md);transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out);display:flex;flex-direction:column;}
    .mch-reward:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--glass-border-bright);}
    .mch-reward__media{position:relative;aspect-ratio:4/3;background:var(--blue-900);overflow:hidden;}
    .mch-reward__media img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.08);
      transition:transform var(--dur-slow) var(--ease-out);}
    .mch-reward:hover .mch-reward__media img{transform:scale(1.06);}
    .mch-reward__overlay{position:absolute;inset:0;background:var(--photo-overlay);}
    .mch-reward__flags{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:8px;}
    .mch-reward__edition{position:absolute;bottom:12px;left:12px;font-family:var(--font-mono);font-weight:700;
      font-size:.8125rem;color:var(--gold-300);letter-spacing:.04em;text-shadow:0 1px 8px rgba(0,0,0,.8);}
    .mch-reward__body{padding:var(--space-5);display:flex;flex-direction:column;gap:14px;flex:1;}
    .mch-reward__title{font-family:var(--font-display);font-weight:800;font-size:1.1875rem;line-height:1.1;
      letter-spacing:-.01em;color:var(--text-primary);text-transform:uppercase;}
    .mch-reward__foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;}
    .mch-reward__cost{font-family:var(--font-mono);font-weight:700;font-size:1.0625rem;color:var(--text-primary);
      display:inline-flex;align-items:baseline;gap:5px;}
    .mch-reward__cost span{font-family:var(--font-body);font-size:.6875rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-secondary);}
    .mch-reward__lock{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      background:rgba(8,9,15,.5);backdrop-filter:blur(2px);font-family:var(--font-body);font-weight:700;
      font-size:.8125rem;color:var(--blue-200);}
  `);
  const isEdition = !!edition;
  return (
    <div className={`mch-reward${className ? ' ' + className : ''}`} style={style} {...rest}>
      <div className="mch-reward__media">
        {image ? <img src={image} alt={title} /> : null}
        <div className="mch-reward__overlay" />
        <div className="mch-reward__flags">
          <Badge tone={isEdition ? 'prestige' : 'blue'} dot>{isEdition ? 'Édition limitée' : `Palier ${tier}`}</Badge>
          {locked ? <Badge tone="neutral">Verrouillé</Badge> : null}
        </div>
        {isEdition ? <div className="mch-reward__edition">{edition}</div> : null}
        {locked ? <div className="mch-reward__lock">Palier {tier} requis</div> : null}
      </div>
      <div className="mch-reward__body">
        <h4 className="mch-reward__title">{title}</h4>
        <div className="mch-reward__foot">
          <span className="mch-reward__cost">{cost.toLocaleString('fr-FR')}<span>pts</span></span>
          <Button variant={isEdition ? 'prestige' : 'energy'} size="sm" disabled={locked} onClick={onUnlock}>{cta}</Button>
        </div>
      </div>
    </div>
  );
}
