import { describe, it, expect } from 'vitest';

import { addressCoordinate } from '../../../src/domain/native/addressCoordinate.js';

describe('canonical native address coordinates', () => {
  it('rejects an offset that carries a second address-space separator', () => {
    // Current code returns { space: 'a:0x10', offset: 32n } for this input.
    expect(addressCoordinate('a:0x10:0x20')).toBeNull();
    // Current code returns { space: '0x10', offset: 32n }: a space name that is itself an address.
    expect(addressCoordinate('0x10:0x20')).toBeNull();
  });

  it('still parses unqualified and single-separator coordinates', () => {
    expect(addressCoordinate('0x10')).toEqual({ space: null, offset: 16n });
    expect(addressCoordinate('overlay:0x10')).toEqual({
      space: 'overlay',
      offset: 16n,
    });
  });
});