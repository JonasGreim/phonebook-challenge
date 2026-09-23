# Changelog

## Unreleased

- Created the React and Material UI client with a GraphQL integration.
- Created the Apollo Server with a validated in-memory phonebook and substring search.
- Added requirements, architecture, UI/UX, and technical decision documentation.
- Added Node.js 22.22.2 in `.nvmrc` and committed a lockfile for reproducible installs.
- Added server-search and client debounce/race-condition tests.
- Added FindCall branding with a central Material UI theme, responsive SVG logo, and favicon.
- Improved the search area and result list with clearer states, a clear action, and phone icons.
- Migrated the client, server, and relevant tests to strict TypeScript while retaining runtime
  JSON and response validation.
- Configured TypeScript-aware ESLint and Prettier.
- Added `npm run check` for typecheck, lint, format checking, tests, and build.
- Added a GitHub Actions workflow that installs from the lockfile and runs the same check chain.
- Added a German/English UI with central translations, persisted language selection, and document
  `lang` updates.
- Added server-side pagination after complete search, stable name/ID sorting, total metadata,
  10/25/50 page sizes, and responsive navigation.
- Added tests for pagination, duplicate names, page boundaries, resets, and stale responses.
- Added an accessible copy action per contact, with translated success, rejected-access, and
  unavailable-Clipboard feedback.
- Added tests for unmodified numbers, duplicate-name contact selection, and Clipboard outcomes.
- Rewrote project-maintained documentation in English and documented the final review scope.
- Prioritized complete server-side search results whose matches begin a name or name part before
  other substring matches, while retaining stable name/ID ordering and pagination.
- Added safe semantic highlighting for literal, non-overlapping name matches and coverage for
  ranking, special characters, multiple matches, and stale search responses.
- Removed the empty-query result prompt and moved copy feedback to a non-modal bottom Snackbar
  with temporary translated button confirmation and stale-operation protection.
- Split application composition, search/pagination state, Clipboard feedback, header, and result
  presentation into focused modules; grouped the app-wide behavior test as an integration test.
- Moved the byte-identical phonebook source to `server/data/telefonbuch.json` to make its
  server-only boundary explicit.
