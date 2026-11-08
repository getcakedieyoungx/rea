import { describe, it, expect } from 'vitest';
import { digestCanonicalValue } from '../../../src/domain/canonicalDigest.js';

describe('digestCanonicalValue sparse array serialization', () => {
  it('writes deleted array slots as null instead of emitting an empty JSON element', () => {
    const sparse: (number | null)[] = [1, 2, 3];
    delete sparse[1];
    expect(digestCanonicalValue(sparse)).toBe(
      digestCanonicalValue([1, null, 3]),
    );
  });

  it('matches the dense null form for trailing holes of a truncated array', () => {
    const trailing: (number | null)[] = [1];
    trailing.length = 3;
    expect(digestCanonicalValue(trailing)).toBe(
      digestCanonicalValue([1, null, null]),
    );
    expect(digestCanonicalValue(trailing)).toBe(
      digestCanonicalValue(trailing),
    );
  });
});