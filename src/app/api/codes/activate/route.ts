import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { awardPoints } from '@/lib/points';
import { headlineRewardForTier } from '@/lib/rewards';
import { ok, fail, handle } from '@/lib/api';

/** Activate a product card code → credit real points (and maybe a tier-up). */
export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const code = String(body.code || '').trim().toUpperCase();
    if (!code) return fail('Code requis');

    const card = await prisma.cardCode.findUnique({ where: { code } });
    if (!card) return fail('Code inconnu', 404);
    if (card.used) return fail('Ce code a déjà été utilisé', 409);

    const result = await prisma.$transaction(async (tx) => {
      await tx.cardCode.update({
        where: { id: card.id },
        data: { used: true, usedByUserId: user.id, usedAt: new Date() },
      });
      await tx.activity.create({
        data: {
          userId: user.id,
          name: `Achat activé · ${card.productLabel}`,
          source: 'purchase',
          pointsAwarded: card.pointsValue,
        },
      });
      return awardPoints(
        user.id,
        card.pointsValue,
        card.kind === 'ambassador' ? 'bonus' : 'purchase',
        `Achat activé · ${card.productLabel}`,
        { code: card.code },
        tx,
      );
    });

    const unlockedReward = result.tierUp
      ? await headlineRewardForTier(user.id, result.tierUp.name)
      : null;

    return ok({
      awarded: result.awarded,
      total: result.total,
      product: card.productLabel,
      tier: result.tier.name,
      tierUp: result.tierUp?.name ?? null,
      unlockedReward,
    });
  });
}
