import { GraphQLError } from 'graphql';
import {
  searchPhonebookPage,
  type Contact,
  type PhonebookPage,
} from './phonebook.js';

type SearchPhonebookArgs = { page: number; pageSize: number; query: string };

type Resolvers = {
  Query: {
    searchPhonebook: (
      _parent: unknown,
      args: SearchPhonebookArgs,
    ) => PhonebookPage;
  };
};

export const typeDefs = `#graphql
  type Contact {
    id: ID!
    name: String!
    phone: String!
  }

  type PhonebookPage {
    contacts: [Contact!]!
    page: Int!
    pageSize: Int!
    totalCount: Int!
    totalPages: Int!
  }

  type Query {
    searchPhonebook(query: String!, page: Int!, pageSize: Int!): PhonebookPage!
  }
`;

export function createResolvers(contacts: Contact[]): Resolvers {
  return {
    Query: {
      searchPhonebook: (_parent, { query, page, pageSize }) => {
        try {
          return searchPhonebookPage(contacts, query, page, pageSize);
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
