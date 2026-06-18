import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { totalPoints } from '@/lib/points';
import { ok, fail, handle } from '@/lib/api';

/** Étapes ladder (seeded). Progress is driven by the member's cumulative lifetime points. */
export async function GET() {
  return handle(async () => {
    const season = await prisma.season.findFirst({
      orderBy: { endsAt: 'desc' },
      include: {
        rewards: { orderBy: { stage: 'asc' } },
        missions: true,
      },
    });
    if (!season) return fail('Aucun parcours actif', 404);

    const user = await getCurrentUser();
    const seasonPoints = user ? await totalPoints(user.id) : 0;
    const stagePoints = season.maxPoints / 50;
    const currentStage = Math.min(50, Math.floor(seasonPoints / stagePoints));

    return ok({
      season: { id: season.id, name: season.name, maxPoints: season.maxPoints },
      progress: {
        seasonPoints,
        currentStage,
        totalStages: 50,
        pct: Math.min(100, (seasonPoints / season.maxPoints) * 100),
      },
      rewards: season.rewards.map((r) => ({
        stage: r.stage,
        title: r.title,
        image: r.image,
        threshold: r.threshold,
        epic: r.epic,
        claimed: seasonPoints >= r.threshold,
      })),
      missions: season.missions.map((m) => ({ id: m.id, title: m.title, reward: m.reward, points: m.points })),
    });
  });
}
