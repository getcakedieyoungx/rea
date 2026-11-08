import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map section identity', () => {
  const leaf = {
    version: 3,
    sources: ['app.ts'],
    names: [],
    mappings: 'AAAA',
  };

  it('rejects a section that declares both an embedded map and an external URL', () => {
    const root = {
      version: 3,
      sections: [{
        offset: { line: 0, column: 0 },
        map: leaf,
        url: 'other.map',
      }],
    };

    expect(flattenSourceMapLeaves(root)).toBeUndefined();
  });

  it('retains support for sections with only an embedded map', () => {
    expect(flattenSourceMapLeaves({
      version: 3,
      sections: [{ offset: { line: 0, column: 0 }, map: leaf }],
    })).toEqual([leaf]);
  });
});
