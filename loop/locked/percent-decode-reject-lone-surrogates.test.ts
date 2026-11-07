import { describe, it, expect } from 'vitest';
import { percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';

describe('percentDecodeUrlPath UTF-16 admission', () => {
  it('rejects unpaired surrogates instead of silently replacing them with U+FFFD', () => {
    expect(percentDecodeUrlPath('/\uD800%41')).toBeNull();
    expect(percentDecodeUrlPath('/\uDC00%41')).toBeNull();
  });

  it('preserves valid surrogate pairs and literal replacement characters', () => {
    expect(percentDecodeUrlPath('/\uD83D\uDE00%41')).toBe('/\uD83D\uDE00A');
    expect(percentDecodeUrlPath('/\uFFFD%41')).toBe('/\uFFFDA');
  });
});
