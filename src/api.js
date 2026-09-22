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

export async function searchContacts(query, signal) {
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
    throw new Error('Die Suche ist momentan nicht erreichbar.');
  }

  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  return result.data.searchPhonebook;
}
