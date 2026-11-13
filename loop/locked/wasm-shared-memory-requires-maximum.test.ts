import { describe, it, expect } from 'vitest';
import { wasmInterfaceSchema } from '../../../src/domain/wasm/wasmInterface.js';

const entryFor = (
  signature:
    | { kind: 'memory'; page_size: string; address_type: 'i32' | 'i64'; minimum: string; maximum: string | null; shared: boolean }
    | { kind: 'table'; element: 'funcref' | 'externref'; address_type: 'i32' | 'i64'; minimum: string; maximum: string | null; shared: boolean },
) => ({
  state: 'complete' as const,
  entries: [
    {
      direction: 'export' as const,
      module: null,
      name: signature.kind === 'memory' ? 'memory' : 'table',
      kind: signature.kind,
      index: 0,
      signature,
      wat_form:
        signature.kind === 'memory'
          ? `(memory ${signature.minimum}${signature.shared ? ' shared' : ''})`
          : `(table ${signature.minimum} ${signature.element})`,
      issue: null,
    },
  ],
  issues: [],
});

describe('wasm interface shared limits', () => {
  it('rejects a shared memory or table signature that omits its maximum', () => {
    const sharedMemory = entryFor({
      kind: 'memory',
      page_size: '65536',
      address_type: 'i64',
      minimum: '1',
      maximum: null,
      shared: true,
    });
    const sharedTable = entryFor({
      kind: 'table',
      element: 'funcref',
      address_type: 'i32',
      minimum: '1',
      maximum: null,
      shared: true,
    });

    expect(wasmInterfaceSchema.safeParse(sharedMemory).success).toBe(false);
    expect(wasmInterfaceSchema.safeParse(sharedTable).success).toBe(false);
  });

  it('still accepts bounded shared limits and unbounded unshared limits', () => {
    const boundedSharedMemory = entryFor({
      kind: 'memory',
      page_size: '65536',
      address_type: 'i64',
      minimum: '1',
      maximum: '4',
      shared: true,
    });
    const unboundedPrivateMemory = entryFor({
      kind: 'memory',
      page_size: '65536',
      address_type: 'i32',
      minimum: '1',
      maximum: null,
      shared: false,
    });

    expect(wasmInterfaceSchema.safeParse(boundedSharedMemory).success).toBe(true);
    expect(wasmInterfaceSchema.safeParse(unboundedPrivateMemory).success).toBe(
      true,
    );
  });
});