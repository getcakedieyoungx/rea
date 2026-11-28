import { describe, it, expect } from 'vitest';

import { nativeRuntimeConvention } from '../../../src/domain/nativeConvention.js';

describe('nativeRuntimeConvention path segment separators', () => {
  it('recognizes a runtime library named by a Windows-style segment', () => {
    // Inventoried Windows paths (ASAR unpacked trees, Electron native-addon
    // directories) separate their segments with a backslash. The lookup splits
    // only on "/", so the whole path is one segment and no library name matches.
    expect(
      nativeRuntimeConvention(
        'C:\\app\\resources\\app.asar.unpacked\\libflutter.so',
      ),
    ).toBe('flutter');
    expect(
      nativeRuntimeConvention(
        'app\\node_modules\\react-native\\React.framework',
      ),
    ).toBe('react-native');
    expect(nativeRuntimeConvention('plugins\\x86_64\\libunity.so')).toBe(
      'unity',
    );
  });

  it('still recognizes forward-slash segments and unknown names', () => {
    expect(nativeRuntimeConvention('/data/app/lib/arm64/libflutter.so')).toBe(
      'flutter',
    );
    expect(nativeRuntimeConvention('lib/arm64/libnotaruntime.so')).toBeNull();
  });
});