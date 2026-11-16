import { describe, it, expect } from 'vitest';

import { parseKunaInventory } from '../../../src/kuna/KunaProjectFiles.js';

const inventory = (addressHex: string): string =>
  JSON.stringify({
    functions: [
      { name: 'main', address_hex: addressHex, aliases: [], size: 4 },
    ],
  });

describe('Kuna callable inventory address identity', () => {
  it('rejects a non-canonical zero-padded address instead of adopting it', () => {
    // Every other Kuna surface (string inventory, reference files,
    // normalizeKunaAddress) treats an address as the canonical minimal
    // lowercase hex form of a u64. Accepting `0x00001000` here yields an
    // identity that never equals the `0x1000` the same tool reports
    // elsewhere, and compareKunaAddresses then mis-orders it by length.
    // Current code returns { ok: true } because the regex is /^0x[0-9a-f]+$/u.
    const padded = parseKunaInventory(inventory('0x00001000'));
    expect(padded).toMatchObject({ ok: false });

    // A canonical address must still be accepted.
    expect(parseKunaInventory(inventory('0x1000'))).toEqual({
      ok: true,
      value: [{ name: 'main', address: '0x1000', aliases: [], size: 4 }],
    });
  });

  it('rejects an address wider than a 64-bit value', () => {
    // 17 hex digits cannot denote a u64, yet the loose pattern accepts it.
    expect(parseKunaInventory(inventory('0x10000000000000000'))).toMatchObject({
      ok: false,
    });
  });
});
