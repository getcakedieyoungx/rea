import { describe, it, expect } from 'vitest';

import { percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';

describe('percentDecodeUrlPath NUL rejection', () => {
  it('rejects literal NUL even when there are no percent escapes', () => {
    expect(percentDecodeUrlPath('/assets/\0app.js')).toBeNull();
  });

  it('rejects encoded and mixed NUL paths while preserving ordinary paths', () => {
    expect(percentDecodeUrlPath('/assets/%00app.js')).toBeNull();
    expect(percentDecodeUrlPath('/assets/\0%61pp.js')).toBeNull();
    expect(percentDecodeUrlPath('/assets/app.js')).toBe('/assets/app.js');
    expect(percentDecodeUrlPath('/assets/%61pp.js')).toBe('/assets/app.js');
    expect(percentDecodeUrlPath('/assets/100%ready.js')).toBe('/assets/100%ready.js');
  });
});
