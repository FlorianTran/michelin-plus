// Michelin+ — Grip · points engine (DB layer over the pure tier math).
import type { PointsType, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from './db';
import { detectTierUp, tierForPoints, type Tier } from './tiers';

type Db = PrismaClient | Prisma.TransactionClient;

/** Lifetime points = sum of all PointsEntry.amount for a user. */
export async function totalPoints(userId: string, db: Db = prisma): Promise<number> {
  const agg = await db.pointsEntry.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return agg._sum.amount ?? 0;
}

export interface AwardResult {
  awarded: number;
  total: number;
  tier: Tier;
  tierUp: Tier | null;
}

/**
 * Credit points to a member (real mutation) and report whether it triggered a
 * tier-up. `entry.meta` is optional structured context for the activity feed.
 */
export async function awardPoints(
  userId: string,
  amount: number,
  type: PointsType,
  label: string,
  meta?: Prisma.InputJsonValue,
  db: Db = prisma,
): Promise<AwardResult> {
  const before = await totalPoints(userId, db);
  await db.pointsEntry.create({
    data: { userId, amount, type, label, ...(meta !== undefined ? { meta } : {}) },
  });
  const total = before + amount;
  return {
    awarded: amount,
    total,
    tier: tierForPoints(total),
    tierUp: detectTierUp(before, total),
  };
}
