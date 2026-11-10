import { describe, it, expect } from 'vitest';
import { parseXmlDocument } from '../../../src/domain/xmlDocument.js';

describe('XML attribute expanded-name uniqueness', () => {
  it('accepts identical local names in different namespaces', () => {
    const parsed = parseXmlDocument(
      '<root xmlns:a="urn:first" xmlns:b="urn:second" a:id="1" b:id="2"/>',
      { doctype: 'reject', lineEndings: 'normalize' },
    );
    expect(parsed.ok).toBe(true);
  });

  it('rejects duplicate expanded attribute names hidden behind different prefixes', () => {
    const parsed = parseXmlDocument(
      '<root xmlns:a="urn:same" xmlns:b="urn:same" a:id="1" b:id="2"/>',
      { doctype: 'reject', lineEndings: 'normalize' },
    );
    expect(parsed.ok).toBe(false);
    if (parsed.ok) throw new Error('Expected duplicate expanded attribute rejection');
    expect(parsed.error.reason).toBe('malformed');
  });
});
