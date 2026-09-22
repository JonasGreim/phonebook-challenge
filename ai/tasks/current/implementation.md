# Current task: Step 3 - Internationalization

## Goal

Add a German/English interface with central translations, a visible language switch,
persisted language selection, and an updated document language.

## Scope

Central UI translations, translated API error feedback, language persistence, `lang` and
title updates, targeted tests, and documentation. Pagination, clipboard support, and the
English README remain planned in [`ai/tasks/backlog/improvements.md`](../backlog/improvements.md).

## Relevant context

`src/i18n.ts`, `src/App.tsx`, `src/api.ts`, `src/FindCallLogo.tsx`, tests, and `docs/`.

## Acceptance checks

- All UI strings, status messages, errors, tooltips, and accessible labels are translated
  centrally.
- The visible language switch preserves the active query and results, persists its choice,
  and updates the document language.
- Existing search behavior and data remain unchanged and the local check chain passes.

## Status and next step

Implemented and locally verified: `npm run check` passes and now includes 10 tests. The
language switch preserves active results, stores the choice in local storage, and updates
the document language and title. Stop here for user review before step 4.
