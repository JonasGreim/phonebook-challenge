# Current task: Task 3 - Targeted project structure improvement

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

- `git diff --check` passed.
- Corrected the `Snackbar` child fallback from `null` to `undefined`; Material UI's type contract
  accepts only a React element or `undefined`.
- Targeted Vitest invocation could not start: Node.js is unavailable (`/usr/bin/env: ‘node’: No
  such file or directory`).
- `npm run check` could not start because npm is unavailable (`npm: command not found`).
- Server startup/data retrieval and browser checks for search, pagination, language switching,
  Clipboard permissions, and keyboard operation could not run without Node.js and a running app.

## Required local verification

1. Run `npm ci` with Node.js 22.22.2+ and npm 10+.
2. Run `npm run check`.
3. Run `npm run dev`, search across pages, switch language, and use the page-size control by
   keyboard.
4. In a secure browser context, copy a phone number with keyboard and pointer input; also verify
   unavailable or denied Clipboard feedback where feasible.
5. Run `npm run start:server` and issue a GraphQL `searchPhonebook` query to confirm that the
   server loads `server/data/telefonbuch.json`.

## Next step

Await user review. The fixed-English logo subtitle remains a separate i18n follow-up.
