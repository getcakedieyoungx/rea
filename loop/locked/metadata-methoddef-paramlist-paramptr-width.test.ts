import { describe, it, expect } from 'vitest';

import { computeRowSize } from '../../../src/dotnet/ManagedMetadataRowSizes.js';

/**
 * An uncompressed (`#-`) metadata stream carries ParamPtr rows holding the
 * real parameter index, exactly as it carries FieldPtr and MethodPtr rows for
 * TypeDef's FieldList and MethodList (ECMA-335 II.24.2.6). MethodDef.ParamList
 * therefore widens to a 4-byte index whenever ParamPtr does, the same way
 * TypeDef's list columns already widen in this module.
 */
const context = {
  tableSize: (index: number): 2 | 4 => (index === 7 ? 4 : 2),
  codedSize: (): 2 | 4 => 2,
  stringSize: 2 as const,
  guidSize: 2 as const,
  blobSize: 2 as const,
};

describe('computeRowSize MethodDef ParamList', () => {
  it('widens ParamList to the ParamPtr index width', () => {
    // RVA 4 + ImplFlags 2 + Flags 2 + Name 2 + Signature 2 + ParamList 4
    expect(computeRowSize(6, context)).toBe(16);
  });

  it('keeps the narrow Param index width when ParamPtr is absent', () => {
    const narrow = { ...context, tableSize: (): 2 | 4 => 2 };
    expect(computeRowSize(6, narrow)).toBe(14);
  });
});
