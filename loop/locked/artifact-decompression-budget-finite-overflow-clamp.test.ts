import { describe, it, expect } from 'vitest';

import {
  artifactDecompressionBudgetBytes,
  ARTIFACT_DECOMPRESSION_RATIO,
  MINIMUM_ARTIFACT_DECOMPRESSION_BYTES,
} from '../../../src/domain/artifactDecompressionBudget.js';

describe('artifact decompression budget finite overflow', () => {
  it('keeps the ceiling finite for a finite but enormous compressed size', () => {
    // Math.floor(Number.MAX_VALUE) * 500 overflows to Infinity, so the
    // decompression ceiling is silently not applied at all for that input.
    const budget = artifactDecompressionBudgetBytes(Number.MAX_VALUE);

    expect(Number.isFinite(budget)).toBe(true);
    expect(budget).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('still scales finite archives and keeps the floor for non-finite input', () => {
    expect(artifactDecompressionBudgetBytes(1024 * 1024)).toBe(
      1024 * 1024 * ARTIFACT_DECOMPRESSION_RATIO,
    );
    expect(Number.isFinite(artifactDecompressionBudgetBytes(1e300))).toBe(true);
    expect(artifactDecompressionBudgetBytes(Number.NaN)).toBe(
      MINIMUM_ARTIFACT_DECOMPRESSION_BYTES,
    );
    expect(artifactDecompressionBudgetBytes(Number.POSITIVE_INFINITY)).toBe(
      MINIMUM_ARTIFACT_DECOMPRESSION_BYTES,
    );
  });
});