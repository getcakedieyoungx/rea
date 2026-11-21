import { describe, it, expect } from 'vitest';
import { isValidFridaRemoteAddress } from '../../../src/contracts/fridaRemoteAddress.js';

describe('Frida remote address rejects percent-encoded control characters', () => {
  it('rejects hosts carrying percent-encoded NUL or C0 controls', () => {
    // The validator's own character class excludes literal NUL/C0 controls,
    // but the non-special tcp:// URL parses the host as an opaque host and
    // leaves percent-escapes untouched, so these encodings slip through.
    expect(isValidFridaRemoteAddress('frida-target%00')).toBe(false);
    expect(isValidFridaRemoteAddress('frida-target%09:27042')).toBe(false);
    expect(isValidFridaRemoteAddress('frida-target%0a')).toBe(false);
  });

  it('still accepts plain hosts, ports and bracketed IPv6 addresses', () => {
    expect(isValidFridaRemoteAddress('127.0.0.1:27042')).toBe(true);
    expect(isValidFridaRemoteAddress('frida-target.example')).toBe(true);
    expect(isValidFridaRemoteAddress('[::1]:27042')).toBe(true);
  });
});