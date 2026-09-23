# Architecture

```text
React + Material UI (TypeScript)  -- POST / GraphQL -->  Apollo Server (TypeScript)
                                                          --> server/data/telefonbuch.json
                                                              (loaded and validated once)
```

The Vite client does not include the phonebook file. It calls
`searchPhonebook(query, page, pageSize)`. At startup, Apollo Server loads the JSON file,
validates that it is an array of exact `name`/`phone` records with non-empty strings, and keeps
the 120 validated entries in memory.

The server assigns a stable `contact-<index>` ID only at runtime for React and GraphQL. This is
necessary because one name occurs twice; the source file remains unchanged. The server filters
the complete in-memory set first, ranks name and name-part starts ahead of other substring
matches, sorts each rank by name and stable ID, and only then slices the requested page. The
GraphQL response contains `contacts`, `page`, `pageSize`, `totalCount`, and `totalPages`; invalid
sizes or pages are rejected as input errors.

The client deliberately uses `fetch` rather than Apollo Client: one query does not warrant a
client cache or another dependency. `AbortController` and a monotonically increasing request ID
protect fast input and page changes from stale responses.

`tsconfig.app.json` and `tsconfig.server.json` check client and server separately with
`strict: true`; root `tsconfig.json` joins both projects. The validated server boundary and the
client's GraphQL-response check continue to treat data as `unknown` until its shape is proven.

`src/i18n.ts` is the central typed source for German and English UI text and search error codes.
`App` stores the language under `findcall-locale` in local storage and updates
`document.documentElement.lang` and the page title. Locale state is separate from the query,
page size, page, and results, so those values survive a language switch. `AppHeader` passes the
translated logo subtitle to `FindCallLogo`, so it follows the selected or persisted locale too.

`App` composes the theme, locale, search field, `AppHeader`, and `SearchResults`. The
`usePhonebookSearch` hook owns debounce, cancellation, search response, pagination, and stale
request protection. `useClipboardFeedback` owns Clipboard completion feedback and stale Clipboard
operation protection. Pure unit tests remain next to their modules; the app-wide behavior test is
in `src/integration/`, with shared setup in `src/test/`.

`src/highlight.ts` splits a displayed name into literal, non-overlapping matching and non-matching
text parts without regular expressions or HTML injection. `usePhonebookSearch` stores the query
associated with the accepted server response, and `SearchResults` renders matching parts as
semantic `mark` elements; a later input or a rejected stale response cannot alter the highlights
for visible results.

Copying stays entirely in the client. It passes `contact.phone` unchanged to
`navigator.clipboard.writeText`; only a resolved promise triggers success feedback. Missing or
rejected API access produces a translated message, and contacts are not sent to the server again.

The single quality entry point is `npm run check`. The GitHub Actions workflow in
[`../.github/workflows/quality.yml`](../.github/workflows/quality.yml) uses `npm ci` with
`package-lock.json`, reads `.nvmrc`, and then runs the same command. Local and remote results are
recorded separately.
