import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { awardPoints } from '@/lib/points';
import { pointsForKm } from '@/lib/tiers';
import { headlineRewardForTier } from '@/lib/rewards';
import { ok, handle } from '@/lib/api';

const RIDE_NAMES = [
  'Sortie gravel · Vallée de Chevreuse',
  'Sortie route · Boucle des Yvelines',
  'Sortie longue · Forêt de Rambouillet',
  'Col du Galibier · entraînement',
  'Sortie matinale · Bois de Vincennes',
  'Gravel · Plateau de Saclay',
];

/** MOCK Strava sync — invents a fresh ride, credits ~10 pts/km (real points). */
export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));

    // Optional override from the debug panel; otherwise random ride 22–58 km.
    const km =
      typeof body.km === 'number' && body.km > 0
        ? Math.round(body.km * 10) / 10
        : Math.round((22 + Math.random() * 36) * 10) / 10;
    const elevation = Math.round(km * (8 + Math.random() * 22));
    const name = RIDE_NAMES[Math.floor(Math.random() * RIDE_NAMES.length)];
    const points = pointsForKm(km);

    const result = await prisma.$transaction(async (tx) => {
      await tx.activity.create({
        data: { userId: user.id, name, distanceKm: km, elevation, pointsAwarded: points, source: 'strava_mock' },
      });
      // clan km bump for the leaderboard
      await tx.clanMember.updateMany({ where: { userId: user.id }, data: { km: { increment: Math.round(km) } } });
      return awardPoints(user.id, points, 'km', name, { km, elevation }, tx);
    });

    const unlockedReward = result.tierUp
      ? await headlineRewardForTier(user.id, result.tierUp.name)
      : null;

    return ok({
      activity: { name, km, elevation, points },
      awarded: result.awarded,
      total: result.total,
      tier: result.tier.name,
      tierUp: result.tierUp?.name ?? null,
      unlockedReward,
    });
  });
}
