import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo ARMv6-M subtype recognition', () => {
  it('normalizes symbolic ARMv6-M subtype metadata like its numeric equivalent', () => {
    const parseSubtype = (subtype: string) => parseLipoOutput([
      'architecture armv6m',
      '    cputype CPU_TYPE_ARM',
      `    cpusubtype ${subtype}`,
      '    capabilities 0x0',
      '    offset 4096',
      '    size 32',
      '    align 2^12 (4096)',
      '',
    ].join('\n')).architectures[0];

    const numeric = parseSubtype('14');
    const symbolic = parseSubtype('CPU_SUBTYPE_ARM_V6M');

    expect(numeric?.cpu_subtype_base).toBe(14);
    expect(symbolic?.cpu_subtype).toBe('CPU_SUBTYPE_ARM_V6M');
    expect(symbolic?.cpu_subtype_base).toBe(14);
    expect(symbolic?.cpu_subtype_code).toBe(numeric?.cpu_subtype_code);
  });
});
