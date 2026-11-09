import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map section start uniqueness', () => {
  const first = { version: 3, sources: ['first.ts'], names: [], mappings: 'AAAA' };
  const second = { version: 3, sources: ['second.ts'], names: [], mappings: 'AAAA' };

  it('rejects nonempty sections starting at the same generated position', () => {
    const root = {
      version: 3,
      sections: [
        { offset: { line: 0, column: 0 }, map: first },
        { offset: { line: 0, column: 0 }, map: second },
      ],
    };
    expect(flattenSourceMapLeaves(root)).toBeUndefined();
  });

  it('accepts distinct section starts on the same generated line', () => {
    const root = {
      version: 3,
      sections: [
        { offset: { line: 0, column: 0 }, map: first },
        { offset: { line: 0, column: 1 }, map: second },
      ],
    };
    expect(flattenSourceMapLeaves(root)).toEqual([first, second]);
  });
});
