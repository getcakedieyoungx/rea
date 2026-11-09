import { describe, it, expect } from 'vitest';
import { isJvmClassFile } from '../../../src/domain/apple/jvmClassFile.js';

const classFile = (major: number, minor: number): Uint8Array => {
  const header = Buffer.alloc(10);
  header.writeUInt32BE(0xcafebabe, 0);
  header.writeUInt16BE(minor, 4);
  header.writeUInt16BE(major, 6);
  header.writeUInt16BE(5, 8);
  const body = Buffer.alloc(14);
  body.writeUInt16BE(0x0021, 0); // ACC_PUBLIC | ACC_SUPER
  body.writeUInt16BE(2, 2); // this_class
  body.writeUInt16BE(4, 4); // super_class
  // No interfaces, fields, methods or attributes.
  return Buffer.concat([
    header,
    Buffer.from([1, 0, 1, 67]), // #1 Utf8 C
    Buffer.from([7, 0, 1]), // #2 Class C
    Buffer.from([1, 0, 16]),
    Buffer.from('java/lang/Object', 'utf8'), // #3 Utf8
    Buffer.from([7, 0, 3]), // #4 Class java/lang/Object
    body,
  ]);
};

describe('JVM modern class-file minor versions', () => {
  it('rejects minor versions other than 0 or 65535 for major 56 and later', () => {
    expect(isJvmClassFile(classFile(56, 1))).toBe(false);
    expect(isJvmClassFile(classFile(61, 42))).toBe(false);
  });

  it('accepts ordinary and preview modern versions and legacy minor versions', () => {
    expect(isJvmClassFile(classFile(56, 0))).toBe(true);
    expect(isJvmClassFile(classFile(61, 65535))).toBe(true);
    expect(isJvmClassFile(classFile(55, 1))).toBe(true);
  });
});
