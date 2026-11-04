import { describe, it, expect } from 'vitest';
import { parseLipoOutput } from '../../../src/native/parsers/lipo.js';

describe('lipo CPU lookup rejects inherited object properties', () => {
  it('preserves unknown CPU type text without treating toString as a numeric code', () => {
    const parse = () => parseLipoOutput(
      'architecture future\n cputype toString\n cpusubtype CPU_SUBTYPE_FUTURE\n capabilities 0x0\n',
    );
    expect(parse).not.toThrow();
    expect(parse().architectures[0]).toMatchObject({
      cpu_type: 'toString',
      cpu_type_code: null,
      cpu_subtype: 'CPU_SUBTYPE_FUTURE',
      cpu_subtype_code: null,
      cpu_subtype_base: null,
    });
  });

  it('preserves unknown CPU subtype text without treating constructor as a numeric code', () => {
    const parse = () => parseLipoOutput(
      'architecture future\n cputype CPU_TYPE_ARM64\n cpusubtype constructor\n capabilities 0x0\n',
    );
    expect(parse).not.toThrow();
    expect(parse().architectures[0]).toMatchObject({
      cpu_type_code: 0x0100000c,
      cpu_subtype: 'constructor',
      cpu_subtype_code: null,
      cpu_subtype_base: null,
    });
  });
});
