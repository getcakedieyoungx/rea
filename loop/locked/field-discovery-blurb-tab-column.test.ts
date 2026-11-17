import { describe, it, expect } from 'vitest';

import { parseFieldDiscovery } from '../../../src/captures/parseFieldDiscovery.js';
import type { InspectPacketFieldsInput } from '../../../src/domain/captures/packetFields.js';

// `tshark -G fields` emits fixed tab-separated columns:
//   F/name/abbreviation/type/parent/base/mask/blurb
// The blurb is free-form registry text, so a blurb may itself contain a tab.
// The last column therefore has to absorb every remaining tab instead of the
// record being rejected as malformed.
const selectAllFields: InspectPacketFieldsInput = {
  kind: 'fields',
  protocol: null,
  query: '',
  offset: 0,
  limit: 50,
};

const fieldsRecord = (blurb: string): string =>
  ['F', 'ip.proto', 'IP Protocol', 'FT_UINT8', 'ip', 'BASE_DEC', '0x0', blurb].join(
    '\t',
  );

describe('parseFieldDiscovery glossary column splitting', () => {
  it('keeps a blurb that contains a tab instead of calling the record malformed', () => {
    const text = `${fieldsRecord('Protocol\t(see note)')}\n`;

    expect(() => parseFieldDiscovery(text, selectAllFields)).not.toThrow();

    const [record] = parseFieldDiscovery(text, selectAllFields).records;
    expect(record?.kind).toBe('field');
    expect(record?.name).toBe('ip.proto');
    expect(record?.field_type).toBe('FT_UINT8');
    expect(record?.parent_protocol).toBe('ip');
    expect(record?.display_base).toBe('BASE_DEC');
    expect(record?.bitmask).toBe('0x0');
    expect(record?.description).toBe('Protocol\t(see note)');
  });

  it('still rejects a field record that is short of the eight required columns', () => {
    const text = ['F', 'ip.proto', 'IP Protocol', 'FT_UINT8', 'ip', 'BASE_DEC'].join(
      '\t',
    );

    expect(() => parseFieldDiscovery(text, selectAllFields)).toThrow(
      /Malformed TShark field glossary record/,
    );
  });
});
