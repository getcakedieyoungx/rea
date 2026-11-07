import { describe, it, expect } from 'vitest';
import { hasValidSourceMapContents } from '../../../src/domain/sourceMapContents.js';

describe('source-map content slot validation', () => {
  it('rejects an undefined slot whether explicit or a sparse-array hole', () => {
    const explicit = ['source', undefined];
    const sparse = ['source', 'removed'];
    delete sparse[1];

    expect(hasValidSourceMapContents(explicit)).toBe(false);
    expect(hasValidSourceMapContents(sparse)).toBe(false);
  });

  it('accepts null placeholders and genuinely shorter content arrays', () => {
    expect(hasValidSourceMapContents(['source', null])).toBe(true);
    expect(hasValidSourceMapContents(['source'])).toBe(true);
    expect(hasValidSourceMapContents([])).toBe(true);
  });
});
