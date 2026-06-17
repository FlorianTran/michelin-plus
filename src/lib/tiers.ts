// Michelin+ — Grip · loyalty engine (pure, framework-free → unit-testable)
// 3 paliers (locked decision): Aluminium / Titane / Carbone.

export type TierName = 'Aluminium' | 'Titane' | 'Carbone';

export interface Tier {
  name: TierName;
  /** inclusive lower bound of lifetime points */
  min: number;
  /** exclusive upper bound (Infinity for the top tier) */
  max: number;
  level: 1 | 2 | 3;
  /** counter/gauge tone */
  tone: 'energy' | 'prestige';
  perks: string[];
  blurb: string;
  /** flocked-tyre visual for this tier */
  visual: string;
}

export const TIERS: Tier[] = [
  {
    name: 'Aluminium',
    min: 0,
    max: 5000,
    level: 1,
    tone: 'energy',
    perks: ['Accès au club', 'Récompenses standard', 'Clan & classements'],
    blurb: "0 – 5 000 pts · l'entrée du club",
    visual: '/tiers/tires-flockes.png',
  },
  {
    name: 'Titane',
    min: 5000,
    max: 15000,
    level: 2,
    tone: 'energy',
    perks: ['Récompenses premium', 'Drops prioritaires', 'Missions de saison'],
    blurb: '5 000 – 15 000 pts · le confirmé',
    visual: '/tiers/tires-flockes.png',
  },
  {
    name: 'Carbone',
    min: 15000,
    max: Infinity,
    level: 3,
    tone: 'prestige',
    perks: ['Éditions numérotées', 'Statut ambassadeur', 'Événements VIP'],
    blurb: "15 000 pts + · l'élite, éditions numérotées",
    visual: '/tiers/tires-flockes.png',
  },
];

const TIER_ORDER: TierName[] = ['Aluminium', 'Titane', 'Carbone'];

/** Resolve the tier a member sits in for a given lifetime points total. */
export function tierForPoints(points: number): Tier {
  const p = Math.max(0, points || 0);
  // walk from the top so the highest matching band wins
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (p >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

export function tierByName(name: TierName): Tier {
  return TIERS.find((t) => t.name === name) ?? TIERS[0];
}

/** The next tier up, or null if already at the top. */
export function nextTier(points: number): Tier | null {
  const current = tierForPoints(points);
  const idx = TIER_ORDER.indexOf(current.name);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

export interface TierProgress {
  current: Tier;
  next: Tier | null;
  /** points within the current band (gauge value) */
  value: number;
  /** size of the current band (gauge max); for Carbone this is the band so far */
  max: number;
  /** points to reach the next tier; 0 at the top */
  remaining: number;
  /** 0..100 */
  pct: number;
}

/**
 * Gauge math for the dashboard tier bar.
 * For Aluminium/Titane the gauge runs across the band (min→max).
 * For Carbone (top) it shows points accumulated past the entry threshold.
 */
export function tierProgress(points: number): TierProgress {
  const p = Math.max(0, points || 0);
  const current = tierForPoints(p);
  const next = nextTier(p);

  if (!next) {
    // Carbone — no ceiling. Show progress within a symbolic +10k band past entry.
    const band = 10000;
    const value = p - current.min;
    return {
      current,
      next: null,
      value,
      max: current.min + band, // absolute scale for display parity with gauge label
      remaining: 0,
      pct: Math.min(100, (value / band) * 100),
    };
  }

  const value = p; // gauge label shows absolute points toward next.max
  const max = next.min;
  const remaining = Math.max(0, next.min - p);
  const span = next.min - current.min;
  const pct = Math.max(0, Math.min(100, ((p - current.min) / span) * 100));
  return { current, next, value, max, remaining, pct };
}

/** Did a points delta push the member into a higher tier? */
export function detectTierUp(before: number, after: number): Tier | null {
  const b = tierForPoints(before);
  const a = tierForPoints(after);
  return a.name !== b.name && a.min > b.min ? a : null;
}

/** Points awarded per kilometre ridden (Strava mock). */
export const POINTS_PER_KM = 10;

export function pointsForKm(km: number): number {
  return Math.round(Math.max(0, km) * POINTS_PER_KM);
}
