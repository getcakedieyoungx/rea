import { describe, it, expect } from 'vitest';

import {
  admitsCanonicalPathSyntax,
  percentDecodeUrlPath,
} from '../../../src/domain/artifactPathSyntax.js';

describe('artifact path syntax: an encoded NUL is not an admissible path', () => {
  it('rejects a reference whose decoded bytes contain NUL', () => {
    // The decoder already refuses these bytes, so admitting the syntax lies.
    expect(percentDecodeUrlPath('assets/logo%00.png')).toBeNull();
    expect(admitsCanonicalPathSyntax('assets/logo%00.png')).toBe(false);
  });

  it('keeps ordinary paths admissible and still refuses traversal bytes', () => {
    expect(admitsCanonicalPathSyntax('assets/logo.png')).toBe(true);
    expect(admitsCanonicalPathSyntax('assets/%2e%2e/secret')).toBe(false);
    expect(admitsCanonicalPathSyntax('assets/a%2fb')).toBe(false);
  });
});