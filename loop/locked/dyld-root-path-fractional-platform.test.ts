import { describe, it, expect } from 'vitest';
import { embeddedDyldOverrides } from '../../../src/domain/apple/dyldEnvironment.js';

describe('DYLD_ROOT_PATH platform evidence', () => {
  it('does not treat a fractional platform identifier as a known non-simulator platform', () => {
    const environment = ['DYLD_ROOT_PATH=/simulator-root'];
    expect(embeddedDyldOverrides(environment, [1])).toEqual([]);
    expect(embeddedDyldOverrides(environment, [1.5])).toEqual([
      {
        variable: 'DYLD_ROOT_PATH',
        value: '/simulator-root',
        phase: 'override',
        scope: 'prefix',
      },
    ]);
  });
});
