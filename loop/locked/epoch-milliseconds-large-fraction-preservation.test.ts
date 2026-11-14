import { describe, it, expect } from 'vitest';
import { offsetDateTimeInstantFromEpochMilliseconds } from '../../../src/domain/offsetDateTime.js';

describe('epoch milliseconds beyond the safe-integer ceiling', () => {
  it('keeps epochSecond integral and carries the remainder in fraction', () => {
    // 9007199254740994 ms is exactly representable and above MAX_SAFE_INTEGER,
    // so the whole second must stay 9007199254740 and .994 must not be folded
    // into epochSecond (9007199254740.994 is not a whole second).
    expect(offsetDateTimeInstantFromEpochMilliseconds(9007199254740994)).toEqual({
      epochSecond: 9007199254740,
      fraction: '994',
    });
  });

  it('applies the same floor semantics to large negative instants', () => {
    expect(offsetDateTimeInstantFromEpochMilliseconds(-9007199254740994)).toEqual({
      epochSecond: -9007199254741,
      fraction: '006',
    });
    // In-range behaviour must be unchanged.
    expect(offsetDateTimeInstantFromEpochMilliseconds(-1)).toEqual({
      epochSecond: -1,
      fraction: '999',
    });
  });
});