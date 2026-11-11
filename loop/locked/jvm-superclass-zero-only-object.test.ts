import { describe, it, expect } from 'vitest';
import { isJvmClassFile } from '../../../src/domain/apple/jvmClassFile.js';

const classFile = (name: string, superClass: number): Uint8Array => {
  const utf8 = (text: string): Buffer => {
    const bytes = Buffer.from(text, 'utf8');
    const header = Buffer.alloc(3);
    header[0] = 1;
    header.writeUInt16BE(bytes.length, 1);
    return Buffer.concat([header, bytes]);
  };
  const body = Buffer.alloc(14);
  body.writeUInt16BE(0x0021, 0); // ACC_PUBLIC | ACC_SUPER
  body.writeUInt16BE(2, 2); // this_class
  body.writeUInt16BE(superClass, 4);
  // interfaces_count, fields_count, methods_count, attributes_count are zero.
  return Buffer.concat([
    Buffer.from([0xca, 0xfe, 0xba, 0xbe, 0, 0, 0, 52, 0, 5]),
    utf8(name),                       // #1 Utf8
    Buffer.from([7, 0, 1]),            // #2 Class
    utf8('java/lang/Object'),         // #3 Utf8
    Buffer.from([7, 0, 3]),            // #4 Class
    body,
  ]);
};

describe('JVM zero superclass identity', () => {
  it('accepts Object without a superclass and an ordinary class extending Object', () => {
    expect(isJvmClassFile(classFile('java/lang/Object', 0))).toBe(true);
    expect(isJvmClassFile(classFile('example/Child', 4))).toBe(true);
  });

  it('rejects an ordinary class with super_class zero (JVMS 4.1)', () => {
    expect(isJvmClassFile(classFile('example/Child', 0))).toBe(false);
  });
});
