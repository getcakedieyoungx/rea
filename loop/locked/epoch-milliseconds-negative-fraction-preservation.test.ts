import { describe, it, expect } from 'vitest';
import {
  offsetDateTimeInstantFromEpochMilliseconds,
  parseOffsetDateTimeInstant,
} from '../../../src/domain/offsetDateTime.js';

describe('negative fractional epoch milliseconds', () => {
  it('preserves a tiny negative fraction instead of rounding it to a full second earlier', () => {
    const expected = parseOffsetDateTimeInstant(
      '1969-12-31T23:59:59.999999999999999999Z',
    );
    expect(offsetDateTimeInstantFromEpochMilliseconds(-1e-15)).toEqual(expected);
  });

  it('continues to normalize ordinary negative milliseconds', () => {
    expect(offsetDateTimeInstantFromEpochMilliseconds(-1)).toEqual({
      epochSecond: -1,
      fraction: '999',
    });
  });
});
