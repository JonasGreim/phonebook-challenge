# Completed task: Task 3 - Targeted project structure improvement

## Goal

Reduce `App.tsx` to application composition while preserving the existing FindCall behavior,
presentation, accessibility, stable IDs, GraphQL contracts, and immutable phonebook source.

## Implemented scope

- Extracted `usePhonebookSearch` for input, pagination, debounce, cancellation, and stale search
  response protection.
- Extracted `useClipboardFeedback` for original-number copying, feedback dismissal, and stale
  Clipboard-operation protection.
- Extracted `AppHeader` and `SearchResults`; `App` now composes theme, locale, search field,
  hooks, and page regions.
- Moved the existing app-wide test to `src/integration/App.test.tsx` and shared setup to
  `src/test/setup.ts`; pure unit tests remain next to their modules.
- Moved the byte-identical data source to `server/data/telefonbuch.json` and updated the server,
  test, configuration, documentation, and repository guidance paths.

## Data integrity

The SHA-256 hash was `1dec52b259794d0b5ed13f9a6475e9ade3668dcd95a41cfcf3b3f9f818cf9186` both
before and after the move. The data file has no client import and is outside `public/`.

## Acceptance checks

- Search debounce, cancellation, pagination resets, response validation, and stale-response
  protection behave as before.
- Clipboard success, unavailable/rejected feedback, and stale-operation protection behave as
  before; copied numbers remain original strings.
- App-wide integration coverage remains intact after the test and setup-path moves.
- The server loads the byte-identical data from `server/data/` without exposing it through the
  client build.

## Verification

- Corrected the `Snackbar` child fallback from `null` to `undefined`; Material UI's type contract
  accepts only a React element or `undefined`.
- `npm run check` passed with Node.js 22.22.3: typecheck, lint, format check, 30 tests, and the
  production build all succeeded. The build emitted the known chunk-size warning only.
- The server started successfully on port 4001 (port 4000 was already occupied). A GraphQL search
  query returned valid pagination metadata from the moved data source.
- The Vite client entry responded successfully on port 5174.
- `git diff --check` passed. The data SHA-256 remains
  `1dec52b259794d0b5ed13f9a6475e9ade3668dcd95a41cfcf3b3f9f818cf9186`.

## Open manual verification

No browser surface was available in this environment. Search, highlighting, pagination, page-size
selection, language switching, keyboard interaction, real Clipboard copying, and denied or
unavailable Clipboard behavior were therefore not browser-verified. Automated integration tests
cover the relevant application states, but do not replace this real-browser verification.

## Next step

Task implementation is complete. The fixed-English logo subtitle remains a separate i18n
follow-up; perform the open browser verification when a browser surface is available.
