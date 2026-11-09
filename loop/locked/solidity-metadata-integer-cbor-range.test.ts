import { describe, it, expect } from 'vitest';
import { solidityMetadataScalarSchema } from '../../../src/domain/evm/solidityMetadata.js';

describe('Solidity metadata CBOR integer range', () => {
  it('accepts the largest unsigned CBOR integer but rejects the next integer', () => {
    expect(solidityMetadataScalarSchema.safeParse({
      kind: 'integer', value: '18446744073709551615',
    }).success).toBe(true);
    expect(solidityMetadataScalarSchema.safeParse({
      kind: 'integer', value: '18446744073709551616',
    }).success).toBe(false);
  });

  it('accepts the smallest negative CBOR integer but rejects the previous integer', () => {
    expect(solidityMetadataScalarSchema.safeParse({
      kind: 'integer', value: '-18446744073709551616',
    }).success).toBe(true);
    expect(solidityMetadataScalarSchema.safeParse({
      kind: 'integer', value: '-18446744073709551617',
    }).success).toBe(false);
  });
});
