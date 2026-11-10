import { describe, it, expect } from 'vitest';
import { projectPlistValue } from '../../../src/domain/apple/plistValue.js';

describe('plist projection rejects unsupported collection objects', () => {
  it('does not silently turn nonempty Map and Set values into empty dictionaries', () => {
    expect(() => projectPlistValue(new Map([['answer', 42]]))).toThrow(TypeError);
    expect(() => projectPlistValue(new Set(['retained value']))).toThrow(TypeError);
  });

  it('still projects ordinary and null-prototype dictionaries', () => {
    expect(projectPlistValue({ answer: 42 }).value).toEqual({ answer: 42 });
    const dictionary = Object.create(null);
    dictionary.answer = 42;
    expect(projectPlistValue(dictionary).value).toEqual({ answer: 42 });
  });
});
