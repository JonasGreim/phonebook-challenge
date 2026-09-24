# Current task: Improve the project README with screenshots

## Goal

Present FindCall as a finished deployed coding-challenge project with a concise English README,
safe screenshots, accurate local commands, and deployment guidance.

## Scope and acceptance checks

- Replace the outdated README with a product-oriented English overview.
- Document the live Render demo, cold-start behavior, local setup, quality checks, deployment, and
  project structure.
- Use the existing logo asset and screenshots that do not expose contact data.
- Keep all phonebook data server-only and do not commit source contact values into documentation.

## Status and next step

Implemented: README now documents the live demo, bilingual search features, GraphQL architecture,
responsive Hero, local development, CI-gated Render deployment, and project structure. The
provided screenshots are explicitly identified as showing sample/demo contact data, and the
desktop, mobile, and filtered-results screenshots are embedded.

Verification: `npm run check` and `git diff --check` passed before this documentation-only
screenshot selection update. The original screenshots were visually inspected, and local
command/configuration references match `package.json`, `.github/workflows/quality.yml`, and
`render.yaml`. GitHub-rendered README verification remains pending until the changes are pushed.
