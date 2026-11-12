import { describe, it } from 'vitest';

import { normalizeKunaAddress, compareKunaAddresses } from '../../../src/kuna/KunaAddress.js';
import { parseKunaExportSummary } from '../../../src/kuna/KunaProjectFiles.js';
import { htmlUrlText, percentDecodeUrlPath, stripQueryAndFragment, hasScheme, looksExternal, admitsCanonicalPathSyntax } from '../../../src/domain/artifactPathSyntax.js';
import { windowAnnotationText } from '../../../src/domain/signals/annotationTextWindow.js';
import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';
import { hasZipSignature, zipPackageFormatForPath } from '../../../src/domain/zipPackageFormat.js';
import { detectReferenceSourceLanguage, classifyReferenceSourcePath } from '../../../src/domain/referenceSourceClassification.js';
import { inferJsonShape } from '../../../src/domain/jsonShape.js';
import { compareUnicodeCodePoints } from '../../../src/domain/unicodeCodePointOrder.js';
import { parseRecordedTransportUrl } from '../../../src/domain/recordedTransportUrl.js';
import { webSourceOffset } from '../../../src/domain/webSourcePosition.js';
import { compatibleSlice } from '../../../src/domain/apple/dyldPaths.js';
import { machoCpuSubtypeBase } from '../../../src/domain/apple/machoCpuIdentity.js';
import { parseOffsetDateTimeInstant, compareOffsetDateTimeInstants } from '../../../src/domain/offsetDateTime.js';
import { readPngHeaderDimensions } from '../../../src/domain/pngHeader.js';
import { compactStringIdentityKey } from '../../../src/domain/compactStringIdentity.js';
import { hasValidSourceMapContents } from '../../../src/domain/sourceMapContents.js';
import { uniqueSorted } from '../../../src/domain/canonicalOrdering.js';

const show = (label: string, value: unknown) => {
  console.log(label, '=>', JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? `${v}n` : v)));
};

