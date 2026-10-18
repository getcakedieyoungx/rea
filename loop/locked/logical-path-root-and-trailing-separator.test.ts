import { describe, it, expect } from 'vitest';

import { normalizeJoinedLogicalPath } from '../../../src/domain/artifactIdentity.js';

/**
 * `normalizeJoinedLogicalPath` is the single lexical join for inventoried
 * logical archive paths, and `"."` is the documented archive root. Joining the
 * root spelling `"./"` or a directory spelling `"dir/"` must therefore yield
 * the same canonical identity as `"."` and `"dir"`; otherwise one archive
 * location gets two logical paths (and two `occurrenceIdForLocation` ids).
 * `posix.normalize` keeps a trailing separator and turns `"./"` into `"./"`,
 * so the canonical form has to drop it.
 */
describe('logical archive path normalization', () => {
  it('normalizes the root spellings to the archive root "."', () => {
    expect(normalizeJoinedLogicalPath('.')).toBe('.');
    expect(normalizeJoinedLogicalPath('./')).toBe('.');
    expect(normalizeJoinedLogicalPath('./.')).toBe('.');
  });

  it('drops trailing separators so one entry has one logical path', () => {
    expect(normalizeJoinedLogicalPath('a/b/')).toBe('a/b');
    expect(normalizeJoinedLogicalPath('a/./b/')).toBe('a/b');
    expect(normalizeJoinedLogicalPath('dir//')).toBe('dir');
    expect(normalizeJoinedLogicalPath('./a/b/')).toBe('a/b');
  });
});