import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  loadPhonebook,
  normalizeQuery,
  searchPhonebook,
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
