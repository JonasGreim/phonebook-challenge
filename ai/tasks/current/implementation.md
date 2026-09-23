# Current task: Refine favicon clipping and phone proportions

## Goal

Give the generated favicon a clean circular silhouette and improve receiver recognition while
preserving the shared FindCall SVG workflow and the page logo's full magnifier handle.

## Scope

Clip only generated favicon artwork to its white circle, enlarge and rebalance the shared receiver
without changing colors or signal arcs, regenerate deterministically, and preserve locale, layout,
accessibility, and unrelated application behavior.

## Acceptance checks

- The generated favicon has transparent corners and clipped artwork at the white circle boundary.
- The receiver is 12% larger, remains visually separated from the ring and signal arcs, and uses
  the existing colors.
- The page logo retains its full handle, dimensions, home-link label, responsive wordmark, and
  translated subtitle.
- Generation is deterministic, automated checks pass, and browser visual checks are recorded
  separately.

## Status and next step

Implemented: `findcall-mark.svg` enlarges the receiver by 12% and shifts it slightly down and
left, leaving the signal arcs unchanged. The favicon generator wraps only derived artwork in a
circle `clipPath`, while the page logo continues to load the full transparent source mark.

Verification passed: repeated generation produced the same SHA-256 output, the generator check
passed, and `npm run check` passed with typecheck, lint, format check, 30 tests, and the production
build. The build emitted the known chunk-size warning.

Browser visual verification could not run because no browser surface is available in this
environment. Inspect the page mark at 44 px and the favicon at 16 and 32 px on light and dark
tabs when a browser is available; verify clipping, receiver spacing, and favicon loading after a
cache-bypassing reload.
