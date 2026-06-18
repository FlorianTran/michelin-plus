import { describe, it, expect } from 'vitest';
import { pickHeadlineReward, type RewardCandidate } from './rewards';

function reward(over: Partial<RewardCandidate>): RewardCandidate {
  return {
    id: 'r',
    title: 'Reward',
    image: null,
    cost: 0,
    kind: 'goodie',
    editionNumber: null,
    editionTotal: null,
    ...over,
  };
}

describe('pickHeadlineReward — most prestigious unredeemed reward', () => {
  it('prefers a numbered edition even when a costlier goodie exists', () => {
    const out = pickHeadlineReward([
      reward({ id: 'goodie', title: 'T-shirt', cost: 12000, kind: 'goodie' }),
      reward({ id: 'edition', title: 'Pneus flockés', cost: 9000, kind: 'edition', editionNumber: 7, editionTotal: 100 }),
    ]);
    expect(out?.id).toBe('edition');
    expect(out?.edition).toBe('#007 / 100');
  });
  it('among editions, picks the highest cost', () => {
    const out = pickHeadlineReward([
      reward({ id: 'cheap', cost: 9000, kind: 'edition', editionNumber: 42, editionTotal: 500 }),
      reward({ id: 'dear', cost: 12000, kind: 'edition', editionNumber: 7, editionTotal: 100 }),
    ]);
    expect(out?.id).toBe('dear');
  });
  it('falls back to the highest-cost reward when no edition exists', () => {
    const out = pickHeadlineReward([
      reward({ id: 'cap', cost: 800, kind: 'goodie' }),
      reward({ id: 'tee', cost: 3200, kind: 'goodie' }),
    ]);
    expect(out?.id).toBe('tee');
    expect(out?.edition).toBeNull();
  });
  it('empty list → null', () => {
    expect(pickHeadlineReward([])).toBeNull();
  });
});
