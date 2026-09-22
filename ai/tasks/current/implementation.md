# Current task: Step 6 - README and completion

## Goal

Publish an accurate English README and convert all project-maintained documentation to English,
then record final automated and manual verification status without claiming deployment.

## Scope

The README, `AGENTS.md`, `docs/`, task handovers, changelog, documentation-link checks, and
verification status. No product, dependency, deployment, or performance-architecture changes.

## Relevant context

`README.md`, `AGENTS.md`, `CHANGELOG.md`, `docs/`, `ai/tasks/`, `package.json`, and
`.github/workflows/quality.yml`.

## Acceptance checks

- The README describes implemented behavior, verified commands, development versus build versus
  server operation, architecture, limitations, AI-assisted workflow, and a non-broken screenshot
  placeholder.
- Project-maintained Markdown documentation is English, links remain valid, and historical task
  claims retain their original verification status.
- The final status distinguishes user-confirmed results, checks executed in this workspace, and
  remaining manual verification without implying deployment.

## Status and next step

Implemented documentation update. Markdown-language and local-link checks passed, as did
`git diff --check`; no staged files were present and `.gitignore` plus `telefonbuch.json` were
unchanged. The user confirmed the prior step 5 local check (21 tests) and GitHub Actions success,
but those results do not verify this documentation-only change. A new `npm run check` and a clean
environment start check cannot run here because neither Node.js nor npm is installed (`npm:
command not found`). The step 5 real-browser Clipboard and keyboard check remains open.
