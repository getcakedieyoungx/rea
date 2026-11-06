import { describe, it, expect } from 'vitest';
import { parseGoModuleText } from '../../../src/go/GoModuleText.js';

describe('Go module build-setting Unicode validity', () => {
  it('decodes an escape containing four hexadecimal digits', () => {
    const result = parseGoModuleText('build\tlabel="\\u0123"\n');
    expect(result.settings).toEqual([{ key: 'label', value: '\u0123' }]);
    expect(result.complete).toBe(true);
  });

  it('preserves a malformed quoted value instead of replacing its lone surrogate', () => {
    const line = 'build\tlabel="\ud800"';
    const result = parseGoModuleText(`${line}\n`);
    expect(result.settings).toEqual([]);
    expect(result.unparsed_lines).toEqual([line]);
    expect(result.complete).toBe(false);
  });
});
