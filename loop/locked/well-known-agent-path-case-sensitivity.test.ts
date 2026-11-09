import { describe, it, expect } from 'vitest';
import { safeResponseMetadata } from '../../../src/browser/CdpSafeMetadata.js';

describe('well-known agent resource path identity', () => {
  it('does not treat case-distinct URL paths as registered well-known resources', () => {
    const origin = 'https://app.example.test';
    for (const path of [
      '/.well-known/MCP',
      '/.WELL-KNOWN/mcp',
      '/.well-known/AI-PLUGIN.json',
      '/.well-known/Model-Context',
    ]) {
      const captured = safeResponseMetadata(
        'request-case-distinct',
        `${origin}${path}`,
        { headers: {} },
        new Set([origin]),
      );

      expect(captured.agentHints).toEqual([]);
    }
  });

  it('still recognizes the exact registered path', () => {
    const origin = 'https://app.example.test';
    const url = `${origin}/.well-known/mcp`;
    const captured = safeResponseMetadata(
      'request-exact-path',
      url,
      { headers: {} },
      new Set([origin]),
    );

    expect(captured.agentHints).toEqual([
      {
        mechanism: 'well_known_resource',
        declaration: '/.well-known/mcp',
        url,
        trust: 'page-declared-untrusted',
      },
    ]);
  });
});
