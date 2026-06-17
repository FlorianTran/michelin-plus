import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { totalPoints } from '@/lib/points';
import { ok, fail, handle } from '@/lib/api';

function tierMin(tier: string): number {
  return tier === 'Carbone' ? 15000 : tier === 'Titane' ? 5000 : 0;
}

/** Redeem a reward — gated on tier (real rule). Points are NOT spent (demo). */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;

    const reward = await prisma.reward.findUnique({ where: { id } });
    if (!reward) return fail('Récompense introuvable', 404);

    const total = await totalPoints(user.id);
    if (total < tierMin(reward.tierRequired)) {
      return fail(`Palier ${reward.tierRequired} requis pour cette récompense`, 403);
    }

    const already = await prisma.redemption.findUnique({
      where: { userId_rewardId: { userId: user.id, rewardId: id } },
    });
    if (already) return fail('Récompense déjà débloquée', 409);

    await prisma.redemption.create({ data: { userId: user.id, rewardId: id } });

    return ok({
      ok: true,
      reward: {
        id: reward.id,
        title: reward.title,
        image: reward.image,
        edition:
          reward.editionNumber && reward.editionTotal
            ? `#${String(reward.editionNumber).padStart(3, '0')} / ${reward.editionTotal}`
            : null,
      },
    });
  });
}
