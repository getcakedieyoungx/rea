import { describe, it, expect } from 'vitest';
import { expandPrefix } from '../../../src/domain/apple/dyldPaths.js';

describe('dyld prefix expansion preserves newline-bearing filenames', () => {
  it('expands loader-relative paths without treating a literal LF as syntax', () => {
    expect(expandPrefix('@loader_path/lib\nExample.dylib', {
      ownerDirectory: 'App/Frameworks',
      executable: 'App/MacOS/main',
    })).toEqual({ scope: 'target', path: 'App/Frameworks/lib\nExample.dylib' });
  });

  it('expands executable-relative paths containing a literal CR', () => {
    expect(expandPrefix('@executable_path/lib\rExample.dylib', {
      ownerDirectory: 'App/Frameworks',
      executable: 'App/MacOS/main',
    })).toEqual({ scope: 'target', path: 'App/MacOS/lib\rExample.dylib' });
  });
});
