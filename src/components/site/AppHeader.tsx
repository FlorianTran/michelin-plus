'use client';
import { usePathname } from 'next/navigation';
import { Header, Avatar } from '@/components/grip';
import { APP_NAV } from '@/lib/nav';

export interface AppHeaderProps {
  points?: number | null;
  name?: string;
  accent?: 'energy' | 'prestige';
  activeKey?: string;
}

export function AppHeader({ points = null, name = '', accent = 'energy', activeKey }: AppHeaderProps) {
  const pathname = usePathname();
  const links = APP_NAV.map((l) => ({
    label: l.label,
    href: l.href,
    active: activeKey ? activeKey === l.key : pathname?.startsWith(l.href) ?? false,
  }));
  return (
    <Header
      links={links}
      authed
      points={points}
      accent={accent}
      avatar={<a href="/dashboard"><Avatar name={name || 'Membre'} size="md" ring={accent} /></a>}
    />
  );
}
