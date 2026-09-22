# Current task: Step 5 - Copy phone numbers

## Goal

Copy an individual displayed phone number through the browser Clipboard API without changing
its formatting or conflating contacts that have the same name.

## Scope

An accessible copy action, translated success and failure feedback, Clipboard API handling,
targeted tests, and documentation. The English README remains planned in
[`ai/tasks/backlog/improvements.md`](../backlog/improvements.md).

## Relevant context

`src/App.tsx`, `src/i18n.ts`, `src/App.test.tsx`, and `docs/`.

## Acceptance checks

- Each contact offers a keyboard-accessible, translated copy button that writes its unmodified
  phone string only after the Clipboard API is available.
- Success appears only after `writeText` resolves; unavailable or rejected access produces a
  translated error while leaving the number visible for manual selection.
- Tests cover correct same-name contact selection, delayed success, rejected access, and a
  missing Clipboard API.

## Status and next step

Implemented. Automated checks and real browser clipboard/keyboard verification have not run
in this workspace because neither Node.js nor npm is installed (`npm: command not found`) and
no browser runtime is available here.
