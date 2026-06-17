import { describe, it, expect } from 'vitest';
import {
  tierForPoints,
  tierProgress,
  detectTierUp,
  nextTier,
  pointsForKm,
  POINTS_PER_KM,
  TIERS,
} from './tiers';

describe('tierForPoints — 3 paliers (Aluminium / Titane / Carbone)', () => {
  it('floors at Aluminium for 0 / negative', () => {
    expect(tierForPoints(0).name).toBe('Aluminium');
    expect(tierForPoints(-500).name).toBe('Aluminium');
  });
  it('Aluminium band 0–4999', () => {
    expect(tierForPoints(4999).name).toBe('Aluminium');
  });
  it('Titane band 5000–14999', () => {
    expect(tierForPoints(5000).name).toBe('Titane');
    expect(tierForPoints(12480).name).toBe('Titane'); // Léa
    expect(tierForPoints(14999).name).toBe('Titane');
  });
  it('Carbone at 15000+', () => {
    expect(tierForPoints(15000).name).toBe('Carbone');
    expect(tierForPoints(20400).name).toBe('Carbone'); // Thomas
    expect(tierForPoints(1_000_000).name).toBe('Carbone');
  });
  it('boundaries are inclusive on the lower bound', () => {
    for (const t of TIERS) {
      expect(tierForPoints(t.min).name).toBe(t.name);
    }
  });
});

describe('nextTier', () => {
  it('points up the ladder', () => {
    expect(nextTier(0)?.name).toBe('Titane');
    expect(nextTier(12480)?.name).toBe('Carbone');
  });
  it('null at the top', () => {
    expect(nextTier(20000)).toBeNull();
  });
});

describe('tierProgress — dashboard gauge', () => {
  it('Léa at 12 480 → Titane, 2 520 to Carbone', () => {
    const p = tierProgress(12480);
    expect(p.current.name).toBe('Titane');
    expect(p.next?.name).toBe('Carbone');
    expect(p.remaining).toBe(2520);
    expect(p.max).toBe(15000);
    expect(p.pct).toBeGreaterThan(70);
    expect(p.pct).toBeLessThan(80);
  });
  it('Aluminium midpoint', () => {
    const p = tierProgress(2500);
    expect(p.current.name).toBe('Aluminium');
    expect(p.pct).toBeCloseTo(50, 0);
    expect(p.remaining).toBe(2500);
  });
  it('Carbone (top) has no remaining and caps pct at 100', () => {
    const p = tierProgress(30000);
    expect(p.next).toBeNull();
    expect(p.remaining).toBe(0);
    expect(p.pct).toBeLessThanOrEqual(100);
  });
});

describe('detectTierUp', () => {
  it('fires when crossing a boundary', () => {
    expect(detectTierUp(4800, 5200)?.name).toBe('Titane');
    expect(detectTierUp(14000, 16000)?.name).toBe('Carbone');
  });
  it('does not fire within the same band', () => {
    expect(detectTierUp(6000, 7000)).toBeNull();
  });
  it('does not fire on a downward move', () => {
    expect(detectTierUp(16000, 14000)).toBeNull();
  });
});

describe('pointsForKm — Strava mock conversion', () => {
  it('uses ~10 pts/km', () => {
    expect(POINTS_PER_KM).toBe(10);
    expect(pointsForKm(42.3)).toBe(423);
    expect(pointsForKm(68.1)).toBe(681);
    expect(pointsForKm(0)).toBe(0);
    expect(pointsForKm(-5)).toBe(0);
  });
});

describe('activation arithmetic (code → points → tier-up)', () => {
  it('GRIP-2000 on a near-Titane member triggers the tier-up', () => {
    const before = 4200;
    const codeValue = 2000; // GRIP-2000-ish
    const after = before + codeValue;
    expect(tierForPoints(before).name).toBe('Aluminium');
    expect(tierForPoints(after).name).toBe('Titane');
    expect(detectTierUp(before, after)?.name).toBe('Titane');
  });
  it('a small code inside a band does not change tier', () => {
    const before = 6000;
    const after = before + 1500;
    expect(detectTierUp(before, after)).toBeNull();
  });
});
