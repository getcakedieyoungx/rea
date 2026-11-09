import { describe, it, expect } from 'vitest';
import { parseGoModuleText } from '../../../src/go/GoModuleText.js';

describe('Go module records require a nonempty module path', () => {
  it('preserves a dependency with an empty path as malformed input', () => {
    const line = 'dep\t\tv1.2.3';
    const result = parseGoModuleText(`${line}\n`);

    expect(result.dependencies).toEqual([]);
    expect(result.unparsed_lines).toEqual([line]);
    expect(result.complete).toBe(false);
  });

  it('still accepts a dependency with a nonempty module path', () => {
    const result = parseGoModuleText('dep\texample.com/library\tv1.2.3\n');

    expect(result.dependencies).toEqual([
      { path: 'example.com/library', version: 'v1.2.3', sum: null, replacement: null },
    ]);
    expect(result.complete).toBe(true);
  });
});
