# FindCall — Phonebook Coding Challenge

FindCall is a small, accessible phonebook search application. A React client queries an Apollo
GraphQL server at runtime; the server validates and keeps the provided `telefonbuch.json` data
in memory. The project intentionally keeps the source data unchanged.

## Contents

- [Features](#features)
- [Tech stack and prerequisites](#tech-stack-and-prerequisites)
- [Install and run](#install-and-run)
- [Quality checks](#quality-checks)
- [Architecture and behavior](#architecture-and-behavior)
- [Documentation and AI-assisted workflow](#documentation-and-ai-assisted-workflow)
- [Known limitations](#known-limitations)
- [Screenshot](#screenshot)

## Features

- Case-insensitive substring search by name with a 280 ms debounce.
- German and English UI, including accessible labels, status messages, and errors. The chosen
  language is stored locally and updates the document language and title.
- Server-side pagination after complete search and deterministic sorting: 10 results per page
  by default, with 10, 25, and 50 available.
- Stable contact IDs ensure that contacts with identical names remain separate records.
- Responsive, keyboard-accessible pagination and page-size selection.
- An accessible copy action for each phone number, with translated success and failure feedback.
  It preserves the number's original text, including leading zeroes and formatting.
- Runtime validation of the JSON data and GraphQL responses, plus strict TypeScript.

## Tech stack and prerequisites

- React 19, Vite, Material UI, and TypeScript.
- Apollo Server 5 and GraphQL.
- Vitest, Testing Library, ESLint, and Prettier.
- Node.js 22.22.2 or later and npm 10 or later. The exact Node version is recorded in
  [`.nvmrc`](.nvmrc).

## Install and run

Install dependencies from the committed lockfile:

```bash
npm ci
```

### Development

Run the Vite client and GraphQL server together with file watching:

```bash
npm run dev
```

The client is available at `http://localhost:5173`; the GraphQL server listens on
`http://localhost:4000`.

For separate terminals, use `npm run dev:client` and `npm run dev:server`.

### Tests and production build

```bash
npm test
npm run build
npm run check
```

`npm run check` is the verified full automated chain: TypeScript typecheck, lint, formatting
check, tests, and the Vite production build. The user confirmed a successful run with 21 tests
for the committed step 5 state; GitHub Actions runs the same command after `npm ci`.

`npm run build` creates static client assets in `dist/`. `npm run start:server` starts only the
GraphQL server; it does not serve `dist/`. Hosting the built client and deploying the two
services are deliberately outside this challenge.

## Architecture and behavior

The Vite client never ships the phonebook file. At server startup, Apollo loads and validates
`telefonbuch.json`, assigns a stable `contact-<index>` ID to each entry, and keeps the validated
records in memory. For a non-empty search, it filters the complete phonebook, sorts by name and
then ID, and returns the requested page with totals.

An empty or whitespace-only input does not issue a search and shows no results. Phone numbers
are displayed and copied as their original strings; they are not searched. The copy action uses
the browser Clipboard API and reports success only after `writeText` resolves. Browsers can deny
or omit that API, particularly outside a secure context; in that case the number remains visible
for manual selection.

For design, API, and behavioral detail, see [the architecture](docs/architecture.md),
[requirements](docs/requirements.md), [UI/UX notes](docs/ui-ux.md), and
[technical decisions](docs/decisions.md).

## Documentation and AI-assisted workflow

[AGENTS.md](AGENTS.md) defines repository working rules: preserve original data and user changes,
use the configured checks, document verification truthfully, and keep project-maintained
documentation in English while the UI remains German/English.

The [`docs/`](docs/) directory records requirements, architecture, UI/UX choices, and decisions.
[`ai/tasks/`](ai/tasks/) contains concise active, backlog, and completed task handovers. AI was
explicitly permitted for this challenge; those files make the scope, checks, and human-confirmed
results reviewable.

## Known limitations

- There is no deployment configuration, static-asset server, authentication, database, or search
  index.
- The phonebook is a small, immutable in-memory data set; larger or mutable data needs a different
  persistence and search strategy.
- Clipboard support depends on the browser and context. Automated mocks cover its behavior, but a
  real browser copy and keyboard check remains to be performed for step 5.
- The last confirmed production build emitted Vite's chunk-size warning for a JavaScript chunk of
  about 509 kB (about 160 kB gzip). This is an optimization opportunity—such as reviewing code
  splitting—rather than a reason to raise the warning threshold in this documentation task.

## Screenshot

Add a manually created application screenshot at `docs/assets/findcall-screenshot.png` when it is
available. No image link is included yet so the README does not reference a missing file.
