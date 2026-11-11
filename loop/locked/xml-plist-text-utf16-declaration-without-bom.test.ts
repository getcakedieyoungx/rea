import { describe, it, expect } from 'vitest';
import {
  XmlPlistTextDecodeError,
  decodeXmlPlistText,
} from '../../../src/domain/propertyListXmlText.js';

const utf16leWithoutBom = (text: string): Uint8Array =>
  Uint8Array.from(Buffer.from(text, 'utf16le'));

describe('XML plist text decoding of a declared UTF-16 document without a BOM', () => {
  it('refuses to read UTF-16LE bytes as UTF-8 text instead of returning mangled text', () => {
    const source =
      '<?xml version="1.0" encoding="utf-16"?><plist version="1.0"><string>x</string></plist>';
    let decoded: string | undefined;
    let failure: unknown;
    try {
      decoded = decodeXmlPlistText(utf16leWithoutBom(source));
    } catch (cause: unknown) {
      failure = cause;
    }

    // The bytes are valid UTF-16LE, so a UTF-8 interpretation produces NUL-joined
    // text that no plist reader can parse; the declaration disagrees with that
    // chosen encoding and must be reported, not silently mangled.
    expect(
      typeof decoded === 'string' ? decoded.includes('\u0000') : false,
    ).toBe(false);
    expect(failure).toBeInstanceOf(XmlPlistTextDecodeError);
    expect((failure as XmlPlistTextDecodeError).reason).toBe(
      'encoding-mismatch',
    );
  });

  it('still decodes a plain UTF-8 document without a BOM', () => {
    const source =
      '<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><string>x</string></plist>';
    expect(decodeXmlPlistText(new TextEncoder().encode(source))).toBe(source);
  });
});