describe('probe round 1', () => {
  it('prints behaviour of small pure helpers', () => {
    for (const value of ['0x0', '0X1F', '0x00ff', '0x', '0xffffffffffffffff', '0x00000000000000000001', ' 0x1', '0x1 ']) {
      show(`normalizeKunaAddress(${JSON.stringify(value)})`, normalizeKunaAddress(value));
    }
    show('compare(0x10,0x9)', compareKunaAddresses('0x10', '0x9'));
    show('summary trailing text', parseKunaExportSummary('functions: 3 ok, 1 failed\n'));
    show('summary zero', parseKunaExportSummary('functions: 0 ok, 0 failed'));
    show('summary negative-looking', parseKunaExportSummary('functions: 03 ok, 1 failed'));

    show('htmlUrlText("\u0000 a\u0000 ")', htmlUrlText('\u0000 a\u0000 '));
    show('htmlUrlText("a b")', htmlUrlText('a b'));
    show('percentDecode("%zz")', percentDecodeUrlPath('%zz'));
    show('percentDecode("%2")', percentDecodeUrlPath('%2'));
    show('percentDecode("%2541")', percentDecodeUrlPath('%2541'));
    show('stripQueryAndFragment("a#f?x")', stripQueryAndFragment('a#f?x'));
    show('hasScheme("1abc:x")', hasScheme('1abc:x'));
    show('hasScheme("a:")', hasScheme('a:'));
    show('looksExternal("/x")', looksExternal('/x'));
    show('admitsCanonicalPathSyntax("%2E")', admitsCanonicalPathSyntax('%2E'));
    show('admitsCanonicalPathSyntax("%25 2e")', admitsCanonicalPathSyntax('%252e'));

    show('window("", 0, null)', windowAnnotationText('', 0, null));
    show('window("a\\nb", 1, null)', windowAnnotationText('a\nb', 1, null));
    show('window("a\\nb", 2, null)', windowAnnotationText('a\nb', 2, null));
    show('window("a\\nb", 5, 2)', windowAnnotationText('a\nb', 5, 2));
    show('window("a\\nb\\n", 0, 2)', windowAnnotationText('a\nb\n', 0, 2));

    show('decodeXmlText("&#x41;")', decodeXmlText('&#x41;'));
    show('decodeXmlText("&#X41;")', decodeXmlText('&#X41;'));
    show('decodeXmlText("&amp;")', decodeXmlText('&amp;'));
    show('decodeXmlText("&#0;")', decodeXmlText('&#0;'));
    show('decodeXmlText("&#x110000;")', decodeXmlText('&#x110000;'));
    show('decodeXmlText("&AMP;")', decodeXmlText('&AMP;'));

    show('hasZipSignature(short)', hasZipSignature(new Uint8Array([0x50, 0x4b])));
    show('zipFormat("A.ZIP")', zipPackageFormatForPath('A.ZIP'));
    show('zipFormat("x.msixbundle")', zipPackageFormatForPath('x.msixbundle'));
    show('zipFormat("x.APPX")', zipPackageFormatForPath('x.APPX'));
    show('zipFormat("x.hsp")', zipPackageFormatForPath('x.hsp'));
    show('zipFormat("x.app")', zipPackageFormatForPath('x.app'));

    for (const path of ['Dockerfile.dev', 'a/b.d.ts', 'x.MJS', 'README.MD', 'src/app.ts', 'dist/app.js', 'tests/a.ts', 'package.json', 'Makefile', 'noext', 'a/b/', '/']) {
      show(`lang(${path})`, detectReferenceSourceLanguage(path));
      show(`class(${path})`, classifyReferenceSourcePath(path));
    }

    show('shape{"a":[1,2]}', inferJsonShape('{"a":[1,2]}'));
    show('shape[[]]', inferJsonShape('[[]]'));
    show('cmp("a","A")', compareUnicodeCodePoints('a', 'A'));
    show('cmp("\\ud83d\\ude00","\\uffff")', compareUnicodeCodePoints('\u{1f600}', '\uffff'));

    show('rt url abs', parseRecordedTransportUrl('https://u:p@h:8080/a/../b?q=1#f'));
    show('rt url no scheme', parseRecordedTransportUrl('//h/a'));
    show('rt url opaque', parseRecordedTransportUrl('mailto:a@b'));
    show('rt url query include', parseRecordedTransportUrl('https://h/a?q=1', { includeQuery: true }));
    show('rt url space', parseRecordedTransportUrl(' https://h/a'));

    show('wsp line2', webSourceOffset('a\nbc\nd', { line: 2, column: 2 }));
    show('wsp crlf', webSourceOffset('ab\r\ncd', { line: 2, column: 1 }));
    show('wsp lone cr', webSourceOffset('ab\rcd', { line: 2, column: 0 }));
    show('wsp last', webSourceOffset('ab', { line: 1, column: 2 }));
    show('wsp beyond', webSourceOffset('ab', { line: 1, column: 3 }));

    show('slice x86_64h', compatibleSlice([{ architecture: 'x86_64', cpu_type: 0x01000007, cpu_subtype: 3 } as never], { architecture: 'x86_64h', cpu_type: 0x01000007, cpu_subtype: 8 }));
    show('subtype base', machoCpuSubtypeBase(0x80000003));

    show('odt frac', parseOffsetDateTimeInstant('2020-01-01T00:00:00.500Z'));
    show('odt frac zeros', parseOffsetDateTimeInstant('2020-01-01T00:00:00.000Z'));
    show('odt cmp', compareOffsetDateTimeInstants({ epochSecond: 1, fraction: '' }, { epochSecond: 1, fraction: '0' }));
    show('odt cmp2', compareOffsetDateTimeInstants({ epochSecond: 1, fraction: '1' }, { epochSecond: 1, fraction: '09' }));

    show('png too short', readPngHeaderDimensions(Buffer.alloc(23)));
    show('compact short', compactStringIdentityKey('abc'));
    show('compact prefix', compactStringIdentityKey('value-sha256:abc'));
    show('sourceMapContents empty', hasValidSourceMapContents([]));
    show('uniqueSorted', uniqueSorted(['b', 'a', 'a', '\u{1f600}', '\uffff']));
    void decodeXmlText;
  });
});
