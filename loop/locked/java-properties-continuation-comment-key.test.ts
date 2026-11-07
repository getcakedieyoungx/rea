import { describe, it, expect } from 'vitest';
import { parseGhidraJavaProperties } from '../../../src/ghidra/GhidraJavaProperties.js';

describe('Java properties continuation lines', () => {
  it('keeps comment-marker keys when an empty first segment is continued', () => {
    for (const marker of ['#', '!']) {
      const result = parseGhidraJavaProperties('\\\n' + marker + 'key=value\n');
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.error);
      expect(result.value.get(marker + 'key')).toBe('value');
    }
  });

  it('still ignores natural comment lines and decodes escaped comment markers', () => {
    const result = parseGhidraJavaProperties('#comment=ignored\n!comment=ignored\n\\#key=value\n');
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect([...result.value]).toEqual([['#key', 'value']]);
  });
});
