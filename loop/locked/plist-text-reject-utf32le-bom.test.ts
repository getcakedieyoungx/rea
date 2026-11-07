import { describe, it, expect } from 'vitest';
import {
  decodeXmlPlistText,
  XmlPlistTextDecodeError,
} from '../../../src/domain/propertyListXmlText.js';

describe('XML plist encoding discrimination', () => {
  it('rejects UTF-32LE rather than misidentifying its BOM as UTF-16LE', () => {
    const text = '<plist/>';
    const bytes = Buffer.alloc(4 + text.length * 4);
    bytes.set([0xff, 0xfe, 0x00, 0x00]);
    for (let index = 0; index < text.length; index += 1) {
      bytes.writeUInt32LE(text.charCodeAt(index), 4 + index * 4);
    }

    expect(() => decodeXmlPlistText(bytes)).toThrow(XmlPlistTextDecodeError);
  });

  it('still decodes supported BOM-marked UTF-16LE', () => {
    const text = '<plist/>';
    const bytes = Buffer.concat([
      Buffer.from([0xff, 0xfe]),
      Buffer.from(text, 'utf16le'),
    ]);

    expect(decodeXmlPlistText(bytes)).toBe(text);
  });
});
