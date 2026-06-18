'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { mchStyle } from '@/components/grip';
import { MEMBER_TABS, type MemberTabIcon } from '@/lib/nav';

// Lucide-style inline icons, matching ui_kits/member-dashboard-mobile (22px, 1.9 stroke).
const TAB_ICON: Record<MemberTabIcon, React.ReactNode> = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>,
  gift: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M7.5 8a2.5 2.5 0 1 1 4.5-1.5C12 4 16 4 16.5 6.5A2.5 2.5 0 1 1 16.5 8" /></svg>,
  clan: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>,
  card: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></svg>,
};

/**
 * BottomTabBar — fixed app-like tab bar for member pages on mobile (≤700px).
 * Ported from ui_kits/member-dashboard-mobile `BottomNav`. Hidden on desktop
 * (the `.mch-header__nav` carries navigation there).
 */
export function BottomTabBar() {
  const pathname = usePathname();
  mchStyle('mch-tabbar', `
    .mch-tabbar{display:none;}
    @media(max-width:700px){
      .mch-tabbar{display:flex;position:fixed;bottom:0;inset-inline:0;z-index:var(--z-header);
        justify-content:space-around;align-items:center;
        padding:10px 8px calc(6px + env(safe-area-inset-bottom));
        background:rgba(10,10,12,.86);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
        border-top:.5px solid var(--border);}
    }
    .mch-tabbar__item{display:flex;flex-direction:column;align-items:center;gap:4px;
      padding:2px 8px;min-width:56px;background:none;border:none;cursor:pointer;text-decoration:none;
      color:rgba(255,255,255,.45);}
    .mch-tabbar__item--active{color:var(--mch-yellow);}
    .mch-tabbar__label{font-family:var(--font-body);font-size:.55rem;font-weight:700;letter-spacing:.02em;}
  `);

  return (
    <nav className="mch-tabbar" aria-label="Navigation principale">
      {MEMBER_TABS.map((t) => {
        const active = pathname === t.href || (pathname?.startsWith(t.href + '/') ?? false);
        return (
          <a
            key={t.href}
            href={t.href}
            className={`mch-tabbar__item${active ? ' mch-tabbar__item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {TAB_ICON[t.icon]}
            <span className="mch-tabbar__label">{t.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
