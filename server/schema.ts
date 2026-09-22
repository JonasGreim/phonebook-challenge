import { GraphQLError } from 'graphql';
import { searchPhonebook, type Contact } from './phonebook.js';

type SearchPhonebookArgs = { query: string };

type Resolvers = {
  Query: {
    searchPhonebook: (_parent: unknown, args: SearchPhonebookArgs) => Contact[];
  };
};

export const typeDefs = `#graphql
  type Contact {
    id: ID!
    name: String!
    phone: String!
  }

  type Query {
    searchPhonebook(query: String!): [Contact!]!
  }
`;

export function createResolvers(contacts: Contact[]): Resolvers {
  return {
    Query: {
      searchPhonebook: (_parent, { query }) => {
        try {
          return searchPhonebook(contacts, query);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Invalid search query.';
          throw new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
      },
    },
  };
}
