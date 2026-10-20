import { describe, it, expect } from 'vitest';

import { parseBytePattern } from '../../../src/domain/native/bytePattern.js';

/**
 * `bytePatternFields` documents "Byte pairs, with whole-byte wildcards;
 * explicit masks can select individual bits". A `??` pair only frees the byte
 * *value*; the caller's mask still says which bits are compared. The current
 * parser throws the mask away for every `??` pair (`pair === "??" ? 0 : ...`),
 * so a pattern whose only constraint is expressed by a mask is rejected as
 * unconstrained, and a mixed pattern silently widens its wildcard byte to
 * "compare nothing" instead of "compare the masked bits".
 */
describe('byte pattern masks on whole-byte wildcards', () => {
  it('accepts a wildcard byte whose constraint comes from the mask', () => {
    const parsed = parseBytePattern('??', '0f');
    // Currently fails: ok is false with "Pattern must constrain at least one bit".
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error('wildcard byte with an explicit mask was rejected');
    expect(parsed.value.bytes).toEqual([0]);
    expect(parsed.value.masks).toEqual([0x0f]);
  });

  it('keeps the explicit mask of a wildcard byte inside a mixed pattern', () => {
    const parsed = parseBytePattern('?? ff', '0f f0');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error('mixed wildcard pattern was rejected');
    // Currently fails: masks are [0, 240] because the `??` mask is dropped.
    expect(parsed.value.bytes).toEqual([0, 0xff]);
    expect(parsed.value.masks).toEqual([0x0f, 0xf0]);
  });
});