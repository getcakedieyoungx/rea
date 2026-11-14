import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('timing probe', () => {
  it('measures', () => {
    const n = 20000;
    const arr: unknown[] = Array.from({ length: n }, () => 0);
    const schema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
    let t = Date.now();
    for (let i = 0; i < n; i++) Object.getOwnPropertyDescriptor(arr, i);
    console.log('gopd', Date.now() - t);
    t = Date.now();
    const out: unknown[] = [];
    for (let i = 0; i < n; i++) out.push(schema.parse(0));
    console.log('parse', Date.now() - t);
    t = Date.now();
    for (let i = 0; i < n; i++) out.push(0);
    console.log('push', Date.now() - t);
    expect(true).toBe(true);
  }, 120000);
});
