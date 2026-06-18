// Michelin+ — Grip · demo control panel API (gated by DEBUG_TOKEN).
// Drives the /debug page so the demo runs without depending on real inputs.
import { prisma } from '@/lib/db';
import { getCurrentUser, destroySession } from '@/lib/auth';
import { awardPoints, totalPoints } from '@/lib/points';
import { pointsForKm, tierByName, tierForPoints, type TierName } from '@/lib/tiers';
import { seedDemo } from '@/lib/seed-demo';
import { ok, fail, handle, checkDebugToken } from '@/lib/api';

const RIDE = 'Sortie démo · contrôle live';

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  return handle(async () => {
    const { action } = await params;
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const token = req.headers.get('x-debug-token') || (body.token as string | undefined);
    if (!checkDebugToken(token)) return fail('Token debug invalide', 401);

    // reset wipes & reseeds the whole demo; doesn't need a logged-in user.
    if (action === 'reset') {
      await seedDemo(prisma);
      await destroySession();
      return ok({ ok: true, reset: true });
    }

    if (action === 'triggerToast') {
      return ok({
        toast: {
          tone: (body.tone as string) || 'energy',
          title: (body.title as string) || 'Points crédités',
          message: (body.message as string) || 'Action de démonstration',
          points: (body.points as string) || '+250 pts',
        },
      });
    }

    const user = await getCurrentUser();
    if (!user) return fail('Connecte-toi (Léa ou Romain) avant de piloter la démo', 401);

    switch (action) {
      case 'addPoints': {
        const amount = Math.round(Number(body.amount) || 250);
        const result = await awardPoints(user.id, amount, 'bonus', 'Bonus démo', { source: 'debug' });
        return ok({ awarded: amount, total: result.total, tier: result.tier.name, tierUp: result.tierUp?.name ?? null });
      }

      case 'addKm': {
        const km = Math.round((Number(body.km) || 25) * 10) / 10;
        const elevation = Math.round(km * 12);
        const points = pointsForKm(km);
        const result = await prisma.$transaction(async (tx) => {
          await tx.activity.create({
            data: { userId: user.id, name: RIDE, distanceKm: km, elevation, pointsAwarded: points, source: 'strava_mock' },
          });
          await tx.clanMember.updateMany({ where: { userId: user.id }, data: { km: { increment: Math.round(km) } } });
          return awardPoints(user.id, points, 'km', RIDE, { km, source: 'debug' }, tx);
        });
        return ok({ km, awarded: points, total: result.total, tier: result.tier.name, tierUp: result.tierUp?.name ?? null });
      }

      case 'activateCode': {
        const code = String(body.code || '').trim().toUpperCase();
        const card = await prisma.cardCode.findUnique({ where: { code } });
        if (!card) return fail('Code inconnu', 404);
        if (card.used) return fail('Code déjà utilisé', 409);
        const result = await prisma.$transaction(async (tx) => {
          await tx.cardCode.update({ where: { id: card.id }, data: { used: true, usedByUserId: user.id, usedAt: new Date() } });
          await tx.activity.create({ data: { userId: user.id, name: `Achat activé · ${card.productLabel}`, source: 'purchase', pointsAwarded: card.pointsValue } });
          return awardPoints(user.id, card.pointsValue, 'purchase', `Achat activé · ${card.productLabel}`, { code }, tx);
        });
        return ok({ awarded: card.pointsValue, total: result.total, tier: result.tier.name, tierUp: result.tierUp?.name ?? null, product: card.productLabel });
      }

      case 'setTier': {
        const target = String(body.tier || 'Carbone') as TierName;
        const t = tierByName(target);
        const goal = (t.max === Infinity ? t.min : t.min) + 100; // sit solidly inside the band
        const current = await totalPoints(user.id);
        const delta = goal - current;
        const before = tierForPoints(current);
        await awardPoints(user.id, delta, 'bonus', `Ajustement démo → ${target}`, { setTier: target });
        return ok({ tier: target, total: goal, delta, from: before.name });
      }

      case 'redeem': {
        const rewardId = String(body.rewardId || '');
        const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward) return fail('Récompense introuvable', 404);
        const existing = await prisma.redemption.findUnique({
          where: { userId_rewardId: { userId: user.id, rewardId } },
        });
        if (existing) return fail('Déjà débloquée', 409);
        await prisma.redemption.create({ data: { userId: user.id, rewardId } });
        return ok({ ok: true, reward: { id: reward.id, title: reward.title, image: reward.image } });
      }

      default:
        return fail(`Action debug inconnue: ${action}`, 404);
    }
  });
}
