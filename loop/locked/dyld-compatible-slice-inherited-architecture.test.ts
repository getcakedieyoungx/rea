import { describe, it, expect } from 'vitest';
import { compatibleSlice } from '../../../src/domain/apple/dyldPaths.js';

describe('compatibleSlice with unrecognized architecture names', () => {
  it('returns undefined for Object.prototype names when no slices exist', () => {
    for (const architecture of ['constructor', 'toString', '__proto__']) {
      expect(compatibleSlice([], {
        architecture,
        cpu_type: 0,
        cpu_subtype: 0,
      })).toBeUndefined();
    }
  });

  it('returns undefined for an ordinary unknown architecture', () => {
    expect(compatibleSlice([], {
      architecture: 'unknown-cpu',
      cpu_type: 0,
      cpu_subtype: 0,
    })).toBeUndefined();
  });
});
