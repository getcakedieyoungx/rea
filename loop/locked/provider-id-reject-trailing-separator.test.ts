import { describe, it, expect } from 'vitest';
import {
  analysisProviderIdSchema,
  analysisProviderSelectorSchema,
} from '../../../src/contracts/providerSelection.js';

describe('analysis provider identifier shape', () => {
  it('rejects an identifier that ends with the namespace separator', () => {
    // A provider ID names a provider; it is not a path fragment. "ghidra-"
    // tokenizes into the same selection vocabulary as "ghidra" but matches no
    // provider, so this boundary must refuse it here instead of letting it
    // fail later as an unknown_provider selection error.
    // Fails today: the current pattern admits any [a-z0-9-]* tail, so both
    // of these assertions currently receive true.
    expect(analysisProviderIdSchema.safeParse('ghidra-').success).toBe(false);
    expect(analysisProviderIdSchema.safeParse('a--').success).toBe(false);
  });

  it('keeps admitting the identifiers and the selector already in use', () => {
    for (const id of ['ghidra', 'ida', 'hopper', 'jeb', 'radare2', 'gdb-debug'])
      expect(analysisProviderIdSchema.safeParse(id).success, id).toBe(true);
    expect(analysisProviderSelectorSchema.safeParse('auto').success).toBe(true);
    // "auto" stays reserved for selection and is not a provider ID.
    expect(analysisProviderIdSchema.safeParse('auto').success).toBe(false);
  });
});