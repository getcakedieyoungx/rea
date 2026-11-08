import { describe, it, expect } from 'vitest';
import { inspectSourceMapValue } from '../../../src/javascript/sourceMaps/SourceMapFormat.js';

describe('source-map mapping segment separators', () => {
  it('rejects empty segments introduced by leading, repeated or trailing commas', () => {
    for (const mappings of [',AAAA', 'AAAA,,CAAA', 'AAAA,']) {
      expect(() => inspectSourceMapValue({
        version: 3,
        sources: ['input.ts'],
        names: [],
        mappings,
      })).toThrow();
    }
  });

  it('continues to allow empty generated lines separated by semicolons', () => {
    expect(() => inspectSourceMapValue({
      version: 3,
      sources: ['input.ts'],
      names: [],
      mappings: ';AAAA;;CAAA;',
    })).not.toThrow();
  });
});
