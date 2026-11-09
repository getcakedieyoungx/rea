import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map required section offset', () => {
  const leaf = { version: 3, sources: ['app.ts'], names: [], mappings: 'AAAA' };

  it('rejects an embedded section that omits its required offset', () => {
    const root = { version: 3, sections: [{ map: leaf }] };
    expect(flattenSourceMapLeaves(root)).toBeUndefined();
  });

  it('accepts an embedded section with an explicit zero offset', () => {
    const root = {
      version: 3,
      sections: [{ offset: { line: 0, column: 0 }, map: leaf }],
    };
    expect(flattenSourceMapLeaves(root)).toEqual([leaf]);
  });
});
