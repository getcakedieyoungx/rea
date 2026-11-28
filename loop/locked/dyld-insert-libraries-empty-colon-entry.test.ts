import { describe, it, expect } from 'vitest';

import { embeddedDyldOverrides } from '../../../src/domain/apple/dyldEnvironment.js';

describe('DYLD_INSERT_LIBRARIES colon-separated entries', () => {
  it('does not report an override when every colon-separated entry is empty', () => {
    // dyld splits the value on ':' and cannot open an empty path, so ":" inserts
    // no library. The setting therefore cannot affect image resolution and must
    // not be reported as a suppressing override (the code already treats "" so).
    expect(embeddedDyldOverrides(['DYLD_INSERT_LIBRARIES=:'], [1])).toEqual([]);
    expect(embeddedDyldOverrides(['DYLD_INSERT_LIBRARIES=::'], [1])).toEqual([]);
  });

  it('still reports an override that names at least one library', () => {
    expect(
      embeddedDyldOverrides(['DYLD_INSERT_LIBRARIES=/usr/lib/libx.dylib'], [1]),
    ).toEqual([
      {
        variable: 'DYLD_INSERT_LIBRARIES',
        value: '/usr/lib/libx.dylib',
        phase: 'override',
        scope: 'all',
      },
    ]);
  });
});