import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT memory limits with digit separators', () => {
  it('normalizes valid decimal and hexadecimal digit-separated limits', () => {
    const parsed = parseWabtWat(
      '(module (memory 1_024 0x1_000) (export "memory" (memory 0)))',
    );

    expect(parsed.interface.entries).toHaveLength(1);
    expect(parsed.interface.entries[0]).toMatchObject({
      direction: 'export',
      name: 'memory',
      kind: 'memory',
      index: 0,
      signature: {
        kind: 'memory',
        page_size: '65536',
        address_type: 'i32',
        minimum: '1024',
        maximum: '4096',
        shared: false,
      },
      issue: null,
    });
  });
});
