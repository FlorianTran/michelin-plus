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

/** The subset of a Reward the picker needs — keeps the pure helper DB-agnostic. */
export interface RewardCandidate {
  id: string;
  title: string;
  image: string | null;
  cost: number;
  kind: string;
  editionNumber: number | null;
  editionTotal: number | null;
}

/**
 * Pure picker for the headline (most prestigious) reward among a tier's
 * unredeemed rewards: prefer a numbered `edition` (highest cost wins), else the
 * highest-cost reward of any kind, else null when there's nothing to show.
 */
export function pickHeadlineReward(rewards: RewardCandidate[]): UnlockedReward | null {
  if (rewards.length === 0) return null;
  const byCostDesc = [...rewards].sort((a, b) => b.cost - a.cost);
  const r = byCostDesc.find((x) => x.kind === 'edition') ?? byCostDesc[0];
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

/**
 * The headline reward newly unlocked by reaching `tier`: fetches the tier's
 * unredeemed rewards once and delegates the choice to {@link pickHeadlineReward}.
 * Drives the tier-up celebration pop-up in the member flow.
 */
export async function headlineRewardForTier(
  userId: string,
  tier: string,
  db: Db = prisma,
): Promise<UnlockedReward | null> {
  const rewards = await db.reward.findMany({
    where: { tierRequired: tier, redemptions: { none: { userId } } },
    orderBy: { cost: 'desc' },
  });
  return pickHeadlineReward(rewards);
}
