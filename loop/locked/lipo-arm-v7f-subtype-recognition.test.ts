import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo ARMv7F subtype recognition', () => {
  it('projects the documented ARMv7F subtype identically for symbolic and numeric output', () => {
    const parseSubtype = (subtype: string) => parseLipoOutput([
      'architecture armv7f',
      '    cputype CPU_TYPE_ARM',
      `    cpusubtype ${subtype}`,
      '    capabilities 0x0',
      '    offset 4096',
      '    size 32',
      '    align 2^12 (4096)',
      '',
    ].join('\n')).architectures[0];

    const numeric = parseSubtype('10');
    const symbolic = parseSubtype('CPU_SUBTYPE_ARM_V7F');

    expect(numeric?.cpu_subtype_base).toBe(10);
    expect(symbolic?.cpu_subtype).toBe('CPU_SUBTYPE_ARM_V7F');
    expect(symbolic?.cpu_subtype_base).toBe(10);
    expect(symbolic?.cpu_subtype_code).toBe(numeric?.cpu_subtype_code);
  });
});
