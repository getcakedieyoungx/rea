import { describe, it, expect } from 'vitest';
import { parseGoModuleText } from '../../../src/go/GoModuleText.js';

describe('Go module main module path', () => {
  it('keeps a path record with an empty module path as malformed input', () => {
    const line = 'path\t';
    const result = parseGoModuleText(`${line}\n`);

    // Current code records the empty string as the module path and reports the
    // source as complete.
    expect(result.path).toBeNull();
    expect(result.unparsed_lines).toEqual([line]);
    expect(result.complete).toBe(false);
  });

  it('keeps a mod record with an empty module path as malformed input', () => {
    const line = 'mod\t\tv1.2.3';
    const result = parseGoModuleText(`${line}\n`);

    expect(result.main).toBeNull();
    expect(result.unparsed_lines).toEqual([line]);
    expect(result.complete).toBe(false);
  });

  it('still accepts a nonempty main module path', () => {
    const result = parseGoModuleText(
      'path\texample.com/main\nmod\texample.com/main\t(devel)\t\n',
    );

    expect(result.path).toBe('example.com/main');
    expect(result.main).toEqual({
      path: 'example.com/main',
      version: '(devel)',
      sum: null,
      replacement: null,
    });
    expect(result.unparsed_lines).toEqual([]);
    expect(result.complete).toBe(true);
  });
});