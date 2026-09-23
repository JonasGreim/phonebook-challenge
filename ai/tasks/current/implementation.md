# Current task: Prepare free Render hosting with CI-gated deployment

## Goal

Prepare free Render Static Site and Web Service deployment from `main` after successful GitHub
Actions checks, without creating a public deployment.

## Scope

Add minimal `render.yaml` free services, use `checksPass`, bind the backend to Render's `PORT`,
require `VITE_GRAPHQL_URL` in production, and show a neutral delayed-start message after three
pending seconds. Preserve cancellation, stale-response protection, server-only data, and all
existing behavior. Update documentation and record manual account, public-data authorization, and
live verification as pending.

## Acceptance checks

- Free static and web services are configured from `main` with `checksPass`; no paid resources,
  deployment hooks, credentials, or database are introduced.
- Production requires a configured HTTPS backend URL, while the backend binds to `0.0.0.0:$PORT`.
- Delayed searches show and correctly clear translated startup feedback.
- Automated, local-server, data-integrity, client-bundle, live-deployment, and browser checks are
  recorded separately.

## Status and next step

Implemented: `render.yaml` prepares a free Node web service and free static site on `main`, both
with `checksPass`. The web service uses `npm ci` and `npm run start:server`; the static site uses
`npm ci && npm run build`, publishes `dist`, and prompts for `VITE_GRAPHQL_URL` during initial
Blueprint setup. The server binds to `0.0.0.0:$PORT`. Production has no localhost fallback.
`usePhonebookSearch` now shows a translated neutral startup explanation after three pending
seconds and clears it on completion or supersession.

Verification passed locally: focused integration coverage passed with 16 tests. `npm run check`
passed with typecheck, lint, format check, 32 tests, and production build. A local server started
with `PORT=4310`, bound to `0.0.0.0`, and returned a successful CORS preflight for a cross-origin
POST. The phonebook checksum matches `HEAD`, and the client build has no `telefonbuch.json` asset
or source reference. The known build chunk-size warning (521.62 kB / 163.46 kB gzip) is not a
failure.

Pending: no Render account setup, GitHub/Render authorization, service names, deployment URLs,
live HTTPS/GraphQL/browser/idle-start verification, or post-CI deployment trigger can be confirmed
locally. Before any public deployment, obtain explicit authorization to expose the supplied
phonebook data through the public GraphQL search API.
