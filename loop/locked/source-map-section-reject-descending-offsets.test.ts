import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map section ordering', () => {
  const leaf = { version: 3, sources: ['app.ts'], names: [], mappings: 'AAAA' };

  it('rejects sections whose offsets move backwards by line or column', () => {
    for (const offsets of [
      [{ line: 2, column: 0 }, { line: 1, column: 0 }],
      [{ line: 0, column: 5 }, { line: 0, column: 4 }],
    ]) {
      const root = {
        version: 3,
        sections: offsets.map((offset) => ({ offset, map: leaf })),
      };
      expect(flattenSourceMapLeaves(root)).toBeUndefined();
    }
  });

  it('accepts a smaller column when the next section starts on a later line', () => {
    const root = {
      version: 3,
      sections: [
        { offset: { line: 0, column: 5 }, map: leaf },
        { offset: { line: 1, column: 0 }, map: leaf },
      ],
    };
    expect(flattenSourceMapLeaves(root)).toEqual([leaf, leaf]);
  });
});
