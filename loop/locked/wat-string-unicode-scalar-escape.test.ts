import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('WAT Unicode scalar escapes', () => {
  it('decodes braced Unicode escapes to UTF-8 and preserves the source end offset', () => {
    const form = '(export "caf\\u{e9}-\\u{1f600}" (func 0))';
    const start = form.indexOf('"') + 1;
    expect(() => watString(form, start)).not.toThrow();
    expect(watString(form, start)).toEqual({
      bytes: Buffer.from('café-😀', 'utf8'),
      end: form.indexOf('"', start) + 1,
    });
  });

  it('rejects surrogate code points and scalars above the Unicode maximum', () => {
    for (const escape of ['\\u{d800}', '\\u{dfff}', '\\u{110000}']) {
      expect(() => watString(`"${escape}"`, 1)).toThrow();
    }
  });
});
