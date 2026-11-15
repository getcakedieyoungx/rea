import { describe, it, expect } from 'vitest';
import { percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';

describe('percent-decoded URL paths reject every NUL spelling', () => {
  it('returns null for a literal NUL even when no escape sequence is present', () => {
    // The documented contract is that no canonical artifact path can contain
    // NUL, so the fast path taken when the value holds no `%XX` sequence must
    // apply the same rejection as the decoding path.
    expect(percentDecodeUrlPath('/a\u0000b')).toBeNull();
  });

  it('keeps escape decoding and literal percent text intact', () => {
    expect(percentDecodeUrlPath('/a%20b')).toBe('/a b');
    expect(percentDecodeUrlPath('/a%00b')).toBeNull();
    expect(percentDecodeUrlPath('/100%')).toBe('/100%');
  });
});