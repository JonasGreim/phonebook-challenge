import { readFile } from 'node:fs/promises';

const MAX_QUERY_LENGTH = 100;

export async function loadPhonebook(filePath) {
  let parsed;

  try {
    parsed = JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Telefonbuchdatei konnte nicht gelesen werden: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Telefonbuchdatei muss ein Array enthalten.');
  }

  return parsed.map((entry, index) => {
    if (
      !entry ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      Object.keys(entry).length !== 2 ||
      !Object.hasOwn(entry, 'name') ||
      !Object.hasOwn(entry, 'phone') ||
      typeof entry.name !== 'string' ||
      typeof entry.phone !== 'string' ||
      entry.name.trim() === '' ||
      entry.phone.trim() === ''
    ) {
      throw new Error(`Ungültiger Telefonbucheintrag an Position ${index}.`);
    }

    return { id: `contact-${index}`, name: entry.name, phone: entry.phone };
  });
}

export function normalizeQuery(query) {
  if (typeof query !== 'string') {
    throw new TypeError('Die Suchanfrage muss Text sein.');
  }

  const normalized = query.trim();
  if (normalized.length > MAX_QUERY_LENGTH) {
    throw new RangeError(`Die Suchanfrage darf höchstens ${MAX_QUERY_LENGTH} Zeichen enthalten.`);
  }

  return normalized.toLocaleLowerCase('de-DE');
}

export function searchPhonebook(contacts, query) {
  const normalizedQuery = normalizeQuery(query);
  if (normalizedQuery === '') return [];

  return contacts.filter((contact) =>
    contact.name.toLocaleLowerCase('de-DE').includes(normalizedQuery),
  );
}
