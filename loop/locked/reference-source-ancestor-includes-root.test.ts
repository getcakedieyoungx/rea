import { describe, it, expect } from 'vitest';
import { createReferenceSourcePathLookup } from '../../../src/domain/referenceSourcePathIdentity.js';

describe('reference source ancestor lookup includes recorded roots', () => {
  it('falls back to the recorded relative root without skipping a closer entry', () => {
    const lookup = createReferenceSourcePathLookup(['.', 'src']);

    expect(lookup.resolveAncestor('src/missing/file.ts')).toBe('src');
    expect(lookup.resolveAncestor('other/file.ts')).toBe('.');
    expect(lookup.resolveAncestor('.')).toBe('.');
  });

  it('considers the absolute root before terminating ancestor traversal', () => {
    const lookup = createReferenceSourcePathLookup(['/']);

    expect(lookup.resolveAncestor('/missing/file.ts')).toBe('/');
    expect(lookup.resolveAncestor('/')).toBe('/');
    expect(createReferenceSourcePathLookup([]).resolveAncestor('/missing')).toBeUndefined();
  });
});
