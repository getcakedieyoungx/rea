import { describe, expect, it } from 'vitest';
import {
  artifactDecompressionBudgetBytes,
  MINIMUM_ARTIFACT_DECOMPRESSION_BYTES,
} from '../../../src/domain/artifactDecompressionBudget.js';

describe('artifact decompression budget input validation', () => {
  it('returns the floor budget for a non-numeric compressed size', () => {
    expect(artifactDecompressionBudgetBytes(Number.NaN)).toBe(
      MINIMUM_ARTIFACT_DECOMPRESSION_BYTES,
    );
  });

  it('returns the floor budget for an infinite compressed size while keeping finite scaling', () => {
    expect(artifactDecompressionBudgetBytes(Number.POSITIVE_INFINITY)).toBe(
      MINIMUM_ARTIFACT_DECOMPRESSION_BYTES,
    );
    expect(artifactDecompressionBudgetBytes(1024 * 1024)).toBe(
      1024 * 1024 * 500,
    );
  });
});