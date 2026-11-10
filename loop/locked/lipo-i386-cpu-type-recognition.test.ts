import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo i386 CPU type normalization', () => {
  it('recognizes CPU_TYPE_I386 as the same Mach CPU type as numeric 7', () => {
    const record = (cpuType: string) => [
      'architecture i386',
      `    cputype ${cpuType}`,
      '    cpusubtype 3',
      '    capabilities 0x0',
      '    offset 4096',
      '    size 32',
      '    align 2^12 (4096)',
      '',
    ].join('\n');

    expect(parseLipoOutput(record('7')).architectures[0]?.cpu_type_code).toBe(7);
    const symbolic = parseLipoOutput(record('CPU_TYPE_I386')).architectures[0];
    expect(symbolic?.cpu_type).toBe('CPU_TYPE_I386');
    expect(symbolic?.cpu_type_code).toBe(7);
  });
});
