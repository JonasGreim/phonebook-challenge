# Current task: Standardize server errors and tests in English

## Goal

Replace German technical error messages and German test descriptions in the server code with
English equivalents while preserving localized frontend user-facing messages.

## Scope and acceptance checks

- Translate all seven technical runtime errors in `server/phonebook.ts`.
- Translate server test suite and test-case descriptions and update expected error assertions.
- Preserve search, pagination, stable IDs, duplicate-name handling, accented-character cases, and
  all localized frontend messages.

## Status and next step

Implemented: server technical errors and test descriptions are now English; synthetic German data
remains only in the accented-character normalization test.

Verification: `npm run check` passed (typecheck, lint, formatting, 34 tests, and production build);
`git diff --check` passed. The only German text remaining in `server/` is the intentional
`Müller`/`müller` synthetic data used by the umlaut normalization test. Frontend localization,
GraphQL error codes, phonebook data, search behavior, and pagination behavior were unchanged.
