import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { totalPoints } from '@/lib/points';
import { tierForPoints } from '@/lib/tiers';
import { ok, handle } from '@/lib/api';

function tierMin(tier: string): number {
  return tier === 'Carbone' ? 15000 : tier === 'Titane' ? 5000 : 0;
}

export async function GET() {
  return handle(async () => {
    const user = await getCurrentUser();
    const total = user ? await totalPoints(user.id) : 0;
    const currentTier = tierForPoints(total);

    const [rewards, redeemed] = await Promise.all([
      prisma.reward.findMany({ orderBy: [{ kind: 'asc' }, { cost: 'asc' }] }),
      user
        ? prisma.redemption.findMany({ where: { userId: user.id }, select: { rewardId: true } })
        : Promise.resolve([]),
    ]);
    const redeemedIds = new Set(redeemed.map((r) => r.rewardId));

    const rows = rewards.map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      tierRequired: r.tierRequired,
      cost: r.cost,
      kind: r.kind,
      edition:
        r.editionNumber && r.editionTotal
          ? `#${String(r.editionNumber).padStart(3, '0')} / ${r.editionTotal}`
          : null,
      locked: total < tierMin(r.tierRequired),
      redeemed: redeemedIds.has(r.id),
    }));

    return ok({
      total,
      currentTier: currentTier.name,
      rewards: rows,
    });
  });
}
