import { describe, it, expect } from 'vitest';
import { parseApktoolYml } from '../../../src/apktool/ApktoolDecodeOutput.js';

describe('Apktool metadata YAML scalar aliases', () => {
  it('projects aliased scalars exactly like their anchored values', () => {
    const metadata = parseApktoolYml([
      'versionInfo:',
      '  versionName: &release "1.2.3"',
      '  versionCode: &code 0045',
      'sdkInfo:',
      '  minSdkVersion: *code',
      '  targetSdkVersion: *code',
      '',
    ].join('\n'));

    expect(metadata.versionName).toBe('1.2.3');
    expect(metadata.versionCode).toBe('0045');
    expect(metadata.minSdkVersion).toBe('0045');
    expect(metadata.targetSdkVersion).toBe('0045');
  });
});
