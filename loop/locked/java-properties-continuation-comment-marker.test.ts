import { describe, it, expect } from 'vitest';
import { parseGhidraJavaProperties } from '../../../src/ghidra/GhidraJavaProperties.js';

describe('Java properties comment markers on continuation lines', () => {
  it('retains a key beginning with a comment marker after an empty continuation', () => {
    const parsed = parseGhidraJavaProperties('\\\n  #key=value\n\\\n\t!other=second\n');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);
    expect([...parsed.value.entries()]).toEqual([
      ['#key', 'value'],
      ['!other', 'second'],
    ]);
  });

  it('still ignores comment markers at the start of ordinary natural lines', () => {
    const parsed = parseGhidraJavaProperties('  #ignored=value\n\t!ignored=second\nkey=value\n');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);
    expect([...parsed.value.entries()]).toEqual([['key', 'value']]);
  });
});
