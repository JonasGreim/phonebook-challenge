# Current task: Document the pull-request deployment workflow

## Goal

Document the normal feature-branch and pull-request deployment workflow accurately in the English
README.

## Scope and acceptance checks

- Describe feature branch creation, pull-request checks, merge to `main`, and CI-gated Render
  deployment.
- Link to the public `render.yaml` file and retain the separate frontend/backend service model.
- Keep the Render free-tier cold-start note.

## Status and next step

Implemented: the README deployment section now documents feature branches, pull requests against
`main`, GitHub Actions checks, merging after successful checks, and Render deployment after the
new `main` commit passes CI.

Verification: `npm run check` and `git diff --check` are pending. The documented sequence matches
`.github/workflows/quality.yml` (`pull_request` and `push` triggers) and `render.yaml` (`main`
branch with `checksPass` deployment).
