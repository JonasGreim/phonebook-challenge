# Current task: Step 2 - Automated quality checks

## Goal

Create one local quality-check entry point and a GitHub Actions workflow that installs from
the lockfile and runs the existing automated checks.

## Scope

Package scripts, one GitHub Actions workflow, and related documentation. Internationalization,
pagination, clipboard support, and the English README remain planned in
[`ai/tasks/backlog/improvements.md`](../backlog/improvements.md).

## Relevant context

`package.json`, `package-lock.json`, `.nvmrc`, `.github/workflows/`, and `docs/`.

## Acceptance checks

- One local command invokes configured typecheck, lint, format check, tests, and build.
- The workflow uses `npm ci` with the committed lockfile and the Node version from `.nvmrc`.
- Local checks pass. A GitHub Actions result is recorded only after a remote run occurs.

## Status and next step

Implemented and locally verified: `npm ci --dry-run` validates the lockfile and `npm run
check` passes typecheck, lint, format check, tests, and build. The GitHub Actions workflow
has been added but has not run because no commit or push was created in this task. Record a
remote CI result only after GitHub displays it. Stop here for user review before step 3.
