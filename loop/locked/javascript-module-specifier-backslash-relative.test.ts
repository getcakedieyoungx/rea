import { describe, it, expect } from 'vitest';

import { isRelativeJavaScriptModuleSpecifier } from '../../../src/domain/javascript/javascriptModuleSpecifier.js';

describe('isRelativeJavaScriptModuleSpecifier recognizes backslash path separators', () => {
  it('treats a dot-prefixed backslash specifier as relative', () => {
    // Failing expectation today: the predicate only tests "." / ".." / "./" / "../",
    // so a Windows-style relative require such as require(".\\lib\\util.js") is
    // reported as an external package instead of an internal source edge.
    expect(isRelativeJavaScriptModuleSpecifier('.\\lib\\util.js')).toBe(true);
    expect(isRelativeJavaScriptModuleSpecifier('..\\shared\\x.js')).toBe(true);
    expect(isRelativeJavaScriptModuleSpecifier('.')).toBe(true);
    expect(isRelativeJavaScriptModuleSpecifier('..')).toBe(true);
    expect(isRelativeJavaScriptModuleSpecifier('..\\')).toBe(true);
  });

  it('keeps bare package and absolute specifiers non-relative', () => {
    // Existing behaviour for the shapes the predicate already decides.
    expect(isRelativeJavaScriptModuleSpecifier('./lib/util.js')).toBe(true);
    expect(isRelativeJavaScriptModuleSpecifier('../shared/x.js')).toBe(true);
    expect(isRelativeJavaScriptModuleSpecifier('lodash\\fp')).toBe(false);
    expect(isRelativeJavaScriptModuleSpecifier('/abs/path.js')).toBe(false);
    // A bare file name that merely contains a backslash is not a relative
    // specifier: only a leading dot segment marks one.
    expect(isRelativeJavaScriptModuleSpecifier('lib\\util.js')).toBe(false);
  });
});