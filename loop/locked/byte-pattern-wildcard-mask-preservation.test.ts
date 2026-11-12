import { describe, it, expect } from 'vitest';

import { parseBytePattern } from '../../../src/domain/native/bytePattern.js';

describe('byte pattern mask on wildcard bytes', () => {
  it('keeps the caller mask for a byte written as ??', () => {
    // Current code forces masks[0] to 0 for a "??" byte, discarding "f0".
    const parsed = parseBytePattern('?? aa', 'f0 ff');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.bytes).toEqual([0x00, 0xaa]);
    expect(parsed.value.masks).toEqual([0xf0, 0xff]);
  });

  it('admits a wildcard byte whose explicit mask constrains its high nibble', () => {
    // Current code rejects this with "Pattern must constrain at least one bit".
    const parsed = parseBytePattern('??', 'f0');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.bytes).toEqual([0x00]);
    expect(parsed.value.masks).toEqual([0xf0]);
  });
});