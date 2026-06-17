import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardState } from '@/lib/dashboard';
import { WalletClient, type WalletCard } from './WalletClient';

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const state = await getDashboardState(user);
  const card: WalletCard = {
    name: state.user.name,
    tier: state.tier.current,
    memberId: state.user.memberId ?? 'M+ ——',
    points: state.points.total,
    since: state.user.sinceYear ?? '2024',
  };

  return <WalletClient card={card} authed />;
}
