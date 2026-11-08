import { describe, it, expect } from 'vitest';

import { ghidraLanguageIdSchema } from '../../../src/config/ghidraLanguageOverride.js';

const accepts = (value: string): boolean =>
  ghidraLanguageIdSchema.safeParse(value).success;

describe('ghidraLanguageIdSchema stock .ldefs spellings', () => {
  it('accepts slashes inside the processor field', () => {
    // Stock M16C/60.ldefs spells the processor "M16C/60".
    expect(accepts('M16C/60:LE:16:default')).toBe(true);
    expect(accepts('M16C/60:BE:16:default')).toBe(true);
  });

  it('accepts LEBE for ARM BE8 and still rejects malformed identifiers', () => {
    expect(accepts('ARM:LEBE:32:v8')).toBe(true);
    // Strictness that must survive the fix.
    expect(accepts('x86:XX:32:default')).toBe(false);
    expect(accepts('x86:LE:0:default')).toBe(false);
    expect(accepts('x86:LE:32:')).toBe(false);
    expect(accepts('x86:LE:32: default')).toBe(false);
  });
});