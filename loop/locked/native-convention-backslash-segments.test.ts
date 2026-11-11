import { describe, it, expect } from 'vitest';
import {
  isSwiftRuntimeLibrary,
  nativeRuntimeConvention,
} from '../../../src/domain/nativeConvention.js';

describe('Native runtime convention segment splitting', () => {
  it('recognizes a runtime library named in a backslash-separated path', () => {
    expect(nativeRuntimeConvention('C:\\app\\libflutter.so')).toBe('flutter');
    expect(nativeRuntimeConvention('C:\\app\\Hermes.framework\\Hermes')).toBe(
      'react-native',
    );
  });

  it('recognizes a Swift runtime dylib in a backslash-separated path', () => {
    expect(
      isSwiftRuntimeLibrary('C:\\Frameworks\\libswiftCore.dylib'),
    ).toBe(true);
  });
});