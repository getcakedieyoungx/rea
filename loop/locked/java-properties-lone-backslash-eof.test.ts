import { describe, it, expect } from 'vitest';

import { parseGhidraJavaProperties } from '../../../src/ghidra/GhidraJavaProperties.js';

describe('Java properties trailing escape at EOF', () => {
  it('retains the empty property produced by a lone trailing backslash', () => {
    // Java Properties.load consumes the trailing backslash at EOF, but still
    // commits the logical property: both its key and value are empty strings.
    const parsed = parseGhidraJavaProperties('\\');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);
    // Currently fails: expected '', received undefined.
    expect(parsed.value.get('')).toBe('');
    expect([...parsed.value.entries()]).toEqual([['', '']]);
  });

  it('distinguishes a trailing escaped property from actual blank and comment lines', () => {
    const blank = parseGhidraJavaProperties('  \n# comment\n! comment\n');
    expect(blank.ok).toBe(true);
    if (!blank.ok) throw new Error(blank.error);
    expect(blank.value.size).toBe(0);

    const parsed = parseGhidraJavaProperties('ordinary=kept\n  \\');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);
    expect([...parsed.value.entries()]).toEqual([['ordinary', 'kept'], ['', '']]);
  });
});
