# Current task: Step 1 - TypeScript foundation

## Goal

Migrate the existing frontend, backend, and relevant tests to strict TypeScript while
preserving runtime validation, branding, behavior, and original phonebook data.

## Scope

TypeScript configuration, TypeScript source migration, ESLint, Prettier, and documentation
updates. CI, internationalization, pagination, clipboard support, and the English README
remain planned in [`ai/tasks/backlog/improvements.md`](../backlog/improvements.md).

## Relevant context

`telefonbuch.json`, `server/`, `src/`, `package.json`, TypeScript configuration, and `docs/`.

## Acceptance checks

- Strict TypeScript passes without unsafe `any` or error-hiding assertions: `npm run typecheck`
- ESLint and Prettier are configured for the actual TypeScript/React project.
- Existing behavior and runtime data validation remain covered: `npm test` and `npm run build`.

## Status and next step

Implemented and locally verified: strict TypeScript migration, runtime validation,
TypeScript-aware ESLint, Prettier, and the related npm commands. `npm run typecheck`,
`npm run lint`, `npm run format:check`, `npm test`, and `npm run build` passed locally.
The original `telefonbuch.json` is unchanged. Step 2 starts only after user review of this
completed step; no GitHub Actions workflow has been created yet.
