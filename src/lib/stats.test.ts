import { describe, it, expect } from 'vitest';
import { currentStreak, pctDelta } from './stats';

// Fixed reference "today" so the streak rules are deterministic regardless of run date.
const TODAY = new Date(2026, 5, 18); // 2026-06-18, local
function day(offset: number, hour = 9): Date {
  return new Date(2026, 5, 18 - offset, hour);
}

describe('currentStreak — consecutive ride days ending today/yesterday', () => {
  it('counts 5 consecutive days ending today → 5', () => {
    const rides = [day(0), day(1), day(2), day(3), day(4)];
    expect(currentStreak(rides, TODAY)).toBe(5);
  });
  it('resets at a gap — only the run touching today/yesterday counts', () => {
    // rides today, yesterday, then a gap (day 2 missing), then days 3 & 4
    const rides = [day(0), day(1), day(3), day(4)];
    expect(currentStreak(rides, TODAY)).toBe(2);
  });
  it('stays alive when the latest ride was yesterday', () => {
    const rides = [day(1), day(2), day(3)];
    expect(currentStreak(rides, TODAY)).toBe(3);
  });
  it('is dead when the latest ride is older than yesterday', () => {
    const rides = [day(2), day(3), day(4)];
    expect(currentStreak(rides, TODAY)).toBe(0);
  });
  it('collapses multiple rides on the same day into one', () => {
    const rides = [day(0, 7), day(0, 19), day(1, 12)];
    expect(currentStreak(rides, TODAY)).toBe(2);
  });
  it('empty history → 0', () => {
    expect(currentStreak([], TODAY)).toBe(0);
  });
});

describe('pctDelta — rounded percent change vs a baseline', () => {
  it('positive growth', () => {
    expect(pctDelta(150, 100)).toBe(50);
  });
  it('negative change', () => {
    expect(pctDelta(80, 100)).toBe(-20);
  });
  it('rounds to the nearest integer percent', () => {
    expect(pctDelta(127, 100)).toBe(27);
    expect(pctDelta(1015, 900)).toBe(13); // 12.78 → 13
  });
  it('null when there is no positive baseline', () => {
    expect(pctDelta(120, 0)).toBeNull();
    expect(pctDelta(120, -10)).toBeNull();
  });
});
