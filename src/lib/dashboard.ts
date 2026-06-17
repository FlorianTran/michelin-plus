// Michelin+ — Grip · dashboard state aggregator (shared by API + server pages).
import type { User } from '@prisma/client';
import { prisma } from './db';
import { totalPoints } from './points';
import { tierProgress, type TierName } from './tiers';

export interface FeedItem {
  id: string;
  name: string;
  meta: string;
  points: number;
  source: 'strava_mock' | 'purchase' | 'tier';
}

export interface DashboardState {
  user: {
    id: string;
    name: string;
    firstName: string;
    email: string;
    role: string;
    memberId: string | null;
    sinceYear: string | null;
  };
  points: {
    total: number;
    thisMonth: number;
    fromPurchases: number;
    fromKm: number;
  };
  tier: {
    current: TierName;
    next: TierName | null;
    value: number;
    max: number;
    remaining: number;
    pct: number;
    tone: 'energy' | 'prestige';
    perks: string[];
  };
  stats: {
    kmThisMonth: number;
    clanRank: number | null;
    clanSize: number | null;
    rewardsCount: number;
  };
  feed: FeedItem[];
  clan: { id: string; name: string } | null;
  nextReward: {
    id: string;
    title: string;
    image: string | null;
    cost: number;
    edition: string | null;
    tierRequired: string;
    locked: boolean;
  } | null;
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getDashboardState(user: User): Promise<DashboardState> {
  const [entries, activities, redemptionsCount, membership] = await Promise.all([
    prisma.pointsEntry.findMany({ where: { userId: user.id } }),
    prisma.activity.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' }, take: 6 }),
    prisma.redemption.count({ where: { userId: user.id } }),
    prisma.clanMember.findFirst({ where: { userId: user.id }, include: { clan: true } }),
  ]);

  const total = entries.reduce((s, e) => s + e.amount, 0);
  const som = startOfMonth();
  const thisMonth = entries.filter((e) => e.createdAt >= som).reduce((s, e) => s + e.amount, 0);
  const fromPurchases = entries.filter((e) => e.type === 'purchase').reduce((s, e) => s + e.amount, 0);
  const fromKm = entries.filter((e) => e.type === 'km').reduce((s, e) => s + e.amount, 0);

  const prog = tierProgress(total);

  // clan rank by km
  let clanRank: number | null = null;
  let clanSize: number | null = null;
  let clan: { id: string; name: string } | null = null;
  if (membership) {
    clan = { id: membership.clan.id, name: membership.clan.name };
    const roster = await prisma.clanMember.findMany({
      where: { clanId: membership.clanId },
      orderBy: { km: 'desc' },
    });
    clanSize = roster.length;
    clanRank = roster.findIndex((m) => m.userId === user.id) + 1 || null;
  }

  const kmThisMonth = Math.round(
    activities
      .filter((a) => a.date >= som && a.source === 'strava_mock')
      .reduce((s, a) => s + a.distanceKm, 0),
  );

  const feed: FeedItem[] = activities.map((a) => ({
    id: a.id,
    name: a.name,
    meta: formatFeedMeta(a.date, a.distanceKm, a.elevation, a.source),
    points: a.pointsAwarded,
    source: a.source as FeedItem['source'],
  }));

  // next reward = cheapest reward the member has NOT redeemed, prefer a numbered edition
  const redeemed = await prisma.redemption.findMany({ where: { userId: user.id }, select: { rewardId: true } });
  const redeemedIds = new Set(redeemed.map((r) => r.rewardId));
  const rewards = await prisma.reward.findMany({ orderBy: { cost: 'asc' } });
  const candidate =
    rewards.find((r) => r.kind === 'edition' && !redeemedIds.has(r.id)) ??
    rewards.find((r) => !redeemedIds.has(r.id)) ??
    null;

  const nextReward = candidate
    ? {
        id: candidate.id,
        title: candidate.title,
        image: candidate.image,
        cost: candidate.cost,
        edition:
          candidate.editionNumber && candidate.editionTotal
            ? `#${String(candidate.editionNumber).padStart(3, '0')} / ${candidate.editionTotal}`
            : null,
        tierRequired: candidate.tierRequired,
        locked: total < tierMinFor(candidate.tierRequired),
      }
    : null;

  return {
    user: {
      id: user.id,
      name: user.name,
      firstName: user.name.split(' ')[0],
      email: user.email,
      role: user.role,
      memberId: user.memberId,
      sinceYear: user.sinceYear,
    },
    points: { total, thisMonth, fromPurchases, fromKm },
    tier: {
      current: prog.current.name,
      next: prog.next?.name ?? null,
      value: prog.value,
      max: prog.max,
      remaining: prog.remaining,
      pct: prog.pct,
      tone: prog.current.tone,
      perks: prog.current.perks,
    },
    stats: { kmThisMonth, clanRank, clanSize, rewardsCount: redemptionsCount },
    feed,
    clan,
    nextReward,
  };
}

function tierMinFor(tier: string): number {
  switch (tier) {
    case 'Carbone':
      return 15000;
    case 'Titane':
      return 5000;
    default:
      return 0;
  }
}

function formatFeedMeta(date: Date, km: number, elev: number, source: string): string {
  const when = relativeDay(date);
  if (source === 'purchase') return `${when} · Carte produit activée`;
  if (source === 'tier') return `${when} · Avantages débloqués`;
  return `${when} · ${km.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km · ${elev} D+`;
}

function relativeDay(date: Date): string {
  const now = new Date();
  const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((d0.getTime() - d1.getTime()) / 86400000);
  if (diff <= 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export { totalPoints };
