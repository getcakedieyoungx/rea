import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT module-level token validation', () => {
  it('accepts whitespace and comments between module fields', () => {
    expect(() => parseWabtWat('(module (memory 1) (; comment ;) ;; comment\n)')).not.toThrow();
  });

  it('rejects bare garbage between module fields rather than silently dropping it', () => {
    expect(() => parseWabtWat('(module (memory 1) garbage)')).toThrow();
  });
});
