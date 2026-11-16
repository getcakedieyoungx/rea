import { describe, it, expect } from 'vitest';
import {
  ghidraCompilerSpecIdSchema,
  ghidraLanguageIdSchema,
} from '../../../src/config/ghidraLanguageOverride.js';

describe('Ghidra language and compiler-spec ids end at the string', () => {
  it('rejects a value whose final character is a line terminator', () => {
    // The module documents "never leading or trailing whitespace", but both
    // patterns end in `$`, which also matches immediately before one final
    // line terminator. Fails today: all three assertions receive true.
    expect(ghidraLanguageIdSchema.safeParse('x86:LE:32:default\n').success).toBe(
      false,
    );
    expect(ghidraLanguageIdSchema.safeParse('x86:LE:32:default\r\n').success).toBe(
      false,
    );
    expect(ghidraCompilerSpecIdSchema.safeParse('default\n').success).toBe(false);
  });

  it('keeps admitting the same ids without a trailing line terminator', () => {
    expect(ghidraLanguageIdSchema.safeParse('x86:LE:32:default').success).toBe(
      true,
    );
    // Variants may contain an interior space, but still not at either end.
    expect(ghidraLanguageIdSchema.safeParse('x86:LE:16:Real Mode').success).toBe(
      true,
    );
    expect(ghidraCompilerSpecIdSchema.safeParse('default').success).toBe(true);
    expect(ghidraCompilerSpecIdSchema.safeParse('borlandcpp').success).toBe(
      true,
    );
  });
});