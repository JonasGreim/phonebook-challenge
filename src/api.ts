const endpoint = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/';

const SEARCH_PHONEBOOK = `
  query SearchPhonebook($query: String!) {
    searchPhonebook(query: $query) {
      id
      name
      phone
    }
  }
`;

export type SearchErrorCode =
  'invalidResponse' | 'searchFailed' | 'serviceUnavailable';

export class SearchError extends Error {
  code: SearchErrorCode;

  constructor(code: SearchErrorCode) {
    super(code);
    this.code = code;
    this.name = 'SearchError';
  }
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

type GraphQLErrorResponse = { message?: unknown };

type SearchResponse = {
  data?: { searchPhonebook?: unknown };
  errors?: GraphQLErrorResponse[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isContact(value: unknown): value is Contact {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.phone === 'string'
  );
}

function isSearchResponse(value: unknown): value is SearchResponse {
  return isRecord(value);
}

export async function searchContacts(
  query: string,
  signal: AbortSignal,
): Promise<Contact[]> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      query: SEARCH_PHONEBOOK,
      variables: { query },
    }),
  });

  if (!response.ok) {
    throw new SearchError('serviceUnavailable');
  }

  const result: unknown = await response.json();
  if (!isSearchResponse(result)) {
    throw new SearchError('invalidResponse');
  }

  if (result.errors?.length) {
    throw new SearchError('searchFailed');
  }

  const contacts = result.data?.searchPhonebook;
  if (!Array.isArray(contacts) || !contacts.every(isContact)) {
    throw new SearchError('invalidResponse');
  }

  return contacts;
}
