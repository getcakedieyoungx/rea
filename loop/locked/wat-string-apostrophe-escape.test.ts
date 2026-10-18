import { describe, it, expect } from 'vitest';

import { watString } from '../../../src/wasm/WabtString.js';

/**
 * WAT string literals admit the apostrophe escape (`\'`), alongside `\t`,
 * `\n`, `\r`, `\"` and `\\` (WebAssembly text format, string escapes).
 * `watString` is the single WAT string decoder behind `parseWabtWat` and
 * `parseWabtInterface`, so a legal escape must decode instead of aborting.
 */
describe('WAT string decoding', () => {
  it('decodes the apostrophe escape instead of rejecting the literal', () => {
    const form = '(export "it\\\'s" (func 0))';
    const start = form.indexOf('"') + 1;
    expect(form.slice(start)).toBe('it\\\'s" (func 0))');

    expect(() => watString(form, start)).not.toThrow();
    expect(watString(form, start)).toEqual({
      bytes: Buffer.from("it's", 'utf8'),
      end: start + "it\\'s".length + 1,
    });
  });
});
