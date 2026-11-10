import { describe, it, expect } from 'vitest';
import { parseXmlDocument } from '../../../src/domain/xmlDocument.js';

describe('XML reserved namespace prefix validation', () => {
  it('accepts the standard xml namespace binding', () => {
    const parsed = parseXmlDocument(
      '<root xmlns:xml="http://www.w3.org/XML/1998/namespace" xml:lang="tr"/>',
      { doctype: 'reject', lineEndings: 'normalize' },
    );
    expect(parsed.ok).toBe(true);
  });

  it('rejects rebinding the reserved xml prefix to an unrelated namespace', () => {
    const parsed = parseXmlDocument(
      '<root xmlns:xml="urn:wrong"/>',
      { doctype: 'reject', lineEndings: 'normalize' },
    );
    expect(parsed.ok).toBe(false);
    if (parsed.ok) throw new Error('Expected malformed XML namespace rejection');
    expect(parsed.error.reason).toBe('malformed');
  });
});
