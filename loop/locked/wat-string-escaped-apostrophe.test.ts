import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('watString WAT apostrophe escapes', () => {
  it('accepts an escaped apostrophe and decodes it like a literal apostrophe', () => {
    const escaped = String.raw`"can\'t"`;
    expect(() => watString(escaped, 1)).not.toThrow();
    const decoded = watString(escaped, 1);
    expect(decoded.bytes.toString('utf8')).toBe("can't");
    expect(decoded.end).toBe(escaped.length);
    expect(decoded.bytes).toEqual(watString(`"can't"`, 1).bytes);
  });

  it('preserves escaped double quotes and backslashes', () => {
    const source = String.raw`"a\"b\\c"`;
    const decoded = watString(source, 1);
    expect(decoded.bytes.toString('utf8')).toBe('a"b\\c');
    expect(decoded.end).toBe(source.length);
  });
});
