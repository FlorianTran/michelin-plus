// Michelin+ — Grip · "preuve technique" endpoint (token-gated, read-only).
// Proves the loyalty engine writes & processes REAL rows: live DB connection,
// per-table row counts, the latest writes (with timestamps) and the current
// user's live SUM(points). Drives the /debug "Base de données" panel.
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { totalPoints } from '@/lib/points';
import { tierForPoints } from '@/lib/tiers';
import { ok, fail, handle, checkDebugToken } from '@/lib/api';

const fdate = (d: Date) => d.toISOString();

export async function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const token = req.headers.get('x-debug-token') || url.searchParams.get('token');
    if (!checkDebugToken(token)) return fail('Token debug invalide', 401);

    // Live connection check — a real round-trip to Postgres.
    let dbOk = true;
    let dbLatencyMs: number | null = null;
    try {
      const t0 = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Math.round((performance.now() - t0) * 10) / 10;
    } catch {
      dbOk = false;
    }

    const [
      users, pointsEntries, activities, clans, clanMembers,
      rewards, redemptions, seasons, codesTotal, codesUsed,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.pointsEntry.count(),
      prisma.activity.count(),
      prisma.clan.count(),
      prisma.clanMember.count(),
      prisma.reward.count(),
      prisma.redemption.count(),
      prisma.season.count(),
      prisma.cardCode.count(),
      prisma.cardCode.count({ where: { used: true } }),
    ]);

    const [lastPoints, lastActivities, lastRedemptions] = await Promise.all([
      prisma.pointsEntry.findMany({
        orderBy: { createdAt: 'desc' }, take: 6,
        include: { user: { select: { name: true } } },
      }),
      prisma.activity.findMany({
        orderBy: { createdAt: 'desc' }, take: 6,
        include: { user: { select: { name: true } } },
      }),
      prisma.redemption.findMany({
        orderBy: { createdAt: 'desc' }, take: 6,
        include: { user: { select: { name: true } }, reward: { select: { title: true } } },
      }),
    ]);

    const user = await getCurrentUser();
    const userTotal = user ? await totalPoints(user.id) : null;

    return ok({
      db: { connected: dbOk, latencyMs: dbLatencyMs, provider: 'postgresql' },
      counts: {
        User: users,
        PointsEntry: pointsEntries,
        Activity: activities,
        Clan: clans,
        ClanMember: clanMembers,
        Reward: rewards,
        Redemption: redemptions,
        Season: seasons,
        CardCode: `${codesUsed} / ${codesTotal}`,
      },
      session: user
        ? { name: user.name, role: user.role, sumPoints: userTotal, tier: tierForPoints(userTotal ?? 0).name }
        : null,
      writes: {
        PointsEntry: lastPoints.map((p) => ({
          id: p.id, at: fdate(p.createdAt), who: p.user.name,
          type: p.type, amount: p.amount, label: p.label,
        })),
        Activity: lastActivities.map((a) => ({
          id: a.id, at: fdate(a.createdAt), who: a.user.name,
          name: a.name, km: a.distanceKm, points: a.pointsAwarded, source: a.source,
        })),
        Redemption: lastRedemptions.map((r) => ({
          id: r.id, at: fdate(r.createdAt), who: r.user.name, reward: r.reward.title,
        })),
      },
    });
  });
}
