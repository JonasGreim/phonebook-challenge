# Completed task: Step 5 - Copy phone numbers

## Result

Each contact has an accessible, translated copy button that passes its original phone string to
the Clipboard API. Success is shown only after completion; unavailable or rejected access shows
a translated message while leaving the number visible for manual selection.

## Verification

- Local: the user confirmed that `npm run check` passed with typecheck, lint, format checking,
  21 tests, and build.
- Remote: the user confirmed that the committed and pushed GitHub Actions pipeline passed.
- Manual: a real browser Clipboard and keyboard check was not confirmed and remains open.
