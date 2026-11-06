import { describe, it, expect } from 'vitest';
import { classifySwiftSymbol } from '../../../src/domain/swiftSymbolClassification.js';

describe('Swift legacy symbol prefix recognition', () => {
  it('does not recognize an ordinary name containing an embedded legacy marker', () => {
    expect(classifySwiftSymbol('log_TtC4main3Foo')).toBeUndefined();
    expect(classifySwiftSymbol('ordinary_Tt_message')).toBeUndefined();
  });

  it('preserves recognition of actual legacy and modern Swift names', () => {
    expect(classifySwiftSymbol('_TtC4main3Foo')).toEqual({ category: 'classes' });
    expect(classifySwiftSymbol('$s4main3FooC')).toEqual({ category: 'classes' });
    expect(classifySwiftSymbol('ordinary_name')).toBeUndefined();
  });
});
