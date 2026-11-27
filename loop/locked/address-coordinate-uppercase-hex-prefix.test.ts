import { describe, it, expect } from 'vitest';

import { addressCoordinate } from '../../../src/domain/native/addressCoordinate.js';

// The offset spelling is hexadecimal, so neither the prefix nor the digits
// carry meaning in their case: `BigInt('0X1F')` is 31n exactly like
// `BigInt('0x1f')`. The canonical writer emits lowercase, but a parser that
// rejects the uppercase spelling silently discards a coordinate the rest of
// the module treats as the same address (see the uppercase-digit contract).
describe('addressCoordinate uppercase hexadecimal prefix', () => {
  it('accepts an uppercase 0X prefix as the same offset as 0x', () => {
    // Current code matches the offset against /^0x[0-9a-f]+$/u without the
    // `i` flag, so this returns null instead of the parsed coordinate.
    expect(addressCoordinate('GS:0X1F')).toEqual({
      space: 'GS',
      offset: 31n,
    });
    expect(addressCoordinate('0XABCDEF')).toEqual({
      space: null,
      offset: 11259375n,
    });
    expect(addressCoordinate('GS:0X1f')).toEqual(addressCoordinate('GS:0x1f'));
  });

  it('still parses the canonical lowercase spelling and rejects malformed offsets', () => {
    expect(addressCoordinate('GS:0x1f')).toEqual({ space: 'GS', offset: 31n });
    expect(addressCoordinate('0x0')).toEqual({ space: null, offset: 0n });
    expect(addressCoordinate('GS:1F')).toBeNull();
    expect(addressCoordinate('GS:0x1G')).toBeNull();
  });
});