# Current task: Localize logo subtitle and improve favicon contrast

## Goal

Connect the FindCall logo subtitle to the existing German/English translations and make the
favicon recognizable on light and dark browser tabs without changing the page logo layout.

## Scope

Add the two approved subtitle translations, pass the selected translation through the existing
header and logo components, add a white SVG favicon bubble, add focused behavior coverage, and
update affected documentation and the Changelog. Do not change search, data, GraphQL, branding
colors, or component structure.

## Acceptance checks

- Switching locale and loading a persisted locale changes the logo subtitle.
- The page logo keeps its dimensions and wordmark layout.
- The favicon retains the existing mark with a white circular background and inner spacing.
- Relevant automated checks pass; browser-specific visual checks are recorded separately.

## Status and next step

Implemented: `logoSubtitle` is translated through the existing locale record and passed from
`AppHeader` to `FindCallLogo`; the favicon retains its mark inside a white circular bubble.
The targeted integration test passed (14 tests), and `npm run check` passed with typecheck, lint,
format check, 30 tests, and the production build. The known build chunk-size warning remains.

Browser visual verification could not run: the available computer-use environment has no browser
surface, and its in-app browser is unavailable. The page logo layout, favicon readability on light
and dark tabs, live locale switch, persisted-locale reload, and keyboard interaction therefore
still require a manual browser check. No application behavior other than the requested subtitle
and favicon presentation was changed.
