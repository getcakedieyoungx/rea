import { describe, it, expect } from 'vitest';
import { parseGoModuleText } from '../../../src/go/GoModuleText.js';

describe('Go module build-setting keys', () => {
  it('preserves empty quoted keys as malformed records instead of accepting them', () => {
    const lines = ['build\t""=linux', 'build\t``=amd64'];
    const result = parseGoModuleText(`${lines.join('\n')}\n`);

    expect(result.settings).toEqual([]);
    expect(result.unparsed_lines).toEqual(lines);
    expect(result.complete).toBe(false);
  });

  it('still accepts nonempty quoted keys with empty values', () => {
    const result = parseGoModuleText('build\t"GOOS"=""\nbuild\t`GOARCH`=``\n');

    expect(result.settings).toEqual([
      { key: 'GOOS', value: '' },
      { key: 'GOARCH', value: '' },
    ]);
    expect(result.unparsed_lines).toEqual([]);
    expect(result.complete).toBe(true);
  });
});
