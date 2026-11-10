import { describe, it, expect } from 'vitest';
import { parseXmlDocument } from '../../../src/domain/xmlDocument.js';

describe('XML 1.0 empty namespace declarations', () => {
  it('rejects an empty namespace name for a named prefix', () => {
    const parsed = parseXmlDocument(
      '<?xml version="1.0"?><root xmlns:p=""/>',
      { doctype: 'reject', lineEndings: 'preserve' },
    );
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error.reason).toBe('malformed');
  });

  it('still permits clearing the default namespace', () => {
    const parsed = parseXmlDocument(
      '<?xml version="1.0"?><root xmlns="urn:example"><child xmlns=""/></root>',
      { doctype: 'reject', lineEndings: 'preserve' },
    );
    expect(parsed.ok).toBe(true);
  });
});
