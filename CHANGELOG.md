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
- Localized the logo subtitle through the existing DE/EN translations and added a white favicon
  bubble for contrast on light and dark browser tabs.
- Consolidated page-logo and favicon geometry in one SVG source and added deterministic favicon
  generation for development and production builds.
- Clipped generated favicon artwork to its circular bubble and enlarged the shared phone receiver
  while preserving the page logo's full magnifier handle and signal arcs.
- Rendered accepted zero-match searches inside the neutral results card with translated guidance
  and without pagination controls or duplicate status messages.
- Refined the empty-result row to match contact spacing and typography, with a light-blue search
  icon and concise translated guidance.
- Added a responsive author footer with a verified FindCall repository link and keyboard-visible
  focus treatment.
- Refined the footer into distinct author-profile and FindCall project-link groups with translated
  GitHub and LinkedIn labels, tooltips, and responsive stacking.
- Aligned the FindCall project link and author-profile group with the header container, normalized
  footer typography and icon weight, and made the project group first on narrow screens.
- Simplified the footer to one centered author-and-profile group with compact icon targets and
  preserved localized personal-profile accessibility.
- Kept the compact author and profile links aligned in one centered row on narrow screens.
- Prepared free Render static/web services with CI-gated deployment, production endpoint handling,
  and localized delayed-service startup feedback.
- Recorded user-confirmed successful Render deployment and validation; public service URLs remain
  intentionally undocumented.
- Refined the responsive header hierarchy with a larger FindCall mark and wordmark, clearer
  subtitle, balanced spacing, and responsive header height.
- Kept the FindCall wordmark visible on narrow screens while retaining a hidden mobile subtitle.
- Scaled the FindCall mark, wordmark, subtitle, and header spacing further at large breakpoints.
- Simplified translated search helper text and increased its responsive readability.
- Reduced search helper-text prominence with concise translations and consistent secondary styling.
