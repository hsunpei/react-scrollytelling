import { clampScrolledRatio } from '../scrolling';

describe('clampScrolledRatio()', () => {
  it('should return 0 when the ratio is negative', () => {
    expect(clampScrolledRatio(-0.5)).toBe(0);
  });

  it('should return 1 when the ratio is greater than 1', () => {
    expect(clampScrolledRatio(1.5)).toBe(1);
  });

  it('should return the ratio when it is between 0 and 1', () => {
    expect(clampScrolledRatio(0.5)).toBe(0.5);
  });
});
