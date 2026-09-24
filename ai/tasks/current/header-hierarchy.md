# Current task: Refine the README brand header

## Goal

Replace the oversized, isolated README logo presentation with a compact centered FindCall brand
header that remains clear in GitHub light and dark modes.

## Scope and acceptance checks

- Use the existing generated `public/favicon.svg` at approximately 72 px wide.
- Center the icon to the left of the FindCall heading, followed by the existing quality-check badge
  and short English description.
- Keep the live-demo link centered directly below the short description and retain all remaining
  README content.
- Keep the badge tied to the repository quality workflow and do not alter logo geometry or favicon
  generation.

## Status and next step

Implemented: the README now uses a compact centered favicon to the left of the FindCall heading,
followed by the workflow badge, description, and centered live-demo link while retaining the
remaining content.

Verification: `npm run check` passed (typecheck, lint, formatting, 34 tests, and production build);
`git diff --check` passed; `public/favicon.svg` remains unchanged and its white bubble, dark-blue
magnifier, blue handset, and green signal arcs provide contrast on both light and dark backgrounds.
The README uses root-relative favicon and repository workflow URLs that resolve on GitHub. A
published GitHub preview of these unpushed changes is not available in this workspace.
