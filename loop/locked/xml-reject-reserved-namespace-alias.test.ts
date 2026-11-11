import { describe, it, expect } from 'vitest';
import { parseXmlDocument } from '../../../src/domain/xmlDocument.js';

describe('XML reserved namespace aliases', () => {
  it('rejects binding the XML namespace URI to a non-xml prefix', () => {
    const parsed = parseXmlDocument(
      '<root xmlns:p="http://www.w3.org/XML/1998/namespace"/>',
      { doctype: 'reject', lineEndings: 'normalize' },
    );
    expect(parsed.ok).toBe(false);
    if (parsed.ok) throw new Error('Expected reserved namespace alias rejection');
    expect(parsed.error.reason).toBe('malformed');
  });

  it('allows a non-reserved namespace URI on an ordinary prefix', () => {
    const parsed = parseXmlDocument(
      '<root xmlns:p="urn:example" p:flag="yes"/>',
      { doctype: 'reject', lineEndings: 'normalize' },
    );
    expect(parsed.ok).toBe(true);
  });
});