# Current task: Refine header hierarchy and responsive layout

## Goal

Improve the FindCall header's visual hierarchy across target viewport widths without changing its
navigation, language selection, search behavior, data, or SVG geometry.

## Scope and acceptance checks

- Increase and rebalance the visible mark, wordmark, subtitle, language switch, spacing, and header
  height using existing Material UI responsive styles.
- Keep the wordmark secondary to the page heading, hide supporting text where mobile clarity needs
  it, and preserve current labels, selected state, and keyboard behavior.
- Run configured checks and record automated and browser verification separately.

## Status and next step

Implemented: the header uses a responsive 48/52/60 px mark, always-visible 22/24 px wordmark,
slightly larger subtitle on large screens, 76/84/92 px height, and coordinated spacing to the
existing language switch. Only the subtitle remains hidden below the small-screen breakpoint.
Navigation, locale labels, selected state, keyboard behavior, and all SVG geometry remain unchanged.

Verification passed: `npm run check` completed typecheck, lint, format check, 32 tests, and the
production build. `git diff --check` passed. The prior local desktop browser inspection remains
historical evidence for German and English alignment and locale switching.

Pending browser verification: the available browser could not set the requested 320, 375, 768,
1024, and 1440 px viewport widths. Check those widths with German and English before/with results,
no results, and longer lists for clipping, wrapping, horizontal overflow, and header/footer
spacing. The known build chunk-size warning is not a failure.
