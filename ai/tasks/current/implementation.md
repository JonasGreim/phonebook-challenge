# Current task: Simplify and center the author footer

## Goal

Create a compact, centered footer focused only on Jonas Greim's authorship and personal profiles.

## Scope

Remove only the footer's project repository link, retaining repository references elsewhere. Keep
the dynamic year, confirmed profile URLs, translated accessible names/tooltips, and external-link
behaviour. Center one author-and-profile group, use 14 px muted blue-gray text, 20 px icons, a
12 px author-to-profile gap, 32 px icon targets with 4 px between them, a one-line centered layout
at narrow widths, focused tests, UI/UX documentation, status, and the Changelog. Preserve normal
document flow.

## Acceptance checks

- The footer contains only the dynamic copyright/author text and verified GitHub and LinkedIn
  profile links in one centered group.
- Text and icons align cleanly and remain in one centered row at narrow widths; profile targets
  remain adjacent and non-overlapping.
- Both links use balanced 20 px icons, 32 px targets with a 4 px gap, primary-blue hover, and
  clear focus treatment.
- Translated accessible names and tooltips update with locale, decorative icons are hidden from
  assistive technology, and Clipboard feedback reserves space above the footer.
- Focused integration coverage and configured automated checks pass; browser checks are separate.

## Status and next step

Implemented: `ProjectFooter` now contains only a centered dynamic author line and confirmed
GitHub/LinkedIn profile links. The repository link and its translation entries were removed only
from the footer. The group uses muted 14 px text, 20 px icons, 12 px author-to-profile spacing,
32 px profile targets, and 4 px between targets. On narrow screens, the compact author/profile
group remains centered on one line.

Verification passed: focused integration coverage passed with 15 tests. `npm run check` passed
with typecheck, lint, format check, 31 tests, and the production build. The known build chunk-size
warning (522.39 kB / 163.71 kB gzip) is not a failure.

Browser verification remains pending because no browser surface is available in this environment.
When available, verify short and long pages, narrow one-line layout, browser zoom, tooltips,
keyboard focus, localized labels, and Snackbar clearance.
