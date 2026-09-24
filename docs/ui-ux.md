# UI/UX design

## FindCall branding

FindCall uses dark blue (`#0B2D5B`) for identity, headings, and primary text, and blue
(`#2563EB`) for interactive elements and the logo's phone handset. Pale page blue (`#F3F6FA`)
separates the white content surface from the background; borders use `#DCE4EE`. Green is limited
to the icon surface, while the theme's higher-contrast success tone is used for status. Values,
typography, radii, focus treatment, and component variants live in `src/theme.ts`.

The type stack is Inter with robust system fallbacks. Inter is not downloaded because no local
font asset exists, so the UI stays readable without an external request. The custom SVG combines
a dark-blue magnifier and blue handset. Its subtitle follows the selected German or English UI
locale. The wordmark hides on small screens while its surrounding link remains accessible. The
transparent page mark and favicon share `src/assets/findcall-mark.svg` geometry. The generated
favicon adds a white circular bubble around that mark, preserving inner spacing and contrast on
light and dark browser tabs. Its artwork is clipped to the bubble, while the transparent page logo
retains the full magnifier handle. The receiver is slightly enlarged and offset for recognition
without changing the signal arcs; the generated favicon must not be edited manually.

## Layout

The production document head provides a bilingual-safe FindCall title, concise directory
description, and Open Graph/Twitter metadata for the public `link-preview.png` illustration. The
preview uses absolute HTTPS URLs and does not contain contact names or phone numbers; responsive
Hero assets remain separate from social sharing artwork.

A responsive hero immediately below the header contains the heading, short explanation, and
prominently labelled search field. From 1300 px, the outer full-width hero uses
`public/hero-image-wider.png` as an enlarged, left-anchored background with the woman, profile
card, magnifier, connection lines, and waves grouped on the right. Between 768 px and 1299 px, it uses
`public/hero-image-big.png` enlarged and left-anchored so only the calm light-blue wave crop is
visible; the right-side illustration details remain completely beyond the viewport. Below 768 px,
the same asset provides a subtle wave texture over a light-blue fallback, while the Hero remains
compact and content-driven. The Hero and results use the same centered
`sm` container axis; the background image never controls content position. The artwork never creates
a separate panel or seam. The wide Hero aligns content toward the bottom with a 40 px card-to-Hero
gap; result content begins 40 px below the Hero on the neutral page background. Results always stay
in normal flow, so a search does not resize the Hero. The concise case-sensitivity helper text uses
13 px secondary text, normal weight, and a 1.5 line height for natural wrapping without competing
with the label or page slogan.

The compact header uses a 48/52/60 px responsive mark and keeps its 22/24 px FindCall wordmark
visible at every width while remaining secondary to the page heading. Its subtitle scales slightly
on large screens and remains hidden on narrow screens for clarity. The responsive 76/84/92 px
header aligns the mark, wordmark, and visible DE/EN language switch without invented navigation.
The selection persists; query, page size, page, and results remain on language change. A labelled
icon button clears the query.

A restrained semantic footer follows the content in normal document flow. On short pages, the
main layout expands so it reaches the viewport bottom; on longer pages, it follows the results.
One centered group combines the dynamic author line with tightly grouped GitHub and LinkedIn
profile icons. It uses 14 px muted blue-gray typography, optically balanced 20 px icons, a 12 px
author-to-profile gap, 32 px icon targets, and 4 px between targets. The compact author-and-profile
group remains centered on one line at narrow widths. Links use translated labels and tooltips,
restrained theme contrast, primary-blue hover, and the theme focus treatment for keyboard
navigation. Clipboard feedback reserves space above it.

Results use a compact list with a translated range such as “1–10 of 34 results”. On initial load
and after clearing the field, the same card is labelled “Alle Kontakte” / “All contacts” and shows
the first alphabetically sorted directory page. It requests only the current page through the
existing GraphQL pagination query. Below it are a 10/25/50 page-size selector and
keyboard-accessible pagination. On narrow views, those controls stack with adequate spacing. Each
contact also has a copy icon button with a tooltip and accessible label. Literal query matches are subtly highlighted in the original name with semantic
`mark` elements. Their background is the theme's light primary-blue variant, derived from the
FindCall accent blue, with existing dark-blue primary text for readable contrast on the white
result surface. Highlighting does not change the name's text or accessible name.

## States

- Initial directory: the first alphabetically sorted page is visible immediately, with count,
  page-size, and pagination controls. The labelled search field remains visible.
- Waiting/loading: neutral status; loading additionally shows a spinner.
- Delayed hosted-service start: after three seconds, loading explains in the active language that
  the first request can take up to a minute. It is neutral, does not move focus, and clears with
  the request.
- Results: range, contact list, page size, and navigation.
- Copying: a bottom Snackbar reports success or a clear failure without shifting content. Success
  uses the theme's green status color; errors use the white FindCall surface with a blue accent.
  The copied button briefly shows a same-size check icon; numbers remain visible.
- No results: the standard results card shows a translated `0` count and one contact-row-shaped,
  neutral empty state: a light-blue search icon circle, a name-weight message, and a muted hint.
  It uses one polite announcement and omits pagination and the page-size selector.
- Error: a highlighted error instead of an empty result list.

Changing a query immediately hides stale results. Clearing the field ignores pending answers and
returns to the initial state.

## Decisions

| Decision                                                | Benefit                                                                                       | Alternative and drawback                                                            | Verification                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 280 ms debounce                                         | Responsive input without a request for every keystroke.                                       | Immediate requests create unnecessary server load.                                  | Covered by automated behavior tests.                                                               |
| Visible field label and helper text                     | The search purpose and rules remain clear while typing.                                       | A placeholder alone disappears during input.                                        | Browser keyboard and accessibility behavior confirmed by the user for step 4.                      |
| `aria-live` status and Material UI focus treatment      | Feedback is available without watching the list.                                              | Purely visual feedback is less accessible.                                          | Screen-reader-specific verification remains open.                                                  |
| Symbolic FindCall wordmark and favicon                  | The brand is recognizable without a marketing panel.                                          | External imagery would be harder to maintain and license.                           | Production build includes favicon; 16/32 px display remains a visual review item.                  |
| Compact list rather than cards                          | Many results remain scannable and need less mobile scrolling.                                 | Large cards consume unnecessary space.                                              | Browser layout was confirmed by the user for step 4.                                               |
| Central DE/EN switch                                    | Language and accessible labels change consistently without losing context.                    | Per-component translations drift more easily.                                       | Automated checks and browser verification confirmed by the user.                                   |
| Server-side pagination after complete search            | No match is lost at a page boundary; ID sorting distinguishes equal names.                    | Filtering only a pre-paged subset gives incomplete results.                         | Local checks, browser verification, and GitHub Actions confirmed by the user.                      |
| Copy button per contact                                 | A number can be transferred quickly and remains selectable after a failure.                   | Manual selection is slower; early success feedback is misleading.                   | Automated coverage and CI confirmed by the user; real Clipboard and keyboard testing remains open. |
| Server-side start-match ranking with literal highlights | Likely name matches appear first while all substring matches remain visible and scannable.    | Client-side rank changes after pagination would make totals and pages inconsistent. | Automated ranking and highlight coverage added; browser review remains open.                       |
| Bottom Snackbar for copy feedback                       | Status does not move result content, and the temporary button check gives local confirmation. | Inline feedback shifts the list; a modal interrupts keyboard flow.                  | Automated state and stale-operation coverage added; mobile and keyboard review remains open.       |
