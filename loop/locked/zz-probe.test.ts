import { describe, it, expect } from 'vitest';
import { compareUnicodeCodePoints } from '../../../src/domain/unicodeCodePointOrder.js';
import { addressCoordinate } from '../../../src/domain/native/addressCoordinate.js';
import { normalizeKunaAddress, compareKunaAddresses } from '../../../src/kuna/KunaAddress.js';
import { stripQueryAndFragment, htmlUrlText, percentDecodeUrlPath } from '../../../src/domain/artifactPathSyntax.js';
import { decodePeMachine } from '../../../src/domain/peMachine.js';
import { boundedUtf8Text } from '../../../src/process/boundedUtf8Text.js';
import { webSourceOffset } from '../../../src/domain/webSourcePosition.js';
import { macoCpuSubtypeBase } from '../../../src/domain/apple/machoCpuIdentity.js';
import { normalizeJoinedLogicalPath, logicalPathEscapesRoot } from '../../../src/domain/artifactIdentity.js';
import { nativeRuntimeConvention } from '../../../src/domain/nativeConvention.js';

describe('probe', () => {
  it('runs', () => {
    console.log('cmp', compareUnicodeCodePoints('a', 'ab'), compareUnicodeCodePoints('\u{1F600}', '\uFFFF'));
    console.log('addr', addressCoordinate('0x10'), addressCoordinate('mod:0x10'), addressCoordinate('mod:0x0'), addressCoordinate('0x0'));
    console.log('kuna', normalizeKunaAddress('0x000000000000000000001'), normalizeKunaAddress('0X1'), normalizeKunaAddress('0x'));
    console.log('cmpkuna', compareKunaAddresses('0x10', '0xf'));
    console.log('q', JSON.stringify(stripQueryAndFragment('a?b#c')), JSON.stringify(htmlUrlText('  a\tb  ')));
    console.log('pe', JSON.stringify(decodePeMachine(0x8664 ^ 0x7b79)), JSON.stringify(decodePeMachine(0xaa64 ^ 0x4644)));
    console.log('buf', JSON.stringify(boundedUtf8Text('aé', 1)), JSON.stringify(boundedUtf8Text('é', 0)));
    console.log('pos', webSourceOffset('ab\r\ncd', { line: 2, column: 1 }));
    console.log('cpu', macoCpuSubtypeBase(0x80000003 | 0), macoCpuSubtypeBase(-1));
    console.log('join', normalizeJoinedLogicalPath('./a/../b'), normalizeJoinedLogicalPath('a//b'), logicalPathEscapesRoot(normalizeJoinedLogicalPath('../x')));
    console.log('conv', nativeRuntimeConvention('a\\Flutter.framework\\Flutter'), nativeRuntimeConvention('libflutter.so'));
    expect(1).toBe(1);
  });
});
