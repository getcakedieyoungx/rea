import { describe, it, expect } from 'vitest';

import { normalizeJoinedLogicalPath } from '../../../src/domain/artifactIdentity.js';

describe('normalizeJoinedLogicalPath archive root spellings', () => {
  it('keeps a dot-slash root as "." instead of collapsing it to an empty string', () => {
    expect(normalizeJoinedLogicalPath('./')).toBe('.');
    expect(normalizeJoinedLogicalPath('.//')).toBe('.');
    expect(normalizeJoinedLogicalPath('./.')).toBe('.');
    expect(normalizeJoinedLogicalPath('')).toBe('.');
  });

  it('still normalizes ordinary member paths against the root', () => {
    expect(normalizeJoinedLogicalPath('./index.js')).toBe('index.js');
    expect(normalizeJoinedLogicalPath('assets//app.js')).toBe('assets/app.js');
    expect(normalizeJoinedLogicalPath('assets/../index.js')).toBe('index.js');
  });
});