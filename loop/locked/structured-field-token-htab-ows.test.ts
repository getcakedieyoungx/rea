import { describe, it, expect } from 'vitest';
import { structuredFieldToken } from '../../../src/browser/StructuredFieldToken.js';

describe('Structured Field Item OWS accepts HTAB as well as SP', () => {
  it('trims tab-delimited leading and trailing OWS around a policy token', () => {
    // RFC 9651 section 4.2.1 defines OWS as *( SP / HTAB ), and section 4.2
    // strips it before parsing the Item. A captured header such as
    // "Cross-Origin-Opener-Policy: \tno-cors\t" is therefore a valid token.
    // Fails today: the OWS loops only skip " ", so the tab stops the token
    // match at index 0 and this expectation receives null.
    expect(structuredFieldToken('\tno-cors\t')).toBe('no-cors');
  });

  it('accepts tab OWS between a parameter separator and its key', () => {
    // "no-cors;\tfoo=1" is one valid Item with one parameter: OWS may follow
    // the ";" separator as either SP or HTAB.
    // Fails today: after "no-cors" the tab is neither ";" nor SP, so the whole
    // item is rejected and this expectation receives null.
    expect(structuredFieldToken('no-cors;\tfoo=1')).toBe('no-cors');
  });
});