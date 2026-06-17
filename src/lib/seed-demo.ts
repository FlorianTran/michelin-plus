// Michelin+ — Grip · canonical demo seed (shared by prisma/seed.ts + /api/debug/reset).
// Léa (member, Titane), Thomas (ambassador, Carbone), clan "Gravel Lyon" (5),
// rewards catalogue (numbered editions + gourde Bardet), activation codes, season.
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
  const ines = await db.user.create({
    data: { email: 'ines@michelin.plus', passwordHash: hash, name: 'Inès Caron', role: Role.member, sinceYear: '2025', referralCode: 'INES-C9' },
  });

  // Léa lifetime 12 480 → Titane (km 6 280 · purchases 6 200)
  await db.pointsEntry.createMany({
    data: [
      { userId: lea.id, amount: 423, type: PointsType.km, label: 'Sortie gravel · Vallée de Chevreuse', createdAt: thisMonth(15) },
      { userId: lea.id, amount: 681, type: PointsType.km, label: 'Sortie route · Boucle des Yvelines', createdAt: thisMonth(14) },
      { userId: lea.id, amount: 736, type: PointsType.km, label: 'Sortie longue · Forêt de Rambouillet', createdAt: thisMonth(8) },
      { userId: lea.id, amount: 4440, type: PointsType.km, label: 'Sorties antérieures (Strava)', createdAt: daysAgo(60) },
      { userId: lea.id, amount: 2000, type: PointsType.purchase, label: 'Achat activé · Power Cup 700×28', createdAt: thisMonth(12) },
      { userId: lea.id, amount: 4200, type: PointsType.purchase, label: 'Achats antérieurs Michelin', createdAt: daysAgo(90) },
    ],
  });
  await db.activity.createMany({
    data: [
      { userId: lea.id, name: 'Sortie gravel · Vallée de Chevreuse', distanceKm: 42.3, elevation: 1240, pointsAwarded: 423, source: ActivitySource.strava_mock, date: thisMonth(15) },
      { userId: lea.id, name: 'Sortie route · Boucle des Yvelines', distanceKm: 68.1, elevation: 720, pointsAwarded: 681, source: ActivitySource.strava_mock, date: thisMonth(14) },
      { userId: lea.id, name: 'Achat activé · Power Cup 700×28', distanceKm: 0, elevation: 0, pointsAwarded: 2000, source: ActivitySource.purchase, date: thisMonth(12) },
      { userId: lea.id, name: 'Palier atteint · Titane', distanceKm: 0, elevation: 0, pointsAwarded: 0, source: ActivitySource.tier, date: thisMonth(5) },
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
    data: { userId: thomas.id, code: 'VIDAL-LYON', commissionPct: 12, salesCount: 87, ytdAmount: 2480, audience: 14200 },
  });

  await db.pointsEntry.createMany({
    data: [
      { userId: sofia.id, amount: 8200, type: PointsType.km, label: 'Kilomètres' },
      { userId: marc.id, amount: 4300, type: PointsType.km, label: 'Kilomètres' },
      { userId: ines.id, amount: 3100, type: PointsType.km, label: 'Kilomètres' },
    ],
  });

  const clan = await db.clan.create({ data: { name: 'Gravel Lyon', ambassadorUserId: thomas.id } });
  await db.clanMember.createMany({
    data: [
      { clanId: clan.id, userId: thomas.id, km: 1842 },
      { clanId: clan.id, userId: sofia.id, km: 1610 },
      { clanId: clan.id, userId: lea.id, km: 1488 },
      { clanId: clan.id, userId: marc.id, km: 1320 },
      { clanId: clan.id, userId: ines.id, km: 1204 },
    ],
  });

  await db.reward.createMany({
    data: [
      { title: 'Power CDM — Série numérotée', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=70&sat=-100', tierRequired: 'Carbone', cost: 9000, editionNumber: 42, editionTotal: 500, kind: RewardKind.edition },
      { title: 'Pneus flockés — Édition Léa', image: '/tiers/tires-flockes.png', tierRequired: 'Carbone', cost: 12000, editionNumber: 7, editionTotal: 100, kind: RewardKind.edition },
      { title: 'Gourde Équipe Romain Bardet', image: '/rewards/gourde-bardet.png', tierRequired: 'Titane', cost: 1500, kind: RewardKind.goodie },
      { title: 'Pack stickers Michelin+', image: '/rewards/stickers.png', tierRequired: 'Aluminium', cost: 400, kind: RewardKind.goodie },
      { title: 'Casquette de course', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=70&sat=-100', tierRequired: 'Aluminium', cost: 800, kind: RewardKind.goodie },
      { title: 'Maillot édition saison', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=70&sat=-100', tierRequired: 'Titane', cost: 3200, kind: RewardKind.goodie },
      { title: 'Weekend VIP course Michelin', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=70&sat=-100', tierRequired: 'Carbone', cost: 18000, kind: RewardKind.experience },
    ],
  });

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
          { stage: 14, title: 'T-shirt édition saison', threshold: 7000, image: '/rewards/stickers.png', epic: false },
          { stage: 20, title: 'Power Cup Carbone #042', threshold: 10000, image: '/tiers/tires-flockes.png', epic: true },
          { stage: 50, title: 'Pneus signés + Weekend VIP', threshold: 25000, image: '/bardet/bardet-road.jpg', epic: true },
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
