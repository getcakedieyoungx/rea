import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo ARMv6 subtype recognition', () => {
  it('recognizes CPU_SUBTYPE_ARM_V6 as Mach-O subtype 6', () => {
    const result = parseLipoOutput([
      'architecture armv6',
      '    cputype CPU_TYPE_ARM',
      '    cpusubtype CPU_SUBTYPE_ARM_V6',
      '    capabilities 0x0',
      '    offset 4096',
      '    size 32',
      '    align 2^12 (4096)',
      '',
    ].join('\n'));

    expect(result.architectures[0]?.cpu_type_code).toBe(12);
    expect(result.architectures[0]?.cpu_subtype).toBe('CPU_SUBTYPE_ARM_V6');
    expect(result.architectures[0]?.cpu_subtype_code).toBe(6);
    expect(result.architectures[0]?.cpu_subtype_base).toBe(6);
  });
});
