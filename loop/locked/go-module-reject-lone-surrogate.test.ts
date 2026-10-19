import { describe, it, expect } from 'vitest';
import { parseGoModuleText } from '../../../src/go/GoModuleText.js';

describe('Go build setting Unicode validation', () => {
  it('preserves malformed quoted settings instead of silently replacing lone surrogates', () => {
    for (const surrogate of ['\ud800', '\udc00']) {
      const line = `build\tlabel="${surrogate}"`;
      const result = parseGoModuleText(`${line}\n`);
      expect(result.settings).toEqual([]);
      expect(result.unparsed_lines).toEqual([line]);
      expect(result.complete).toBe(false);
    }
  });

  it('retains valid supplementary characters and literal replacement characters', () => {
    const result = parseGoModuleText('build\tlabel="\ud83d\ude00\ufffd"\n');
    expect(result.settings).toEqual([{ key: 'label', value: '\ud83d\ude00\ufffd' }]);
    expect(result.unparsed_lines).toEqual([]);
    expect(result.complete).toBe(true);
  });
});
