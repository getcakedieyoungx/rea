import { describe, it, expect } from 'vitest';
import { createReferenceSourcePathLookup } from '../../../src/domain/referenceSourcePathIdentity.js';

describe('reference source ancestor lookup at the recorded root', () => {
  it('returns a recorded relative root identity as the closest ancestor', () => {
    const lookup = createReferenceSourcePathLookup(['.', 'src']);
    expect(lookup.resolveAncestor('src/index.ts')).toBe('src');
    // `src/index.ts` -> `src` -> `.`; the root itself is a recorded identity,
    // so the walk must test it instead of stopping before it.
    expect(lookup.resolveAncestor('lib/deep/file.ts')).toBe('.');
  });

  it('returns a recorded absolute root identity as the closest ancestor', () => {
    const lookup = createReferenceSourcePathLookup(['/', '/opt']);
    expect(lookup.resolveAncestor('/opt/tools/file.c')).toBe('/opt');
    expect(lookup.resolveAncestor('/etc/hosts')).toBe('/');
  });
});