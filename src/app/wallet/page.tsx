import { getCurrentUser } from '@/lib/auth';
import { getDashboardState } from '@/lib/dashboard';
import { WalletClient, type WalletCard } from './WalletClient';

export const dynamic = 'force-dynamic';

const DEMO_CARD: WalletCard = {
  name: 'Léa Moreau',
  tier: 'Titane',
  memberId: 'M+ 0042 1180',
  points: 12480,
  since: '2024',
};

export default async function WalletPage() {
  const user = await getCurrentUser();

  let card: WalletCard = DEMO_CARD;
  if (user) {
    const state = await getDashboardState(user);
    card = {
      name: state.user.name,
      tier: state.tier.current,
      memberId: state.user.memberId ?? 'M+ ——',
      points: state.points.total,
      since: state.user.sinceYear ?? '2024',
    };
  }

  return <WalletClient card={card} authed={Boolean(user)} />;
}
