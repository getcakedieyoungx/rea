import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo FAT declared slice count', () => {
  const slice = `architecture arm64
    cputype CPU_TYPE_ARM64
    cpusubtype CPU_SUBTYPE_ARM64_ALL
    capabilities 0x0
    offset 4096
    size 32
    align 2^12 (4096)
`;

  it('rejects truncated output that declares two slices but contains only one', () => {
    const output = `Fat header in: /fixture/app\nfat_magic 0xcafebabe\nnfat_arch 2\n${slice}`;
    expect(() => parseLipoOutput(output)).toThrow();
  });

  it('accepts a matching count and headerless slice records', () => {
    const output = `Fat header in: /fixture/app\nfat_magic 0xcafebabe\nnfat_arch 1\n${slice}`;
    expect(parseLipoOutput(output).architectures).toHaveLength(1);
    expect(parseLipoOutput(slice).architectures).toHaveLength(1);
  });
});
