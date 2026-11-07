import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map envelopes', () => {
  const leaf = {
    version: 3,
    sources: ['app.ts'],
    names: [],
    mappings: 'AAAA',
  };
  const indexed = {
    version: 3,
    sections: [{ offset: { line: 0, column: 0 }, map: leaf }],
  };

  it('rejects maps that declare both mappings and sections, including nested maps', () => {
    const conflicting = { ...indexed, mappings: 'AAAA' };
    expect(flattenSourceMapLeaves(conflicting)).toBeUndefined();
    expect(flattenSourceMapLeaves({
      version: 3,
      sections: [{ offset: { line: 0, column: 0 }, map: conflicting }],
    })).toBeUndefined();
  });

  it('retains valid ordinary and indexed source maps', () => {
    expect(flattenSourceMapLeaves(leaf)).toEqual([leaf]);
    expect(flattenSourceMapLeaves(indexed)).toEqual([leaf]);
  });
});
