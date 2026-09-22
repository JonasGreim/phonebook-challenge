import { GraphQLError } from 'graphql';
import { searchPhonebook } from './phonebook.js';

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

export function createResolvers(contacts) {
  return {
    Query: {
      searchPhonebook: (_, { query }) => {
        try {
          return searchPhonebook(contacts, query);
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
      },
    },
  };
}
