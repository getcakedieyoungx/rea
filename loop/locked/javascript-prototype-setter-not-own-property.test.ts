import { describe, it, expect } from 'vitest';
import { parseExpression } from '@babel/parser';
import { staticObjectProperty } from '../../../src/domain/javascript/javascriptAstValues.js';

describe('staticObjectProperty prototype setter semantics', () => {
  it('does not report a colon-form __proto__ prototype setter as an own property', () => {
    const object = parseExpression('({ __proto__: null })');
    expect(staticObjectProperty(object, '__proto__').status).toBe('missing');
    const quoted = parseExpression('({ "__proto__": null })');
    expect(staticObjectProperty(quoted, '__proto__').status).toBe('missing');
  });

  it('still reports computed and shorthand __proto__ own properties', () => {
    const computed = parseExpression('({ ["__proto__"]: null })');
    expect(staticObjectProperty(computed, '__proto__').status).toBe('explicit');
    const shorthand = parseExpression('({ __proto__ })');
    expect(staticObjectProperty(shorthand, '__proto__').status).toBe('explicit');
  });
});
