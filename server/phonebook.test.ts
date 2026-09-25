import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  loadPhonebook,
  normalizeQuery,
  searchPhonebook,
  searchPhonebookPage,
  type Contact,
} from './phonebook.js';

const syntheticContacts: Contact[] = [
  { id: 'contact-0', name: 'Anna Muster', phone: '0123' },
  { id: 'contact-1', name: 'Annabelle Beispiel', phone: '0456' },
  { id: 'contact-2', name: 'Anna Muster', phone: '0789' },
  { id: 'contact-3', name: 'Müller Test', phone: '0001' },
];

describe('Phonebook data', () => {
  it('loads the provided file and adds only server-side IDs', async () => {
    const contacts = await loadPhonebook(
      path.resolve('server/data/telefonbuch.json'),
    );

    expect(contacts).toHaveLength(120);
    expect(contacts.every((contact) => /^contact-\d+$/.test(contact.id))).toBe(
      true,
    );
    expect(contacts.every((contact) => contact.phone.startsWith('0'))).toBe(
      true,
    );
  });
});

describe('Search', () => {
  it('finds substrings case-insensitively', () => {
    expect(searchPhonebook(syntheticContacts, 'NNA')).toEqual(
      syntheticContacts.slice(0, 3),
    );
  });

  it('trims outer whitespace and keeps duplicate names as separate matches', () => {
    const results = searchPhonebook(syntheticContacts, '  anna muster  ');

    expect(results).toEqual([syntheticContacts[0], syntheticContacts[2]]);
    expect(results.map((contact) => contact.phone)).toEqual(['0123', '0789']);
  });

  it('returns no matches for an empty query', () => {
    expect(searchPhonebook(syntheticContacts, '   ')).toEqual([]);
  });

  it('does not equate umlauts with transliterations', () => {
    expect(searchPhonebook(syntheticContacts, 'mueller')).toEqual([]);
    expect(searchPhonebook(syntheticContacts, 'müller')).toEqual([
      syntheticContacts[3],
    ]);
  });

  it('rejects queries that exceed the maximum length', () => {
    expect(() => normalizeQuery('a'.repeat(101))).toThrow(
      'must not exceed 100 characters',
    );
  });
});

describe('Pagination', () => {
  const paginatedContacts: Contact[] = Array.from(
    { length: 26 },
    (_, index) => ({
      id: `contact-${index + 1}`,
      name: `Example ${String(index + 1).padStart(2, '0')}`,
      phone: `01${String(index).padStart(2, '0')}`,
    }),
  );

  it('returns every matching contact exactly once across all pages', () => {
    const pages = [1, 2, 3].map((page) =>
      searchPhonebookPage(paginatedContacts, 'example', page, 10),
    );
    const resultIds = pages.flatMap((result) =>
      result.contacts.map((contact) => contact.id),
    );

    expect(pages.map((result) => result.contacts)).toHaveLength(3);
    expect(pages.map((result) => result.contacts.length)).toEqual([10, 10, 6]);
    expect(new Set(resultIds)).toHaveLength(26);
    expect(resultIds).toEqual(paginatedContacts.map((contact) => contact.id));
  });

  it('uses the stable ID to order contacts with the same name', () => {
    const sameNameContacts: Contact[] = [
      { id: 'contact-12', name: 'Same Name', phone: '012' },
      { id: 'contact-2', name: 'Same Name', phone: '002' },
    ];

    const result = searchPhonebookPage(sameNameContacts, 'same', 1, 10);

    expect(result.contacts.map((contact) => contact.id)).toEqual([
      'contact-2',
      'contact-12',
    ]);
    expect(result.totalCount).toBe(2);
  });

  it('supports configured page sizes and returns page metadata', () => {
    const result = searchPhonebookPage(paginatedContacts, 'example', 2, 25);

    expect(result.contacts).toHaveLength(1);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(25);
    expect(result.totalCount).toBe(26);
    expect(result.totalPages).toBe(2);
  });

  it('returns the complete directory alphabetically for an empty query', () => {
    const result = searchPhonebookPage(
      [
        { id: 'contact-2', name: 'Zoe Beispiel', phone: '0456' },
        { id: 'contact-1', name: 'Anna Muster', phone: '0123' },
      ],
      '',
      1,
      10,
    );

    expect(result.contacts.map((contact) => contact.name)).toEqual([
      'Anna Muster',
      'Zoe Beispiel',
    ]);
    expect(result.totalCount).toBe(2);
  });

  it('handles no results and rejects invalid pages or page sizes', () => {
    expect(searchPhonebookPage(paginatedContacts, 'missing', 1, 10)).toEqual({
      contacts: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
    });
    expect(() =>
      searchPhonebookPage(paginatedContacts, 'example', 0, 10),
    ).toThrow('must be at least 1');
    expect(() =>
      searchPhonebookPage(paginatedContacts, 'example', 1, 20),
    ).toThrow('10, 25, or 50');
    expect(() =>
      searchPhonebookPage(paginatedContacts, 'example', 4, 10),
    ).toThrow('Requested page does not exist');
  });
});

describe('Search result ranking', () => {
  const rankingContacts: Contact[] = [
    { id: 'contact-8', name: 'Benjamin', phone: '0108' },
    { id: 'contact-2', name: 'Jan', phone: '0102' },
    { id: 'contact-5', name: 'Lena-Jansen', phone: '0105' },
    { id: 'contact-1', name: 'Jansen', phone: '0101' },
    { id: 'contact-4', name: 'Zaja', phone: '0104' },
    { id: 'contact-12', name: 'Jan', phone: '0112' },
  ];

  it('prioritizes starts of names and later name parts before other substrings', () => {
    const result = searchPhonebookPage(rankingContacts, 'JA', 1, 10);

    expect(result.contacts.map((contact) => contact.id)).toEqual([
      'contact-2',
      'contact-12',
      'contact-1',
      'contact-5',
      'contact-8',
      'contact-4',
    ]);
    expect(result.totalCount).toBe(6);
  });

  it('keeps multi-word substring matching and prioritizes matching name-part starts', () => {
    const contacts: Contact[] = [
      { id: 'contact-1', name: 'Hanna Maria', phone: '0101' },
      { id: 'contact-2', name: 'Anna Maria', phone: '0102' },
      { id: 'contact-3', name: 'X Anna Maria', phone: '0103' },
    ];

    const result = searchPhonebookPage(contacts, 'anna ma', 1, 10);

    expect(result.contacts.map((contact) => contact.id)).toEqual([
      'contact-2',
      'contact-3',
      'contact-1',
    ]);
  });

  it('preserves ranked order and complete IDs across page boundaries', () => {
    const contacts: Contact[] = Array.from({ length: 12 }, (_, index) => ({
      id: `contact-${index + 1}`,
      name: index < 6 ? `Jan ${index}` : `Benjamin ${index}`,
      phone: `01${String(index).padStart(2, '0')}`,
    }));
    const firstPage = searchPhonebookPage(contacts, 'ja', 1, 10);
    const secondPage = searchPhonebookPage(contacts, 'ja', 2, 10);
    const ids = [...firstPage.contacts, ...secondPage.contacts].map(
      (contact) => contact.id,
    );

    expect(ids).toEqual([
      'contact-1',
      'contact-2',
      'contact-3',
      'contact-4',
      'contact-5',
      'contact-6',
      'contact-11',
      'contact-12',
      'contact-7',
      'contact-8',
      'contact-9',
      'contact-10',
    ]);
    expect(new Set(ids)).toHaveLength(12);
  });
});
