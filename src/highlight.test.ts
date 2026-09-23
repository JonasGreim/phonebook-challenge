import { describe, expect, it } from 'vitest';
import { getHighlightParts } from './highlight.js';

describe('getHighlightParts', () => {
  it('preserves the original name while highlighting a case-insensitive match', () => {
    const parts = getHighlightParts('James', 'ja');

    expect(parts).toEqual([
      { highlighted: true, text: 'Ja' },
      { highlighted: false, text: 'mes' },
    ]);
    expect(parts.map((part) => part.text).join('')).toBe('James');
  });

  it('highlights every non-overlapping literal occurrence without treating symbols as regex', () => {
    expect(getHighlightParts('A+[A+[', 'a+[')).toEqual([
      { highlighted: true, text: 'A+[' },
      { highlighted: true, text: 'A+[' },
    ]);
  });

  it('returns the complete original name without a highlight for an empty query', () => {
    expect(getHighlightParts('Anna Muster', '   ')).toEqual([
      { highlighted: false, text: 'Anna Muster' },
    ]);
  });
});
