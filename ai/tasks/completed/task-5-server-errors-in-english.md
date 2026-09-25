# Task: Standardize server errors and tests in English

## Goal

Replace German technical error messages and German test descriptions in the server code with
English equivalents while preserving localized frontend user-facing messages.

## Scope and acceptance checks

- Translate all seven technical runtime errors in `server/phonebook.ts`.
- Translate server test suite and test-case descriptions and update expected error assertions.
- Preserve search, pagination, stable IDs, duplicate-name handling, accented-character cases, and
  all localized frontend messages.

## Verified result

Server technical errors and test descriptions are English; synthetic German data remains only in
the accented-character normalization test. `npm run check` passed with typecheck, lint,
formatting, 34 tests, and a production build; `git diff --check` passed. Frontend localization,
GraphQL error codes, phonebook data, search behaviour, and pagination were unchanged.
