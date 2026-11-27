import { describe, it, expect } from 'vitest';

import { percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';

describe('percentDecodeUrlPath without percent escapes', () => {
  it('rejects text that is not well-formed UTF-16 instead of returning it unchanged', () => {
    // percentDecodeUrlPath documents that it returns null when the value is not
    // representable as UTF-8, because no canonical artifact path can match it.
    // An unpaired surrogate is not encodable, yet the no-escape fast path
    // returns the input as-is: the current call yields 'dir/\uD800file.js'
    // instead of null, while the escaped spelling '%ED%A0%80' already yields
    // null through the decoder. Both spellings name the same unusable path.
    expect(percentDecodeUrlPath('dir/\uD800file.js')).toBeNull();
    expect(percentDecodeUrlPath('dir/\uDC00file.js')).toBeNull();
  });

  it('still returns ordinary and decodable paths unchanged', () => {
    expect(percentDecodeUrlPath('dir/app.js')).toBe('dir/app.js');
    expect(percentDecodeUrlPath('dir/%41pp.js')).toBe('dir/App.js');
    // An escaped, genuinely invalid UTF-8 sequence stays rejected.
    expect(percentDecodeUrlPath('dir/%ED%A0%80file.js')).toBeNull();
  });
});