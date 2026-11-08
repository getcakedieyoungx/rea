import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map section offsets', () => {
  const leaf = {
    version: 3,
    sources: ['app.ts'],
    names: [],
    mappings: 'AAAA',
  };

  it('rejects negative section line or column offsets', () => {
    for (const offset of [{ line: -1, column: 0 }, { line: 0, column: -1 }]) {
      const root = { version: 3, sections: [{ offset, map: leaf }] };
      expect(flattenSourceMapLeaves(root)).toBeUndefined();
    }
  });

  it('continues to collect leaves with nonnegative section offsets', () => {
    const root = {
      version: 3,
      sections: [{ offset: { line: 0, column: 0 }, map: leaf }],
    };
    expect(flattenSourceMapLeaves(root)).toEqual([leaf]);
  });
});
