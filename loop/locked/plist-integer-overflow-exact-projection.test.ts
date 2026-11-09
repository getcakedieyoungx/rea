import { describe, it, expect } from 'vitest';
import {
  createPlistNumberCollector,
  createPlistNumberProjection,
} from '../../../src/domain/apple/plistNumbers.js';

describe('exact plist integer projection beyond the finite Number range', () => {
  it('preserves an unambiguous integer even when Number conversion overflows', () => {
    const exact = 10n ** 400n;
    const collector = createPlistNumberCollector();
    collector.integer(exact);
    const projection = createPlistNumberProjection(collector.result());

    expect(Number(exact)).toBe(Number.POSITIVE_INFINITY);
    expect(projection.project(Number(exact))).toEqual({
      $plist_type: 'integer',
      decimal: exact.toString(),
    });
  });
});
