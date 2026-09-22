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

describe('Telefonbuchdaten', () => {
  it('lädt die bereitgestellte Datei und ergänzt nur serverseitige IDs', async () => {
    const contacts = await loadPhonebook(path.resolve('telefonbuch.json'));

    expect(contacts).toHaveLength(120);
    expect(contacts.every((contact) => /^contact-\d+$/.test(contact.id))).toBe(
      true,
    );
    expect(contacts.every((contact) => contact.phone.startsWith('0'))).toBe(
      true,
    );
  });
});

describe('Suche', () => {
  it('findet Teilstrings ohne Beachtung der Groß- und Kleinschreibung', () => {
    expect(searchPhonebook(syntheticContacts, 'NNA')).toEqual(
      syntheticContacts.slice(0, 3),
    );
  });

  it('entfernt äußere Leerzeichen und bewahrt gleiche Namen als getrennte Treffer', () => {
    const results = searchPhonebook(syntheticContacts, '  anna muster  ');

    expect(results).toEqual([syntheticContacts[0], syntheticContacts[2]]);
    expect(results.map((contact) => contact.phone)).toEqual(['0123', '0789']);
  });

  it('liefert bei einer leeren Anfrage keine Treffer', () => {
    expect(searchPhonebook(syntheticContacts, '   ')).toEqual([]);
  });

  it('gleicht Umlaute nicht mit Umschreibungen gleich', () => {
    expect(searchPhonebook(syntheticContacts, 'mueller')).toEqual([]);
    expect(searchPhonebook(syntheticContacts, 'müller')).toEqual([
      syntheticContacts[3],
    ]);
  });

  it('begrenzt überlange Anfragen', () => {
    expect(() => normalizeQuery('a'.repeat(101))).toThrow(
      'höchstens 100 Zeichen',
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
    ).toThrow('mindestens 1');
    expect(() =>
      searchPhonebookPage(paginatedContacts, 'example', 1, 20),
    ).toThrow('10, 25 oder 50');
    expect(() =>
      searchPhonebookPage(paginatedContacts, 'example', 4, 10),
    ).toThrow('existiert nicht');
  });
});
