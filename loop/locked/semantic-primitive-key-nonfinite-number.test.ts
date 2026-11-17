import { describe, it, expect } from 'vitest';

import { semanticPrimitiveKey } from '../../../src/domain/javascript/javascriptSemanticProvenance.js';

describe('semanticPrimitiveKey distinctness for non-finite numbers', () => {
  it('gives NaN and both infinities separate keys', () => {
    // JSON.stringify renders NaN, Infinity and -Infinity all as "null", so the
    // current implementation collapses three distinct primitives into one key.
    const keys = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].map(
      (value) => semanticPrimitiveKey(value),
    );

    expect(new Set(keys).size).toBe(3);
  });

  it('keeps the type prefix and the finite-number encoding', () => {
    expect(semanticPrimitiveKey(1)).toBe('number:1');
    expect(semanticPrimitiveKey(-0.5)).toBe('number:-0.5');
    expect([semanticPrimitiveKey(Number.NaN), semanticPrimitiveKey(Number.POSITIVE_INFINITY)]).not.toContain(
      semanticPrimitiveKey(null),
    );
  });
});