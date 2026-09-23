# Current task: Task 2 - Empty result area and copy feedback

## Goal

Keep the result area empty until there is a real search and move copy feedback into a non-modal,
accessible Snackbar without layout shifts or stale clipboard status.

## Scope

Empty-query state, Snackbar feedback, stable copy-button feedback, clipboard race handling,
targeted tests, and affected documentation. Task 3 remains planned only in the backlog.

## Relevant context

`src/App.tsx`, `src/App.test.tsx`, `src/i18n.ts`, and `docs/`.

## Acceptance checks

- Empty input renders no result-state message, while real searches continue to show loading,
  no-result, and error states and ignore stale answers after clearing.
- Copy feedback is a bottom Snackbar with one live status, success only after Clipboard completion,
  and stable-size button feedback for the copied contact.
- Late or repeated Clipboard operations cannot replace newer feedback; unavailable and rejected
  access remains understandable and leaves the number selectable.

## Status and next step

Implemented. `git diff --check` passed and search, ranking, pagination, and phonebook data are
unchanged. Targeted tests and `npm run check` could not run in this workspace because npm is
unavailable (`npm: command not found`), so automated results remain unverified here. Browser
verification of the Snackbar's mobile placement, layout stability, and keyboard behavior has not
run. The user confirmed that Task 1's local check and CI pipeline passed. The step 5 real-browser
Clipboard and keyboard check was not independently confirmed and remains open.
