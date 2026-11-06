import { describe, it, expect } from 'vitest';
import { analysisTextPage } from '../../../src/domain/analysisView/analysisViewText.js';

describe('analysisTextPage integer UTF-16 coordinates', () => {
  it('rejects a fractional offset instead of reporting coverage for a rounded slice', () => {
    const result = analysisTextPage('abcdef', 1.5, 2);
    expect(result.ok).toBe(false);
  });

  it('rejects a fractional limit instead of claiming a fraction of a code unit', () => {
    const result = analysisTextPage('abcdef', 0, 2.5);
    expect(result.ok).toBe(false);
  });
});
