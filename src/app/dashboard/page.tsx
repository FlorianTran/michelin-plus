import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardState } from '@/lib/dashboard';
import { prisma } from '@/lib/db';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const state = await getDashboardState(user);

  let leaderboard: { rank: number; name: string; meta: string; km: number; you: boolean; avatar: string | null }[] = [];
  if (state.clan) {
    const roster = await prisma.clanMember.findMany({
      where: { clanId: state.clan.id },
      orderBy: { km: 'desc' },
      include: { user: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });
    leaderboard = roster.map((m, i) => ({
      rank: i + 1,
      name: m.user.name,
      meta: m.user.role === 'ambassador' ? `${state.clan!.name} · Ambassadeur` : m.user.role === 'member' ? 'Membre' : m.user.role,
      km: m.km,
      you: m.user.id === user.id,
      avatar: m.user.avatarUrl,
    }));
  }

  return <DashboardClient initial={state} leaderboard={leaderboard} />;
}
