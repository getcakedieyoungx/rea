import { describe, it, expect } from 'vitest';
import { addressCoordinate } from '../../../src/domain/native/addressCoordinate.js';

describe('addressCoordinate address-space validation', () => {
  it('rejects a value that joins two offsets with the space separator', () => {
    expect(addressCoordinate('GS:0x10:0x2f')).toBeNull();
    expect(addressCoordinate('0x10:0x20')).toBeNull();
  });

  it('still parses one space and one offset', () => {
    expect(addressCoordinate('GS:0x1f')).toEqual({ space: 'GS', offset: 31n });
    expect(addressCoordinate('0xabcdef')).toEqual({
      space: null,
      offset: 11259375n,
    });
  });
});