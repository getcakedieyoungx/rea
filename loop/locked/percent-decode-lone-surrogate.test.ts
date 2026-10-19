import { describe, it, expect } from 'vitest';

import { percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';

/**
 * `percentDecodeUrlPath` owns the URL-standard percent decoding shared by the
 * artifact path resolver: escape bytes and literal text are encoded into one
 * byte stream and decoded as strict UTF-8. An unpaired surrogate has no UTF-8
 * encoding, but `TextEncoder` substitutes U+FFFD instead of failing, so the
 * decoder currently returns a path the URL never named. Unrepresentable text
 * must be reported as null, exactly like invalid escape bytes.
 */
describe('URL path percent decoding', () => {
  it('reports unrepresentable text as null instead of substituting U+FFFD', () => {
    expect(percentDecodeUrlPath('app/%41\uD800.js')).toBeNull();
    expect(percentDecodeUrlPath('app/%41.js\uDC00')).toBeNull();
  });

  it('still decodes valid escapes and literal non-ASCII text', () => {
    expect(percentDecodeUrlPath('app/%41.js')).toBe('app/A.js');
    expect(percentDecodeUrlPath('app/%C3%A9.js')).toBe('app/é.js');
    expect(percentDecodeUrlPath('app/é.js')).toBe('app/é.js');
  });
});