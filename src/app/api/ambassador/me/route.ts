import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { totalPoints } from '@/lib/points';
import { tierForPoints } from '@/lib/tiers';
import { ok, fail, handle } from '@/lib/api';

/** Ambassador dashboard data (seeded). Returns the profile + owned clan + leaderboard. */
export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    const profile = await prisma.ambassadorProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return fail("Cet utilisateur n'est pas ambassadeur", 403);

    const total = await totalPoints(user.id);
    const clan = await prisma.clan.findFirst({
      where: { ambassadorUserId: user.id },
      include: {
        members: {
          orderBy: { km: 'desc' },
          include: { user: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    const roster =
      clan?.members.map((m, i) => ({
        rank: i + 1,
        name: m.user.name,
        meta: m.user.role === 'ambassador' ? 'Ambassadeur' : 'Membre',
        km: m.km,
        you: m.user.id === user.id,
      })) ?? [];

    return ok({
      user: { id: user.id, name: user.name, memberId: user.memberId, sinceYear: user.sinceYear },
      tier: tierForPoints(total).name,
      points: total,
      profile: {
        code: profile.code,
        commissionPct: profile.commissionPct,
        salesCount: profile.salesCount,
        ytdAmount: profile.ytdAmount,
        audience: profile.audience,
      },
      clan: clan ? { id: clan.id, name: clan.name, size: roster.length } : null,
      leaderboard: roster,
    });
  });
}
