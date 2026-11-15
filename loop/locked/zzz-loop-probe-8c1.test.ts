import { it } from 'vitest';

import { isDigest } from '../../../src/domain/digests.js';
import { CANONICAL_BASE64_PATTERN, IDENTIFIER_PATTERN } from '../../../src/domain/stringPatterns.js';
import { detectReferenceSourceLanguage } from '../../../src/domain/referenceSourceClassification.js';
import { zipPackageFormatForPath } from '../../../src/domain/zipPackageFormat.js';

it('probe', () => {
  const hex = 'a'.repeat(64);
  console.log('isDigest newline', isDigest(`${hex}\n`));
  console.log('isDigest cr', isDigest(`${hex}\r`));
  console.log('isDigest ls', isDigest(`${hex}\u2028`));
  console.log('isDigest plain', isDigest(hex));
  console.log('base64 nl', CANONICAL_BASE64_PATTERN.test('AAAA\n'));
  console.log('ident nl', IDENTIFIER_PATTERN.test('abc\n'));
  console.log('lang mk', detectReferenceSourceLanguage('foo.mk'));
  console.log('lang Makefile.mk', detectReferenceSourceLanguage('Makefile.mk'));
  console.log('lang sh', detectReferenceSourceLanguage('scripts/run.sh'));
  console.log('aab', zipPackageFormatForPath('app.aab'));
});
