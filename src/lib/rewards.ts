// Michelin+ — Grip · reward helpers shared by the points-earning routes.
import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from './db';

type Db = PrismaClient | Prisma.TransactionClient;

export interface UnlockedReward {
  id: string;
  title: string;
  image: string | null;
  edition: string | null;
}

/**
 * The headline reward newly unlocked by reaching `tier`: prefer a numbered
 * edition (the signature prestige drop, with its edition badge), otherwise the
 * most prestigious (highest-cost) reward gated on that tier the member hasn't
 * claimed yet. Drives the tier-up celebration pop-up in the member flow.
 */
export async function headlineRewardForTier(
  userId: string,
  tier: string,
  db: Db = prisma,
): Promise<UnlockedReward | null> {
  const where = { tierRequired: tier, redemptions: { none: { userId } } } as const;
  const r =
    (await db.reward.findFirst({ where: { ...where, kind: 'edition' }, orderBy: { cost: 'desc' } })) ??
    (await db.reward.findFirst({ where, orderBy: { cost: 'desc' } }));
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    image: r.image,
    edition:
      r.editionNumber && r.editionTotal
        ? `#${String(r.editionNumber).padStart(3, '0')} / ${r.editionTotal}`
        : null,
  };
}
