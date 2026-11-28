import { describe, it, expect } from 'vitest';

import { parseGoModuleBytes } from '../../../src/go/GoModuleText.js';

describe('Go module replacement record', () => {
  it('attaches a versioned replacement that carries no sum', () => {
    // A BuildInfo replacement line is `=>\tpath\tversion` (two fields), so the
    // current `fields.length === 3` guard drops it: replacement stays null and
    // the line is reported as unparsed, making the metadata incomplete.
    const text = [
      'path\texample.com/main',
      'dep\texample.com/lib\tv1.0.0\th1:AAAA=',
      '=>\texample.com/fork\tv1.2.0',
      '',
    ].join('\n');

    const metadata = parseGoModuleBytes(Buffer.from(text, 'utf8'));

    expect(metadata.unparsed_lines).toEqual([]);
    expect(metadata.complete).toBe(true);
    expect(metadata.dependencies).toHaveLength(1);
    expect(metadata.dependencies[0]?.replacement).toEqual({
      path: 'example.com/fork',
      version: 'v1.2.0',
      sum: null,
    });
  });
});