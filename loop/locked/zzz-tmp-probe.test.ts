import { describe, it, expect } from 'vitest';
import { compareUnicodeCodePoints } from '../../../src/domain/unicodeCodePointOrder.js';
import { stripQueryAndFragment, htmlUrlText, percentDecodeUrlPath, admitsCanonicalPathSyntax } from '../../../src/domain/artifactPathSyntax.js';
import { webSourceOffset } from '../../../src/domain/webSourcePosition.js';
import { isPathWithinRoot } from '../../../src/domain/localPath.js';
import { zipPackageFormatForPath } from '../../../src/domain/zipPackageFormat.js';
import { detectReferenceSourceLanguage, classifyReferenceSourcePath } from '../../../src/domain/referenceSourceClassification.js';
import { isWithin, anatomyTailMatches } from '../../../src/domain/apple/appleBundleAnatomy.js';
import { nativeRuntimeConvention, isSwiftRuntimeLibrary } from '../../../src/domain/nativeConvention.js';
import { pageViewCoverage } from '../../../src/domain/analysisView/analysisViewCoverage.js';
import { inferJsonShape } from '../../../src/domain/jsonShape.js';
import { compactStringIdentityKey } from '../../../src/domain/compactStringIdentity.js';

const log = (...args: unknown[]) => console.log(...args);

describe('probe', () => {
  it('dumps', () => {
    log('cmp astral', compareUnicodeCodePoints('\u{10000}', '\uFFFF'));
    log('cmp lone-surrogate vs E000', compareUnicodeCodePoints('\uD800', '\u{E000}'));
    log('cmp prefix', compareUnicodeCodePoints('a', 'ab'));
    log('strip', JSON.stringify([
      stripQueryAndFragment('a?b#c'),
      stripQueryAndFragment('?x'),
      stripQueryAndFragment('#y'),
      stripQueryAndFragment('a#b?c'),
      stripQueryAndFragment(''),
    ]));
    log('htmlUrlText', JSON.stringify([htmlUrlText(' \t\n a b \n'), htmlUrlText('\u0000x\u0000')]));
    log('pct', JSON.stringify([
      percentDecodeUrlPath('%41%42'),
      percentDecodeUrlPath('a%2Fb'),
      percentDecodeUrlPath('%'),
      percentDecodeUrlPath('%C3%A9'),
      percentDecodeUrlPath('%ED%A0%80'),
      percentDecodeUrlPath('%00'),
    ]));
    log('admits', JSON.stringify([admitsCanonicalPathSyntax('a%2Eb'), admitsCanonicalPathSyntax('a%00b')]));
    log('webSourceOffset', JSON.stringify([
      webSourceOffset('a\nbb\n', { line: 2, column: 2 }),
      webSourceOffset('a\nbb\n', { line: 2, column: 3 }),
      webSourceOffset('a\r\nb', { line: 2, column: 0 }),
      webSourceOffset('a\r\nb', { line: 1, column: 1 }),
      webSourceOffset('a\u2028b', { line: 2, column: 0 }),
      webSourceOffset('', { line: 1, column: 0 }),
    ]));
    log('isPathWithinRoot', JSON.stringify([
      isPathWithinRoot('/a/b', '/a/b/c'),
      isPathWithinRoot('/a/b', '/a/bc'),
      isPathWithinRoot('/a/b', '/a/b/'),
      isPathWithinRoot('/', '/a'),
      isPathWithinRoot('', 'a'),
    ]));
    log('zip', JSON.stringify([
      zipPackageFormatForPath('X.APK'),
      zipPackageFormatForPath('x.apks'),
      zipPackageFormatForPath('x.app'),
      zipPackageFormatForPath('dir.zip/file.apk'),
    ]));
    log('lang', JSON.stringify([
      detectReferenceSourceLanguage('foo.XML'),
      detectReferenceSourceLanguage('.gitignore'),
      detectReferenceSourceLanguage('Dockerfile.dev'),
      detectReferenceSourceLanguage('a/b.d.ts'),
      detectReferenceSourceLanguage('Makefile'),
      detectReferenceSourceLanguage('x.min.js'),
    ]));
    log('classify', JSON.stringify([
      classifyReferenceSourcePath('src/foo.ts'),
      classifyReferenceSourcePath('tests/foo.test.ts'),
      classifyReferenceSourcePath('README.md'),
      classifyReferenceSourcePath('docs/api/x.js'),
      classifyReferenceSourcePath('Makefile'),
      classifyReferenceSourcePath('libs/foo.js'),
      classifyReferenceSourcePath('node_modules/x/index.js'),
      classifyReferenceSourcePath('/'),
      classifyReferenceSourcePath('foo.json'),
      classifyReferenceSourcePath('App.tsx'),
    ]));
    log('anatomy', JSON.stringify([
      isWithin('a/b', 'a'),
      isWithin('a', 'a'),
      isWithin('./x', '.'),
      anatomyTailMatches('Payload/X.app', ['Payload', '*']),
      anatomyTailMatches('a/b/Contents', ['*', 'Contents']),
      anatomyTailMatches('Contents', ['*', 'Contents']),
    ]));
    log('native', JSON.stringify([
      nativeRuntimeConvention('a/LibHermes.so'),
      isSwiftRuntimeLibrary('x/libswiftCore.dylib'),
      isSwiftRuntimeLibrary('x/libswift.dylib'),
    ]));
    log('coverage', JSON.stringify([
      pageViewCoverage(0, 0, 5),
      pageViewCoverage(0, 2, 5),
      pageViewCoverage(5, 0, 5),
      pageViewCoverage(4, 1, 5),
      pageViewCoverage(6, 0, 5),
    ]));
    log('jsonShape nested', JSON.stringify(inferJsonShape('{"a":[1,2],"b":{"a":3}}')));
    log('jsonShape empty arr', JSON.stringify(inferJsonShape('{"a":[]}')));
    log('compact', JSON.stringify([
      compactStringIdentityKey('short'),
      compactStringIdentityKey('value-sha256:short'),
    ]));
    expect(1).toBe(1);
  });
});
