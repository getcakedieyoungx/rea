import { describe, it, expect } from 'vitest';

import { compositeKey } from '../../../src/domain/unicodeCodePointOrder.js';

/**
 * `compositeKey` is documented as the single collision-free composite key for
 * deduplication and sorting ("a JSON tuple escapes every component"). That is
 * false for the values `JSON.stringify` cannot represent: inside an array it
 * serializes `undefined`, `NaN`, `Infinity` and functions as `null`, so
 * `["probe", undefined]` and `["probe", null]` produce the same key. Callers
 * such as `webBundleAnalyzerInspection` dedupe whole records by this key, so
 * two distinct records silently collapse into one.
 */
describe('composite key encoding', () => {
  it('keeps a part JSON cannot represent distinct from a null part', () => {
    expect(compositeKey(['probe', undefined])).not.toBe(
      compositeKey(['probe', null]),
    );
    expect(compositeKey(['n', Number.NaN])).not.toBe(compositeKey(['n', null]));
    expect(compositeKey(['n', Number.POSITIVE_INFINITY])).not.toBe(
      compositeKey(['n', null]),
    );
    expect(compositeKey(['f', () => 1])).not.toBe(compositeKey(['f', null]));
  });

  it('keeps distinct representable parts distinct', () => {
    expect(compositeKey(['a', 1])).not.toBe(compositeKey(['a', '1']));
    expect(compositeKey(['a', 1])).not.toBe(compositeKey(['a', true]));
    expect(compositeKey(['a', null])).not.toBe(compositeKey(['a', 'null']));
    expect(compositeKey(['a\0b'])).not.toBe(compositeKey(['a', 'b']));
    expect(compositeKey(['a'])).not.toBe(compositeKey(['a', '']));
    expect(compositeKey(['a', 1])).toBe(compositeKey(['a', 1]));
  });
});
