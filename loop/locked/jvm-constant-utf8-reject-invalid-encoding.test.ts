import { describe, it, expect } from 'vitest';
import { isJvmClassFile } from '../../../src/domain/apple/jvmClassFile.js';

// A minimal class C extending Object, with one extra CONSTANT_Utf8 entry.
const classWithUtf8 = (payload: number[]): Uint8Array => {
  const utf8 = (bytes: number[]): Buffer => {
    const header = Buffer.alloc(3);
    header[0] = 1;
    header.writeUInt16BE(bytes.length, 1);
    return Buffer.concat([header, Buffer.from(bytes)]);
  };
  const body = Buffer.alloc(14);
  body.writeUInt16BE(0x0021, 0);
  body.writeUInt16BE(2, 2);
  body.writeUInt16BE(4, 4);
  return Buffer.concat([
    Buffer.from([0xca, 0xfe, 0xba, 0xbe, 0, 0, 0, 52, 0, 6]),
    utf8([0x43]), // #1: C
    Buffer.from([7, 0, 1]), // #2: Class C
    utf8(Array.from(Buffer.from('java/lang/Object', 'utf8'))), // #3
    Buffer.from([7, 0, 3]), // #4: Class Object
    utf8(payload), // #5: an otherwise unused string constant
    body,
  ]);
};

describe('JVM CONSTANT_Utf8 uses modified UTF-8', () => {
  it('rejects forbidden raw NUL and four-byte UTF-8 encodings', () => {
    expect(isJvmClassFile(classWithUtf8([0x00]))).toBe(false);
    expect(isJvmClassFile(classWithUtf8([0xf0, 0x9f, 0x98, 0x80]))).toBe(false);
  });

  it('accepts modified UTF-8 NUL and surrogate-pair encodings', () => {
    expect(isJvmClassFile(classWithUtf8([0xc0, 0x80]))).toBe(true);
    expect(isJvmClassFile(classWithUtf8([0xed, 0xa0, 0xbd, 0xed, 0xb8, 0x80]))).toBe(true);
  });
});
