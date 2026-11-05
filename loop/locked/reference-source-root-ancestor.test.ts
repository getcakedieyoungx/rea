import { describe, it, expect } from 'vitest';
import { createReferenceSourcePathLookup } from '../../../src/domain/referenceSourcePathIdentity.js';

describe('reference-source ancestor lookup includes recorded roots', () => {
  it('resolves an absolute descendant to the recorded filesystem root', () => {
    const lookup = createReferenceSourcePathLookup(['/']);

    expect(lookup.resolve('/')).toBe('/');
    expect(lookup.resolveAncestor('/unrecorded/file.ts')).toBe('/');
  });

  it('resolves a relative descendant to the recorded current-directory root', () => {
    const lookup = createReferenceSourcePathLookup(['.']);

    expect(lookup.resolve('.')).toBe('.');
    expect(lookup.resolveAncestor('unrecorded/file.ts')).toBe('.');
  });
});
