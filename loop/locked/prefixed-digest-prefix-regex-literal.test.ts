import { describe, it, expect } from 'vitest';

import { prefixedDigestSchema } from '../../../src/domain/digests.js';

const DIGEST = 'a'.repeat(64);

describe('prefixedDigestSchema treats its prefix as literal text', () => {
  it('accepts only the literal prefix followed by a lowercase sha256', () => {
    const schema = prefixedDigestSchema('a.b');

    // The literal spelling is the identifier this family names.
    expect(schema.safeParse(`a.b_${DIGEST}`).success).toBe(true);

    // The prefix is data, not a regular expression: '.' must not match 'X'.
    // Currently fails: the schema builds /^a.b_[a-f0-9]{64}$/u and accepts this.
    expect(schema.safeParse(`aXb_${DIGEST}`).success).toBe(false);
  });

  it('still rejects wrong digests and wrong separators for a plain prefix', () => {
    const schema = prefixedDigestSchema('ev');

    expect(schema.safeParse(`ev_${DIGEST}`).success).toBe(true);
    expect(schema.safeParse(`ev_${DIGEST.toUpperCase()}`).success).toBe(false);
    expect(schema.safeParse(`evx_${DIGEST}`).success).toBe(false);
  });
});