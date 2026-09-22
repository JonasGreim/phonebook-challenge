# Completed task: Step 2 - Automated quality checks

## Goal

Create one local quality-check entry point and a GitHub Actions workflow that installs from
the lockfile and runs the existing automated checks.

## Result

`npm run check` runs typecheck, lint, format check, tests, and build. The GitHub Actions
workflow installs dependencies with `npm ci`, reads `.nvmrc`, and runs that same command.

## Verification

- Local: `npm ci --dry-run` and `npm run check` passed.
- Remote: the user confirmed that the committed and pushed GitHub Actions run passed.
