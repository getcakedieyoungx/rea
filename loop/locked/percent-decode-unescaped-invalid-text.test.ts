import { describe, it, expect } from 'vitest';

import { percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';

/**
 * `percentDecodeUrlPath` owns the URL-standard percent decoding shared by the
 * artifact path resolver. Its contract says a decoded path is `null` when the
 * text cannot name a canonical artifact path: invalid UTF-8 or NUL. The
 * escaped spelling is validated on the byte path (`"%00"` and `"%41\uD800"`
 * both return null), but the no-escape fast path returns its argument
 * unchanged, so literal NUL and an unpaired surrogate (which `TextEncoder`
 * would silently rewrite as U+FFFD) slip through and produce a path the URL
 * never named. Both spellings of the same text must agree.
 */
describe('URL path percent decoding without escapes', () => {
  it('reports literal NUL as null, exactly like the escaped spelling', () => {
    expect(percentDecodeUrlPath('app/%00.js')).toBeNull();
    expect(percentDecodeUrlPath('app/\u0000.js')).toBeNull();
    expect(percentDecodeUrlPath('\u0000')).toBeNull();
  });

  it('reports unpaired surrogates as null, exactly like the escaped spelling', () => {
    expect(percentDecodeUrlPath('app/%41\uD800.js')).toBeNull();
    expect(percentDecodeUrlPath('app/\uD800.js')).toBeNull();
    expect(percentDecodeUrlPath('app/\uDC00.js')).toBeNull();
  });

  it('still returns ordinary text unchanged', () => {
    expect(percentDecodeUrlPath('app/main.js')).toBe('app/main.js');
    expect(percentDecodeUrlPath('app/é.js')).toBe('app/é.js');
    expect(percentDecodeUrlPath('')).toBe('');
  });
});