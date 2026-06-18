// Michelin+ — Grip · pure stat math for the dashboard (no DB, fully unit-testable).

const DAY_MS = 86400000;

/** Calendar-day index (local midnight), so two timestamps on the same day collapse. */
function dayKey(date: Date): number {
  return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / DAY_MS);
}

/**
 * Current run of consecutive days (ending today or yesterday) with ≥1 ride.
 * The streak is "alive" only if there's a ride today or yesterday; otherwise 0.
 */
export function currentStreak(rideDates: Date[], today: Date = new Date()): number {
  if (rideDates.length === 0) return 0;
  const days = new Set(rideDates.map(dayKey));
  const todayKey = dayKey(today);
  let cursor = days.has(todayKey) ? todayKey : days.has(todayKey - 1) ? todayKey - 1 : null;
  if (cursor === null) return 0;
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor--;
  }
  return streak;
}

/**
 * Rounded percent change of `current` vs `previous`. Returns null when there is
 * no positive baseline (`previous <= 0`), since a delta against zero is undefined.
 */
export function pctDelta(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
