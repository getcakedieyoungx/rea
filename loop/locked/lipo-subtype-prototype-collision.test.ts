import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo subtype lookup prototype collisions', () => {
  it('preserves unknown subtype text without inventing numeric subtype facts', () => {
    for (const subtype of ['constructor', 'toString', '__proto__']) {
      const result = parseLipoOutput(
        `architecture x86_64\n cputype CPU_TYPE_X86_64\n cpusubtype ${subtype}\n capabilities 0x0\n`,
      );

      expect(result.architectures).toMatchObject([
        {
          cpu_type_code: 0x01000007,
          cpu_subtype: subtype,
          cpu_subtype_code: null,
          cpu_subtype_base: null,
        },
      ]);
    }
  });
});
