# Current task: Task 1 - Search ranking and highlighting

## Goal

Prioritize name-part starts in the existing server-side substring search and highlight literal
matches in the displayed names without changing valid results, IDs, or pagination.

## Scope

Server-side ranking before pagination, safe client-side name highlighting, targeted tests, and
affected documentation. Tasks 2 and 3 are planned only in the backlog.

## Relevant context

`server/phonebook.ts`, `server/phonebook.test.ts`, `src/highlight.ts`, `src/App.tsx`,
`src/App.test.tsx`, and `docs/`.

## Acceptance checks

- Name and later name-part starts (after spaces or hyphens) rank before remaining case-insensitive
  substring matches; names and stable IDs order each priority group deterministically.
- The server ranks the full result set before pagination without removing equal-name contacts.
- The UI highlights every non-overlapping literal match from the response query while preserving
  the full original accessible name and avoiding stale-response highlights.

## Status and next step

Implemented. The user's pre-fix log confirms typecheck, lint, and format checking passed after
formatting; four tests then failed. One pagination expectation incorrectly used source order
instead of the new deterministic alphabetical order, while three UI expectations assumed an
unbroken name text node despite the explicitly required `mark` elements. The tests now assert the
actual alphabetical sequence and full rendered name text without bypassing the new behavior.

`git diff --check` passed, and the original phonebook data is unchanged. The targeted test command
and `npm run check` could not run in this workspace because npm is unavailable (`npm: command not
found`), so the correction remains unverified here. Browser verification of ranking and
highlighting has not run. The user confirmed that all prior six steps are committed, pushed, and
successful in GitHub Actions; the step 5 real-browser Clipboard and keyboard check remains open.
