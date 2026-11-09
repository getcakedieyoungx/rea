import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map integer coordinates', () => {
  const leaf = {
    version: 3,
    sources: ['app.ts'],
    names: [],
    mappings: 'AAAA',
  };

  it('rejects fractional section line and column offsets rather than silently discarding them', () => {
    for (const offset of [
      { line: 0.5, column: 0 },
      { line: 0, column: 0.5 },
    ]) {
      const root = { version: 3, sections: [{ offset, map: leaf }] };
      expect(flattenSourceMapLeaves(root)).toBeUndefined();
    }
  });

  it('preserves leaf collection for integer section coordinates', () => {
    const root = {
      version: 3,
      sections: [{ offset: { line: 2, column: 3 }, map: leaf }],
    };
    expect(flattenSourceMapLeaves(root)).toEqual([leaf]);
  });
});
