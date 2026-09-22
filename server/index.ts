import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadPhonebook } from './phonebook.js';
import { createResolvers, typeDefs } from './schema.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const phonebookPath = path.join(currentDirectory, '..', 'telefonbuch.json');
const contacts = await loadPhonebook(phonebookPath);
const configuredPort = Number(process.env.PORT);
const port =
  Number.isInteger(configuredPort) && configuredPort > 0
    ? configuredPort
    : 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers: createResolvers(contacts),
});

const { url } = await startStandaloneServer(server, { listen: { port } });

console.log(`GraphQL server ready at ${url}`);
