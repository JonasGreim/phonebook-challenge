import { readFile } from 'node:fs/promises';
import type { PathLike } from 'node:fs';

const MAX_QUERY_LENGTH = 100;
export const PAGE_SIZES = [10, 25, 50] as const;

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface PhonebookPage {
  contacts: Contact[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPhonebookEntry(
  value: unknown,
): value is { name: string; phone: string } {
  return (
    isRecord(value) &&
    Object.keys(value).length === 2 &&
    Object.hasOwn(value, 'name') &&
    Object.hasOwn(value, 'phone') &&
    typeof value.name === 'string' &&
    typeof value.phone === 'string' &&
    value.name.trim() !== '' &&
    value.phone.trim() !== ''
  );
}

export async function loadPhonebook(filePath: PathLike): Promise<Contact[]> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown read error';
    throw new Error(`Failed to read phonebook file: ${message}`, {
      cause: error,
    });
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Phonebook file must contain an array.');
  }

  return parsed.map((entry, index) => {
    if (!isPhonebookEntry(entry)) {
      throw new Error(`Invalid phonebook entry at index ${index}.`);
    }

    return { id: `contact-${index}`, name: entry.name, phone: entry.phone };
  });
}

export function normalizeQuery(query: string): string {
  const normalized = query.trim();
  if (normalized.length > MAX_QUERY_LENGTH) {
    throw new RangeError(
      `Search query must not exceed ${MAX_QUERY_LENGTH} characters.`,
    );
  }

  return normalized.toLocaleLowerCase('de-DE');
}

export function searchPhonebook(contacts: Contact[], query: string): Contact[] {
  const normalizedQuery = normalizeQuery(query);
  if (normalizedQuery === '') return [];

  return filterContacts(contacts, normalizedQuery);
}

function filterContacts(
  contacts: Contact[],
  normalizedQuery: string,
): Contact[] {
  return contacts.filter((contact) =>
    contact.name.toLocaleLowerCase('de-DE').includes(normalizedQuery),
  );
}

function validatePagination(page: number, pageSize: number): void {
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('Page number must be at least 1.');
  }

  if (!PAGE_SIZES.some((allowedSize) => allowedSize === pageSize)) {
    throw new RangeError('Page size must be 10, 25, or 50.');
  }
}

function startsNamePart(name: string, normalizedQuery: string): boolean {
  const normalizedName = name.toLocaleLowerCase('de-DE');
  let matchIndex = normalizedName.indexOf(normalizedQuery);

  while (matchIndex !== -1) {
    if (
      matchIndex === 0 ||
      normalizedName[matchIndex - 1] === ' ' ||
      normalizedName[matchIndex - 1] === '-'
    ) {
      return true;
    }
    matchIndex = normalizedName.indexOf(normalizedQuery, matchIndex + 1);
  }

  return false;
}

function sortContacts(contacts: Contact[], normalizedQuery: string): Contact[] {
  return [...contacts].sort((first, second) => {
    const firstPriority = startsNamePart(first.name, normalizedQuery) ? 0 : 1;
    const secondPriority = startsNamePart(second.name, normalizedQuery) ? 0 : 1;
    if (firstPriority !== secondPriority) return firstPriority - secondPriority;

    const nameOrder = first.name.localeCompare(second.name, 'de-DE');
    return nameOrder === 0
      ? first.id.localeCompare(second.id, 'en', { numeric: true })
      : nameOrder;
  });
}

export function searchPhonebookPage(
  contacts: Contact[],
  query: string,
  page: number,
  pageSize: number,
): PhonebookPage {
  validatePagination(page, pageSize);
  const normalizedQuery = normalizeQuery(query);
  const sortedContacts = sortContacts(
    normalizedQuery ? filterContacts(contacts, normalizedQuery) : contacts,
    normalizedQuery,
  );
  const totalCount = sortedContacts.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount > 0 && page > totalPages) {
    throw new RangeError('Requested page does not exist.');
  }

  const startIndex = (page - 1) * pageSize;
  return {
    contacts: sortedContacts.slice(startIndex, startIndex + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}
