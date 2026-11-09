import { describe, it, expect } from 'vitest';
import { inspectSourceMapValue } from '../../../src/javascript/sourceMaps/SourceMapFormat.js';

describe('source-map ignore-list source index bounds', () => {
  it('rejects an ignoreList index that does not identify a source', () => {
    const map = {
      version: 3,
      sources: ['app.ts'],
      names: [],
      mappings: 'AAAA',
      ignoreList: [1],
    };
    expect(() => inspectSourceMapValue(map)).toThrow();
  });

  it('accepts the final valid source index and preserves its ignored flag', () => {
    const result = inspectSourceMapValue({
      version: 3,
      sources: ['app.ts'],
      names: [],
      mappings: 'AAAA',
      ignoreList: [0],
    });
    expect(result.declarations).toMatchObject([
      { sourceIndex: 0, source: 'app.ts', ignored: true },
    ]);
  });
});
