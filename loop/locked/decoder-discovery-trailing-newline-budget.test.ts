import { describe, it, expect } from 'vitest';
import { parseDecoderDiscovery } from '../../../src/signals/parseDecoderDiscovery.js';

describe('sigrok decoder catalog line budget', () => {
  it('does not count a final line terminator as an extra line', () => {
    const lines = [
      'Supported protocol decoders:',
      ...Array.from(
        { length: 65_535 },
        (_unused, index) => `  d${index} Decoder ${index}`,
      ),
    ];
    const withoutTrailingTerminator = lines.join('\n');
    const withTrailingTerminator = `${withoutTrailingTerminator}\n`;
    const input = { decoder: null, query: '', offset: 0, limit: 2 };

    const accepted = parseDecoderDiscovery(withoutTrailingTerminator, input);

    // Same 65,536-line catalog, only spelled with a trailing newline.
    // Currently throws DecoderDiscoveryBudgetError because the counting loop
    // treats that terminator as a 65,536th line separator.
    const acceptedWithTerminator = parseDecoderDiscovery(
      withTrailingTerminator,
      input,
    );

    expect(acceptedWithTerminator.output_window).toEqual(
      accepted.output_window,
    );
    expect(acceptedWithTerminator.output_window.examined).toBe(65_535);
    expect(acceptedWithTerminator.output_window.matching).toBe(65_535);
    expect(acceptedWithTerminator.decoders).toHaveLength(2);
    expect(acceptedWithTerminator.output_window.has_more).toBe(true);
  });
});