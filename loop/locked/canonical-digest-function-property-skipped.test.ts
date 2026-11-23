import { describe, it, expect } from 'vitest';
import { digestCanonicalValue } from '../../../src/domain/canonicalDigest.js';

describe('canonical digest skips function-valued object properties', () => {
  it('hashes an object with only a function property like the empty object', () => {
    const withFunction = digestCanonicalValue({ a: () => 0 });
    const empty = digestCanonicalValue({});

    expect(withFunction).toBe(empty);
  });

  it('drops a function property alongside real values instead of emitting invalid JSON', () => {
    const mixed = digestCanonicalValue({
      a: () => 0,
      b: 1,
      c: 'text',
    });
    const expected = digestCanonicalValue({ b: 1, c: 'text' });

    expect(mixed).toBe(expected);
  });
});