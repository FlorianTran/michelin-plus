'use client';
import React from 'react';
import { mchStyle } from './mchStyle';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: 'energy' | 'prestige' | null;
  online?: boolean;
}

/** Avatar — member portrait with optional tier ring + online dot. Falls back to initials. */
export function Avatar({ src = null, name = '', size = 'md', ring = null, online = false, style = {}, className = '', ...rest }: AvatarProps) {
  mchStyle('mch-avatar', `
    .mch-avatar{position:relative;display:inline-flex;align-items:center;justify-content:center;
      border-radius:50%;font-family:var(--font-display);font-weight:900;color:var(--text-primary);
      background:linear-gradient(150deg,var(--blue-600),var(--blue-800));overflow:hidden;flex:none;
      border:2px solid var(--border);}
    .mch-avatar img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.05);}
    .mch-avatar--sm{width:32px;height:32px;font-size:.75rem;}
    .mch-avatar--md{width:44px;height:44px;font-size:.95rem;}
    .mch-avatar--lg{width:60px;height:60px;font-size:1.25rem;}
    .mch-avatar--xl{width:88px;height:88px;font-size:1.9rem;}
    .mch-avatar--ring-energy{border-color:var(--mch-yellow);box-shadow:0 0 0 2px rgba(252,229,0,.25);}
    .mch-avatar--ring-prestige{border-color:var(--gold-500);box-shadow:0 0 0 2px rgba(232,194,74,.28);}
    .mch-avatar__dot{position:absolute;right:0;bottom:0;width:28%;height:28%;border-radius:50%;
      background:var(--success);border:2px solid var(--canvas);}
  `);
  const initials = name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const cls = `mch-avatar mch-avatar--${size}` + (ring ? ` mch-avatar--ring-${ring}` : '') + (className ? ' ' + className : '');
  return (
    <span className={cls} style={style} {...rest}>
      {src ? <img src={src} alt={name} /> : initials}
      {online ? <span className="mch-avatar__dot" /> : null}
    </span>
  );
}
