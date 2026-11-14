import { describe, it, expect } from 'vitest';
import { absoluteCallerPath } from '../../../src/filesystem/callerPath.js';

describe('POSIX caller path with a leading double slash', () => {
  it('preserves the implementation-defined // root instead of collapsing it to /', () => {
    expect(absoluteCallerPath('//server/share/file.bin', { platform: 'linux' })).toBe(
      '//server/share/file.bin',
    );
  });

  it('still removes interior repeated separators and interior . segments', () => {
    expect(absoluteCallerPath('/a//./b//c', { platform: 'linux' })).toBe('/a/b/c');
  });
});