import { describe, it, expect } from 'vitest';
import { referralCodeCandidate, referralLink, REFERRAL_BONUS } from './referral';

describe('referral codes', () => {
  it('derives a readable PREFIX-XXXX code from the first name', () => {
    const code = referralCodeCandidate('Léa Moreau');
    expect(code).toMatch(/^LEA-[A-Z0-9]{4}$/); // accents stripped, uppercased
  });
  it('handles names with no usable letters', () => {
    expect(referralCodeCandidate('123')).toMatch(/^MICH-[A-Z0-9]{4}$/);
  });
  it('avoids ambiguous characters (no O/0/1/I) in the suffix', () => {
    for (let i = 0; i < 40; i++) {
      const suffix = referralCodeCandidate('Test').split('-')[1];
      expect(suffix).not.toMatch(/[O01I]/);
    }
  });
});

describe('referralLink', () => {
  it('builds an absolute invite URL and trims a trailing slash', () => {
    expect(referralLink('LEA-2024', 'https://michelin.plus/')).toBe('https://michelin.plus/parrainage/LEA-2024');
    expect(referralLink('VIDAL-26', 'http://localhost:3000')).toBe('http://localhost:3000/parrainage/VIDAL-26');
  });
});

describe('referral bonus', () => {
  it('is a positive whole number of points', () => {
    expect(REFERRAL_BONUS).toBeGreaterThan(0);
    expect(Number.isInteger(REFERRAL_BONUS)).toBe(true);
  });
});
