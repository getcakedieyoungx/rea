import { describe, it, expect } from 'vitest';
import { flattenSourceMapLeaves } from '../../../src/domain/sourceMapEnvelope.js';

describe('indexed source-map section validation', () => {
  it('rejects a declared sections field that is not an array', () => {
    expect(flattenSourceMapLeaves({ version: 3, sections: {} })).toBeUndefined();
    expect(flattenSourceMapLeaves({ version: 3, sections: null })).toBeUndefined();
  });

  it('still accepts a leaf without sections and an empty indexed map', () => {
    const leaf = { version: 3, sources: ['input.js'], mappings: 'AAAA' };
    expect(flattenSourceMapLeaves(leaf)).toEqual([leaf]);
    expect(flattenSourceMapLeaves({ version: 3, sections: [] })).toEqual([]);
  });
});
