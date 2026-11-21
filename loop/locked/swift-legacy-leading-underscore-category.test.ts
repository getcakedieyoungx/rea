import { describe, it, expect } from 'vitest';
import { classifySwiftSymbol } from '../../../src/domain/swiftSymbolClassification.js';

describe('legacy Swift type manglings with the assembler leading underscore', () => {
  it('categorizes __TtC class symbols exactly like their _TtC spelling', () => {
    // Mach-O symbol tables carry one extra leading underscore on legacy
    // manglings, and the modern branch already admits that spelling via `_?`.
    // RED today: returns { category: null } instead of { category: 'classes' }.
    expect(classifySwiftSymbol('__TtC4main11ViewController')).toEqual({
      category: 'classes',
    });
  });

  it('keeps the bare legacy spellings and non-Swift names unchanged', () => {
    expect(classifySwiftSymbol('_TtC4main11ViewController')).toEqual({
      category: 'classes',
    });
    expect(classifySwiftSymbol('_TtV4main5Point')).toEqual({
      category: 'structs',
    });
    expect(classifySwiftSymbol('_TtP4main8Scoring')).toEqual({
      category: 'protocols',
    });
    expect(classifySwiftSymbol('main')).toBeUndefined();
  });
});