'use client';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/grip';
import { MARKETING_NAV } from '@/lib/nav';

export function MarketingHeader({ active }: { active?: string }) {
  const router = useRouter();
  const links = MARKETING_NAV.map((l) => ({ ...l, active: active === l.href }));
  return <Header links={links} authed={false} ctaLabel="Rejoindre" onCta={() => router.push('/login')} accent="energy" />;
}
