# Current task: Add social link preview metadata

## Goal

Expose complete crawler-visible Open Graph and Twitter metadata for the public FindCall link
preview without changing the responsive Hero or bilingual UI.

## Scope and acceptance checks

- Add all requested Open Graph and Twitter tags to the static `index.html` response.
- Extend the normal description to approximately 120–160 characters.
- Keep absolute HTTPS production URLs and use only `public/link-preview.png` for social previews.
- Preserve the existing Hero assets, UI localization, GraphQL, and server-only data boundary.

## Status and next step

Implemented: `index.html` now contains static Open Graph and Twitter metadata pointing to the
Render-hosted `link-preview.png` asset. The preview asset remains separate from responsive Hero
artwork.

Verification: `npm run check` and `git diff --check` passed. The built `dist/index.html` contains
all requested tags and `dist/link-preview.png` is present. Deployment and external Open Graph
validator checks are not complete: the currently deployed page responds `200`, but its
`/link-preview.png` URL responds `404`, so this change still needs a Static Site deployment and
validator-cache refresh.
