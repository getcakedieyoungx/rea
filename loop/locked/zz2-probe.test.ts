import { it } from 'vitest';

import { urlDeclaresQueryOrFragment } from '../../../src/domain/urlComponents.js';
import { withoutEchoedPathHeader } from '../../../src/native/parsers/echoedPath.js';
import { isValidFridaRemoteAddress } from '../../../src/contracts/fridaRemoteAddress.js';
import { structuredFieldToken } from '../../../src/browser/StructuredFieldToken.js';
import { absoluteCallerPath } from '../../../src/filesystem/callerPath.js';
import { isPathWithinRoot } from '../../../src/domain/localPath.js';
import { pathFromRoot } from '../../../src/reference/ReferenceSourceReaderPaths.js';
import { nativeRuntimeConvention, isSwiftRuntimeLibrary } from '../../../src/domain/nativeConvention.js';
import { parseLoaderArgs, parseStringArray } from '../../../src/config/parsers.js';

const show = (label: string, value: unknown) => console.log(label, JSON.stringify(value));

it('probe', () => {
  for (const u of [
    'https://a.test/x',
    'https://a.test/x?',
    'https://a.test/x#',
    'https://a.test/x?#',
    'https://a.test/x#y?z',
  ]) show(`url ${u}`, urlDeclaresQueryOrFragment(new URL(u)));

  show('echo1', withoutEchoedPathHeader('/bin/a (architecture arm64):\nrow', '/bin/a'));
  show('echo2', withoutEchoedPathHeader('/bin/a [arm64]:\nrow', '/bin/a'));
  show('echo3', withoutEchoedPathHeader('/bin/a:\nrow', '/bin/a'));
  show('echo4', withoutEchoedPathHeader('/bin/a:row', '/bin/a'));
  show('echo5', withoutEchoedPathHeader('/bin/a\r\nrow', '/bin/a'));

  for (const a of ['localhost', 'localhost:27042', '::1', '[::1]', '[::1]:27042', 'h:65535', 'h:0', 'h: 22', 'h..', '-bad-'])
    show(`frida ${a}`, isValidFridaRemoteAddress(a));

  for (const v of [undefined, 'next', ' next ', 'next;a=b', 'next; a=1', 'next;a', 'next;a="x y"', 'next;binary=:aGVsbG8=:', 'next;binary=:abcde:', 'next;x=:a:', 'next ,', 'Next'])
    show(`sf ${String(v)}`, structuredFieldToken(v));

  for (const [p, cwd] of [['/a//b', '/'], ['//a/b', '/'], ['/a/../b', '/'], ['/', '/'], ['/a/.', '/'], ['a/./b', '/cwd'], ['.', '/cwd'], ['..', '/cwd'], ['/a/b/', '/'], ['/a/b//', '/']])
    show(`abs ${p} cwd=${cwd}`, absoluteCallerPath(p, { cwd, platform: 'linux' }));

  show('within', [isPathWithinRoot('/a', '/a'), isPathWithinRoot('/a', '/ab'), isPathWithinRoot('/', '/x')]);
  show('pathFromRoot', pathFromRoot('/r', '/r'), pathFromRoot('/r', '/r/x'), pathFromRoot('/r', '/x'));

  show('nrc', [nativeRuntimeConvention('a/b/libflutter.so/c'), nativeRuntimeConvention('Flutter.framework'), nativeRuntimeConvention('C:\\x\\libflutter.so')]);
  show('swift', [isSwiftRuntimeLibrary('/usr/lib/libswiftCore.dylib'), isSwiftRuntimeLibrary('/x/libswift.dylib'), isSwiftRuntimeLibrary('/x/libswiftCore.so')]);

  show('loaderArgs', [parseLoaderArgs('[]'), parseLoaderArgs('["", "a"]'), parseLoaderArgs('"a"'), parseLoaderArgs('[1]')]);
  show('stringArray', parseStringArray('["a", ""]', 'SETTING'));
});
