// Michelin+ — Grip · canonical demo seed (shared by prisma/seed.ts + /api/debug/reset).
// Léa (member, Titane, NO clan → joins live via code), Thomas (ambassador, Carbone,
// owns clan "Gravel Lyon"), Sofia (micro-ambassadrice), rewards catalogue (numbered
// editions + gourde Bardet), activation codes, season.
import {
  PrismaClient,
  Role,
  PointsType,
  ActivitySource,
  CardKind,
  RewardKind,
  type Prisma,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

type Db = PrismaClient | Prisma.TransactionClient;

export const DEMO_PASSWORD = 'demo1234';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function thisMonth(day: number): Date {
  const d = new Date();
  d.setDate(day);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function wipe(db: Db) {
  await db.redemption.deleteMany();
  await db.pointsEntry.deleteMany();
  await db.activity.deleteMany();
  await db.clanMember.deleteMany();
  await db.seasonProgress.deleteMany();
  await db.seasonReward.deleteMany();
  await db.seasonMission.deleteMany();
  await db.ambassadorProfile.deleteMany();
  await db.cardCode.deleteMany();
  await db.reward.deleteMany();
  await db.clan.deleteMany();
  await db.season.deleteMany();
  await db.user.deleteMany();
}

export interface SeedSummary {
  lea: string;
  thomas: string;
}

export async function seedDemo(db: Db): Promise<SeedSummary> {
  await wipe(db);
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const lea = await db.user.create({
    data: {
      email: 'lea@michelin.plus',
      passwordHash: hash,
      name: 'Léa Moreau',
      role: Role.member,
      memberId: 'M+ 0042 1180',
      sinceYear: '2024',
      referralCode: 'LEA-2024',
    },
  });
  const thomas = await db.user.create({
    data: {
      email: 'thomas@michelin.plus',
      passwordHash: hash,
      name: 'Thomas Vidal',
      role: Role.ambassador,
      memberId: 'M+ 0001 0007',
      sinceYear: '2023',
      referralCode: 'VIDAL-26',
    },
  });
  // Sofia & Marc were referred by Thomas (his 2 000 referral pts = 2 filleuls × 1 000).
  const sofia = await db.user.create({
    data: { email: 'sofia@michelin.plus', passwordHash: hash, name: 'Sofia Bernardi', role: Role.member, sinceYear: '2025', referralCode: 'SOFIA-B7', referredById: thomas.id },
  });
  const marc = await db.user.create({
    data: { email: 'marc@michelin.plus', passwordHash: hash, name: 'Marc Petit', role: Role.member, sinceYear: '2025', referralCode: 'MARC-P3', referredById: thomas.id },
  });
  // Inès is Léa's filleule (joined via her referral link) → showcases the referral reward.
  const ines = await db.user.create({
    data: { email: 'ines@michelin.plus', passwordHash: hash, name: 'Inès Caron', role: Role.member, sinceYear: '2025', referralCode: 'INES-C9', referredById: lea.id, createdAt: daysAgo(20) },
  });

  // ── Léa — the demo persona ──────────────────────────────────────────────
  // Real loyalty data so every dashboard stat is computed, not hardcoded:
  //   · km this month (6 rides incl. a 5-day streak) > km last month (3 rides) → +% delta
  //   · current streak = 5 consecutive days · 1 referral (Inès) · 1 reward already claimed
  // Lifetime ≈ 12 838 → Titane, ~78% toward Carbone, so activating CARBON-CDM (3 000)
  // crosses into Carbone live and fires the reward pop-up.
  //
  // Strava rides — last month (delta baseline) + this month (incl. recent 5-day streak).
  const leaRides = [
    { name: 'Sortie longue · Mont Ventoux', km: 58.0, elevation: 1620, date: daysAgo(38) },
    { name: 'Sortie route · Gorges du Verdon', km: 51.0, elevation: 980, date: daysAgo(34) },
    { name: 'Gravel · Plateau de Valensole', km: 43.0, elevation: 540, date: daysAgo(30) },
    { name: 'Sortie longue · Forêt de Rambouillet', km: 68.1, elevation: 720, date: daysAgo(10) },
    { name: 'Sortie gravel · Vallée de Chevreuse', km: 42.3, elevation: 1240, date: daysAgo(4) },
    { name: 'Boucle des Yvelines', km: 27.0, elevation: 410, date: daysAgo(3) },
    { name: 'Sortie matinale · Bois de Vincennes', km: 18.7, elevation: 180, date: daysAgo(2) },
    { name: 'Gravel · Plateau de Saclay', km: 31.2, elevation: 360, date: daysAgo(1) },
    { name: 'Sortie récup · Coulée verte', km: 24.5, elevation: 150, date: daysAgo(0) },
  ];
  await db.pointsEntry.createMany({
    data: [
      ...leaRides.map((r) => ({ userId: lea.id, amount: Math.round(r.km * 10), type: PointsType.km, label: r.name, createdAt: r.date })),
      { userId: lea.id, amount: 2000, type: PointsType.km, label: 'Sorties antérieures (import Strava)', createdAt: daysAgo(75) },
      { userId: lea.id, amount: 2000, type: PointsType.purchase, label: 'Achat activé · Power Cup 700×28', createdAt: thisMonth(12) },
      { userId: lea.id, amount: 4200, type: PointsType.purchase, label: 'Achats antérieurs Michelin', createdAt: daysAgo(90) },
      { userId: lea.id, amount: 1000, type: PointsType.referral, label: 'Parrainage · Inès Caron', createdAt: daysAgo(20) },
    ],
  });
  await db.activity.createMany({
    data: [
      ...leaRides.map((r) => ({ userId: lea.id, name: r.name, distanceKm: r.km, elevation: r.elevation, pointsAwarded: Math.round(r.km * 10), source: ActivitySource.strava_mock, date: r.date })),
      { userId: lea.id, name: 'Achat activé · Power Cup 700×28', distanceKm: 0, elevation: 0, pointsAwarded: 2000, source: ActivitySource.purchase, date: thisMonth(12) },
      { userId: lea.id, name: 'Palier atteint · Titane', distanceKm: 0, elevation: 0, pointsAwarded: 0, source: ActivitySource.tier, date: daysAgo(45) },
    ],
  });

  // Thomas → Carbone (20 400)
  await db.pointsEntry.createMany({
    data: [
      { userId: thomas.id, amount: 12000, type: PointsType.purchase, label: 'Ventes & achats ambassadeur', createdAt: daysAgo(120) },
      { userId: thomas.id, amount: 6400, type: PointsType.km, label: 'Kilomètres ambassadeur', createdAt: daysAgo(40) },
      { userId: thomas.id, amount: 2000, type: PointsType.referral, label: 'Parrainages clan', createdAt: daysAgo(10) },
    ],
  });
  await db.ambassadorProfile.create({
    data: { userId: thomas.id, code: 'VIDAL-LYON', kind: 'ambassador', commissionPct: 12, salesCount: 87, ytdAmount: 2480, audience: 14200 },
  });
  // Sofia = micro-ambassadrice (chef de club) : commission moindre, communauté locale.
  await db.ambassadorProfile.create({
    data: { userId: sofia.id, code: 'SOFIA-CLUB', kind: 'micro', commissionPct: 6, salesCount: 12, ytdAmount: 240, audience: 860 },
  });

  await db.pointsEntry.createMany({
    data: [
      { userId: sofia.id, amount: 8200, type: PointsType.km, label: 'Kilomètres' },
      { userId: marc.id, amount: 4300, type: PointsType.km, label: 'Kilomètres' },
      { userId: ines.id, amount: 3100, type: PointsType.km, label: 'Kilomètres' },
    ],
  });

  // Léa starts WITHOUT a clan on purpose → the demo shows her joining "Gravel Lyon"
  // live via Thomas's code VIDAL-LYON (real ClanMember write, leaderboard updates).
  const clan = await db.clan.create({ data: { name: 'Gravel Lyon', ambassadorUserId: thomas.id } });
  await db.clanMember.createMany({
    data: [
      { clanId: clan.id, userId: thomas.id, km: 1842 },
      { clanId: clan.id, userId: sofia.id, km: 1610 },
      { clanId: clan.id, userId: marc.id, km: 1320 },
      { clanId: clan.id, userId: ines.id, km: 1204 },
    ],
  });

  await db.reward.createMany({
    data: [
      { title: 'Power CDM — Série numérotée', image: '/tiers/tires-flockes.png', tierRequired: 'Carbone', cost: 9000, editionNumber: 42, editionTotal: 500, kind: RewardKind.edition },
      { title: 'Pneus flockés — Édition Léa', image: '/tiers/tires-flockes.png', tierRequired: 'Carbone', cost: 12000, editionNumber: 7, editionTotal: 100, kind: RewardKind.edition },
      { title: 'Gourde Équipe Romain Bardet', image: '/rewards/gourde-bardet.png', tierRequired: 'Titane', cost: 1500, kind: RewardKind.goodie },
      { title: 'Pack stickers Michelin+', image: '/rewards/stickers.png', tierRequired: 'Aluminium', cost: 400, kind: RewardKind.goodie },
      { title: 'Casquette Michelin+ · L’Exception', image: '/rewards/casquette-michelin.png', tierRequired: 'Aluminium', cost: 800, kind: RewardKind.goodie },
      { title: 'T-shirt Michelin+ · L’Exception', image: '/rewards/maillot-michelin.png', tierRequired: 'Titane', cost: 3200, kind: RewardKind.goodie },
      { title: 'Weekend VIP course Michelin', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=70&sat=-100', tierRequired: 'Carbone', cost: 18000, kind: RewardKind.experience },
    ],
  });

  // Léa has already claimed one goodie → dashboard "Récompenses" reads 1 (real), not 0.
  const stickers = await db.reward.findFirst({ where: { title: 'Pack stickers Michelin+' } });
  if (stickers) {
    await db.redemption.create({ data: { userId: lea.id, rewardId: stickers.id, createdAt: daysAgo(6) } });
  }

  await db.cardCode.createMany({
    data: [
      { code: 'GRIP-2000', kind: CardKind.activation, pointsValue: 2000, productLabel: 'Power Cup 700×28' },
      { code: 'MICH-CLASSIC', kind: CardKind.activation, pointsValue: 1500, productLabel: 'Power Road Classic' },
      { code: 'CARBON-CDM', kind: CardKind.activation, pointsValue: 3000, productLabel: 'Power CDM Carbone' },
      { code: 'PILOT-SPORT', kind: CardKind.activation, pointsValue: 2500, productLabel: 'Pilot Sport Vélo' },
      { code: 'AMBASS-2026', kind: CardKind.ambassador, pointsValue: 5000, productLabel: 'Pack ambassadeur' },
    ],
  });

  const season = await db.season.create({
    data: {
      name: "L'Ascension",
      endsAt: daysAgo(-60),
      maxPoints: 25000,
      rewards: {
        create: [
          { stage: 14, title: 'T-shirt édition saison', threshold: 7000, image: '/rewards/maillot-michelin.png', epic: false },
          { stage: 20, title: 'Power Cup Carbone #042', threshold: 10000, image: '/tiers/tires-flockes.png', epic: true },
          { stage: 50, title: 'Pneus signés + Weekend VIP', threshold: 25000, image: '/tiers/tires-flockes.png', epic: true },
        ],
      },
      missions: {
        create: [
          { title: 'Roule 100 km cette semaine', reward: '+500 pts', points: 500 },
          { title: 'Active une carte produit', reward: '+2 000 pts', points: 2000 },
          { title: 'Invite un ami au clan', reward: '+1 000 pts', points: 1000 },
        ],
      },
    },
  });
  await db.seasonProgress.create({ data: { userId: lea.id, seasonId: season.id, seasonPoints: 7400 } });
  await db.seasonProgress.create({ data: { userId: thomas.id, seasonId: season.id, seasonPoints: 19800 } });

  return { lea: lea.id, thomas: thomas.id };
}
