import { describe, it, expect } from 'vitest';
import { addressCoordinate } from '../../../src/domain/native/addressCoordinate.js';

describe('addressCoordinate hex digit case', () => {
  it('accepts uppercase hexadecimal digits as the same address', () => {
    expect(addressCoordinate('GS:0x1F')).toEqual({ space: 'GS', offset: 31n });
    expect(addressCoordinate('0xABCDEF')).toEqual({
      space: null,
      offset: 11259375n,
    });
  });

  it('keeps canonical lowercase spelling and mixed-case digits equivalent', () => {
    expect(addressCoordinate('GS:0x1f')).toEqual({ space: 'GS', offset: 31n });
    expect(addressCoordinate('GS:0x1F')).toEqual(addressCoordinate('GS:0x1f'));
  });
});