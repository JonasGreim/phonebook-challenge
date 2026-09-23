# Project Working Guide

## Scope and language

- Keep `server/data/telefonbuch.json` byte-identical and never expose contact data in logs or
  documentation. It is server-only source data, never a public asset or client import.
- Maintain FindCall mark geometry only in `src/assets/findcall-mark.svg`; regenerate the derived
  `public/favicon.svg` with `npm run generate:favicon` instead of editing it manually.
- Write code, code comments, and all project-maintained documentation in English. Keep the UI German/English through the existing language architecture; do not create a competing translation mechanism. Explanations to the user may be German.
- Preserve working search behavior, GraphQL integration, stable contact IDs, and handling of duplicate names unless a task explicitly changes them.

## Working method

- Read `README.md`, the current task in `ai/tasks/current/`, and only the relevant files in `docs/`, `src/`, or `server/` before making changes.
- Inspect existing changes before editing and preserve manual user changes.
- If no active task exists, create a concise task specification from the user's request. Do not expand its scope.
- Update affected documentation: requirements in `docs/requirements.md`, architecture in `docs/architecture.md`, UI/UX in `docs/ui-ux.md`, and decisions in `docs/decisions.md`.
- Keep the current task concise and factual: state goal, scope, acceptance checks, verified results, open limitations, and the next step. Move only completed tasks to `ai/tasks/completed/` and record implemented changes in `CHANGELOG.md`.
- Clearly label planned migrations or features as planned; do not present them as implemented or tested.
- Before creating or recommending a commit, inspect `.gitignore`, staged and tracked files, and potential secrets; keep required source, tests, documentation, configuration, assets, and lockfiles.

## Verification

- Treat `package.json` as the source of truth for available commands. `npm run dev` and `npm run start:server` are development/server commands; `npm test` and `npm run build` are automated checks.
- Run relevant configured typecheck, lint, formatting, test, and build checks. Explicitly report failed or skipped checks and their limitations, and record manual browser checks separately when applicable.
