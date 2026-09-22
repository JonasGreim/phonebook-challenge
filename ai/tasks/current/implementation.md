# Current task: Step 4 - Pagination

## Goal

Search the complete phonebook on the server, sort matching contacts deterministically, and
return one validated page at a time without losing independent contacts with the same name.

## Scope

GraphQL page metadata, server-side search/sort/pagination, the 10/25/50 page-size control,
responsive page navigation, translated range and accessible labels, targeted tests, and
documentation. Clipboard support and the English README remain planned in
[`ai/tasks/backlog/improvements.md`](../backlog/improvements.md).

## Relevant context

`server/phonebook.ts`, `server/schema.ts`, `src/api.ts`, `src/App.tsx`, `src/i18n.ts`,
tests, and `docs/`.

## Acceptance checks

- A non-empty query searches the full validated phonebook, sorts by name then stable contact
  ID, and returns only the requested valid page plus total metadata.
- The UI defaults to 10 results, offers 10/25/50, shows a translated result range, resets to
  page 1 for a query or page-size change, and retains the page on a language change.
- Tests cover complete page traversal, same-name contacts, boundaries, invalid requests,
  resets, stale responses, and language preservation.

## Status and next step

Implemented. The user's pre-fix `npm run check` output confirms that typecheck, lint, and
format checking passed, while two UI tests failed. Both failures were corrected in the test
harness: Material UI's non-native select is now operated through its menu, and mocked one-off
responses are reset between tests. A post-fix automated run could not be performed in this
workspace because neither Node.js nor npm is installed (`npm: command not found`); its result
remains unverified here.

Step 3's committed implementation is documented as locally checked, but its documented
manual browser checks (mobile layout and keyboard/accessibility inspection) remain open and
are not represented as a completed manual verification.
