import { describe, it, expect } from 'vitest';
import { isJvmClassFile } from '../../../src/domain/apple/jvmClassFile.js';

const classWithInterface = (interfaceIndex: number): Uint8Array => {
  const utf8 = (text: string): Buffer => {
    const value = Buffer.from(text, 'utf8');
    const header = Buffer.alloc(3);
    header[0] = 1;
    header.writeUInt16BE(value.length, 1);
    return Buffer.concat([header, value]);
  };
  const body = Buffer.alloc(16);
  body.writeUInt16BE(0x0021, 0); // ACC_PUBLIC | ACC_SUPER
  body.writeUInt16BE(2, 2); // this_class: Class C
  body.writeUInt16BE(4, 4); // super_class: Class java/lang/Object
  body.writeUInt16BE(1, 6); // interfaces_count
  body.writeUInt16BE(interfaceIndex, 8);
  // fields_count, methods_count, attributes_count are zero.
  return Buffer.concat([
    Buffer.from([0xca, 0xfe, 0xba, 0xbe, 0, 0, 0, 52, 0, 7]),
    utf8('C'),                         // #1 Utf8
    Buffer.from([7, 0, 1]),             // #2 Class
    utf8('java/lang/Object'),           // #3 Utf8
    Buffer.from([7, 0, 3]),             // #4 Class
    utf8('java/lang/Runnable'),         // #5 Utf8
    Buffer.from([7, 0, 5]),             // #6 Class
    body,
  ]);
};

describe('JVM interface constant-pool references', () => {
  it('accepts a framed class whose interface references CONSTANT_Class', () => {
    expect(isJvmClassFile(classWithInterface(6))).toBe(true);
  });

  it('rejects zero, non-Class and out-of-range interface indices', () => {
    for (const index of [0, 1, 7]) {
      expect(isJvmClassFile(classWithInterface(index))).toBe(false);
    }
  });
});
