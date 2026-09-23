# Technical decisions

## React, Vite, and TypeScript

Vite provides a small modern React entry point. Strict TypeScript describes contacts, GraphQL
arguments, UI state, and API responses explicitly. It reduces client/server boundary errors but
does not replace runtime validation of JSON or HTTP responses.

## ESLint and Prettier

ESLint uses the flat configuration and existing React and TypeScript plugins. Prettier owns code
formatting; `eslint-config-prettier` prevents conflicting formatting rules. Formatting commands
list source and configuration explicitly so the supplied data source stays unchanged.

## Local checks and GitHub Actions

`npm run check` composes the existing checks rather than duplicating their configuration. The
GitHub Actions workflow uses `npm ci`, the lockfile, and `.nvmrc` before running that command. A
local success does not prove remote CI; only a visible post-push workflow may be recorded as CI.

## Internationalization without another dependency

One small typed translation module is sufficient for the current two static locales. It
centralizes UI text and error codes while leaving search state outside locale state. A dedicated
i18n library becomes appropriate for pluralization rules, many locales, or nested content.

## Apollo Server and GraphQL

Apollo Server meets the desired client/server architecture with a small self-documenting schema.
A REST route would be simpler for one search, but would not demonstrate the requested GraphQL
technology.

## In-memory data

After successful startup validation, the 120 contacts reside in memory. A database or index would
add infrastructure without practical benefit here; reconsider both for mutable or large data.

## Pagination after complete server-side search

The server filters the complete validated in-memory phonebook before sorting by name and stable
contact ID, then returns the requested page with total metadata. This makes page boundaries
deterministic and preserves separate records with identical names. Paginating before filtering
would omit valid matches; using a name as a key would collapse valid contacts.

## Clipboard API with explicit completion feedback

The client uses the built-in Clipboard API, so no dependency or server endpoint is needed. It
copies the stored phone string directly, preserving leading zeroes and formatting. A success
message is deferred until `writeText` resolves; unavailable or rejected access keeps the number
visible and gives the user a translated explanation.

## Non-modal Snackbar feedback

Copy feedback is rendered in a bottom Snackbar rather than the normal page flow, preventing the
result list and its controls from moving. Success uses one polite status message and a temporary
same-size check icon on the relevant button; errors use an alert. A monotonically increasing
clipboard operation ID prevents late earlier operations from replacing newer feedback.

## Focused application structure

The app has two cohesive stateful hooks rather than a broad utilities layer: one for search and
pagination, one for Clipboard feedback. `AppHeader` and `SearchResults` represent meaningful page
regions, while `App` remains the composition point. Pure logic tests stay adjacent to their
modules; the existing application behavior test is grouped as an integration test. The original
phonebook is stored under `server/data/` so its server-only boundary is explicit without entering
the client bundle.

## Rank before pagination and highlight from accepted state

Ranking the complete server-side match set before pagination keeps page totals and membership
correct while making likely name matches easier to find. The fixed `de-DE` comparison makes order
independent of the UI language, and stable IDs break equal-name ties. The client uses a small
literal text splitter rather than a regular expression or HTML injection, then renders semantic
`mark` elements from the query tied to the accepted response.

UI/UX decisions are documented in [ui-ux.md](ui-ux.md).
