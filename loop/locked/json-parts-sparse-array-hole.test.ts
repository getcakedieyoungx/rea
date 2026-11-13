import { describe, it, expect } from 'vitest';
import { jsonParts } from '../../../src/domain/jsonSerialization.js';

const encode = (value: unknown): string => [...jsonParts(value)].join('');

describe('jsonParts encodes sparse array holes as null, like JSON.stringify', () => {
  it('does not throw on a hole and emits null in its position', () => {
    // JSON.stringify([, 1]) === "[null,1]"; a hole is an absent element value.
    expect(encode([, 1])).toBe('[null,1]');
  });

  it('still encodes dense arrays and nested holes without extra separators', () => {
    expect(encode([1, 2])).toBe('[1,2]');
    expect(encode([[0, , 2], 3])).toBe('[[0,null,2],3]');
    expect(JSON.stringify([, 1])).toBe('[null,1]');
  });
});