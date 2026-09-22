const endpoint = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/';

const SEARCH_PHONEBOOK = `
  query SearchPhonebook($query: String!, $page: Int!, $pageSize: Int!) {
    searchPhonebook(query: $query, page: $page, pageSize: $pageSize) {
      contacts {
        id
        name
        phone
      }
      page
      pageSize
      totalCount
      totalPages
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

export interface SearchPage {
  contacts: Contact[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
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

function isSearchPage(value: unknown): value is SearchPage {
  return (
    isRecord(value) &&
    Array.isArray(value.contacts) &&
    value.contacts.every(isContact) &&
    typeof value.page === 'number' &&
    Number.isInteger(value.page) &&
    typeof value.pageSize === 'number' &&
    Number.isInteger(value.pageSize) &&
    typeof value.totalCount === 'number' &&
    Number.isInteger(value.totalCount) &&
    typeof value.totalPages === 'number' &&
    Number.isInteger(value.totalPages)
  );
}

export async function searchContacts(
  query: string,
  page: number,
  pageSize: number,
  signal: AbortSignal,
): Promise<SearchPage> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      query: SEARCH_PHONEBOOK,
      variables: { page, pageSize, query },
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

  const searchPage = result.data?.searchPhonebook;
  if (!isSearchPage(searchPage)) {
    throw new SearchError('invalidResponse');
  }

  return searchPage;
}
