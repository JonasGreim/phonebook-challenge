# Current task: Task 3 - Project structure proposal

## Goal

Analyze the existing project structure and document one compact, responsibility-led refactoring
proposal. This task is planning only; no application code, project files, dependencies, or source
data may be changed or moved.

## Current assessment

The project is already appropriately small: Vite configuration, package files, documentation,
source folders, and static assets have clear purposes. `src/theme.ts`, `src/i18n.ts`,
`src/highlight.ts`, `server/phonebook.ts`, and their adjacent unit tests are well scoped.
`src/App.tsx` is the main structural concern: it currently combines application composition,
locale persistence, debounced and abortable search state, pagination, Clipboard race handling,
and all page presentation.

There are no generated files or dependencies tracked in Git. The ignored original PDF remains a
local reference and should remain at the root. `telefonbuch.json` is required, tracked source
data but is the only root file whose server-only role justifies a later path move.

## Findings and decisions

### Necessary improvements

- Extract `usePhonebookSearch` from `src/App.tsx`. It should own query, page, page size, result,
  search status, error, debounce, cancellation, and request-ID protection, returning the handlers
  the UI needs. It is one coherent stateful concern rather than a generic utility.
- Extract `useClipboardFeedback` from `src/App.tsx`. It should own Clipboard availability,
  completion feedback, dismissal, and the Clipboard operation ID. It must continue to accept and
  copy the unmodified phone string.
- Extract `AppHeader` and `SearchResults` as presentation components. `App` should then compose
  the theme, locale state, search field, hooks, and these two meaningful page regions. Do not
  extract the small search-field JSX or isolated list rows without a later concrete need.
- Move `telefonbuch.json` to `server/data/telefonbuch.json` in the implementation task. Record
  a SHA-256 checksum immediately before and after moving; the hashes must match. Update only the
  server loader path and test fixture path. The file remains outside `public/`, Vite client
  imports, and the production client bundle.

### Keep as is

- Keep the small central `src/i18n.ts`. Its `Record<Locale, Translations>` type already checks
  both locales and is proportionate to two static languages. Do not introduce namespaces or an
  i18n dependency.
- Keep `src/api.ts` client-local. Its GraphQL response types are a client boundary, while server
  contact types belong to `server/phonebook.ts`; a cross-runtime `types/` directory would add a
  less clear ownership boundary.
- Keep `src/highlight.ts` and `server/phonebook.ts` unit tests next to the corresponding pure
  logic. Keep MUI styles local where they are one-off. The central theme already owns palette,
  typography, focus treatment, Paper, text-field, and input defaults.
- Keep the root layout: package/configuration files, `AGENTS.md`, `README.md`, `CHANGELOG.md`,
  `.github/`, `ai/`, `docs/`, `public/`, `server/`, and `src/` all belong there. Do not move the
  ignored task PDF or delete any unknown local file.

### Optional follow-up, not part of this refactoring

- `FindCallLogo.tsx` repeats palette hex values from `src/theme.ts`. They are currently
  consistent, so this is not a correctness problem. A later branding-token export is optional
  only if more branded SVGs or components need the same values.

### Separate product findings

- The compact logo subtitle is fixed English in `src/FindCallLogo.tsx`; it should be reviewed as
  a translation-completeness follow-up, not changed incidentally during structural work.
- Server validation and query errors are authored in German but the client maps request failures
  to typed, translated UI messages. Review raw GraphQL error exposure separately if server errors
  are ever displayed directly.

## Proposed target tree

```text
src/
  components/
    AppHeader.tsx
    SearchResults.tsx
  hooks/
    useClipboardFeedback.ts
    usePhonebookSearch.ts
  test/
    setup.ts
  integration/
    App.test.tsx
  App.tsx
  api.ts
  FindCallLogo.tsx
  highlight.ts
  highlight.test.ts
  i18n.ts
  main.tsx
  theme.ts
  vite-env.d.ts
server/
  data/
    telefonbuch.json
  index.ts
  phonebook.ts
  phonebook.test.ts
  schema.ts
```

The target has two feature-oriented components and two stateful hooks only. It deliberately has
no generic `types/`, `utils/`, styling, or UI-library folder.

## Planned path changes

| Current path | Planned path | Benefit |
| --- | --- | --- |
| `src/App.test.tsx` | `src/integration/App.test.tsx` | Makes the app-wide behavior test visibly distinct from adjacent unit tests. |
| `src/test-setup.ts` | `src/test/setup.ts` | Groups shared test setup with the integration-test location; update `vite.config.ts`. |
| `telefonbuch.json` | `server/data/telefonbuch.json` | Makes the server-only source boundary explicit without exposing data to client assets. |
| `src/App.tsx` logic | `src/hooks/usePhonebookSearch.ts` and `src/hooks/useClipboardFeedback.ts` | Separates the two cohesive stateful workflows while retaining existing behavior. |
| `src/App.tsx` page regions | `src/components/AppHeader.tsx` and `src/components/SearchResults.tsx` | Lets `App` primarily compose the application without fragmenting every JSX sequence. |

The last two rows are responsibility extractions, not literal file moves. `src/App.tsx`,
`src/highlight.test.ts`, and `server/phonebook.test.ts` remain in place. Existing integration
coverage should remain app-wide; only imports, mocks, and the configured setup-file path change.

## Implementation sequence after approval

1. Capture `sha256sum telefonbuch.json`, create the target data directory, move the exact file,
   capture its checksum again, and update server/test paths.
2. Move test setup and the existing app-wide integration test; update `vite.config.ts` and verify
   test discovery before changing production structure.
3. Extract `usePhonebookSearch` with unchanged debounce, abort, request-ID, pagination, and
   response behavior; retain or extend integration coverage for all current user-visible states.
4. Extract `useClipboardFeedback` with unchanged original-number copying and stale-operation
   protection; retain Clipboard outcome coverage.
5. Extract `AppHeader` and `SearchResults`, preserve the current Material UI theme, responsive
   layout, semantic highlight styling, keyboard behavior, and translated labels.
6. Update only documentation that reflects completed path or architecture changes. Review the
   fixed English logo subtitle as a separately approved i18n item.

## Planned verification

- Run `npm run check` using the configured typecheck, lint, format check, tests, and build.
- Verify test discovery and mocks after moving the setup and integration-test files.
- Run `sha256sum` before and after moving `telefonbuch.json`; compare exactly, and confirm no
  client import, `public/` copy, or build asset includes it.
- Re-run server tests for validation, duplicates, ranking, pagination, and invalid parameters;
  re-run app integration tests for query changes, stale responses, locale persistence, paging,
  highlights, and Clipboard feedback.
- Separately perform browser checks for responsive layout, keyboard operation, and real Clipboard
  permissions; mocks do not prove browser Clipboard behavior.

## Documentation and status

This is a proposal, not an implemented migration. `docs/architecture.md` continues to describe
the actual current layout and root-level `telefonbuch.json`. No Changelog entry is appropriate
until approved code changes are implemented. Existing AGENTS rules already require English
documentation, preservation of the original data, focused documentation reading, and verification;
no additional AGENTS rule is needed for this plan.

## Next step

Await approval of this target tree and sequence before implementing any refactoring.
