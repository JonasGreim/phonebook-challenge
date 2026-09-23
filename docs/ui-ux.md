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
locale. The wordmark hides on small screens while its surrounding link remains accessible; the
simplified mark is also the favicon. The favicon adds a white circular bubble around the existing
mark, preserving inner spacing and contrast on light and dark browser tabs.

## Layout

A narrow centered content area places the heading, short explanation, and prominently labelled
search field before the results. It uses available width on small screens and preserves a readable
line length on larger ones.

The compact header contains the wordmark and a visible DE/EN language switch, without invented
navigation. The selection persists; query, page size, page, and results remain on language
change. A labelled icon button clears the query.

Results use a compact list with a translated range such as “1–10 of 34 results”. Below it are a
10/25/50 page-size selector and keyboard-accessible pagination. On narrow views, those controls
stack with adequate spacing. Each contact also has a copy icon button with a tooltip and
accessible label. Literal query matches are subtly highlighted in the original name with semantic
`mark` elements. Their background is the theme's light primary-blue variant, derived from the
FindCall accent blue, with existing dark-blue primary text for readable contrast on the white
result surface. Highlighting does not change the name's text or accessible name.

## States

- Initial/empty: no result-state message or stale list; the labelled search field remains visible.
- Waiting/loading: neutral status; loading additionally shows a spinner.
- Results: range, contact list, page size, and navigation.
- Copying: a bottom Snackbar reports success or a clear failure without shifting content. Success
  uses the theme's green status color; errors use the white FindCall surface with a blue accent.
  The copied button briefly shows a same-size check icon; numbers remain visible.
- No results: an unambiguous non-technical message.
- Error: a highlighted error instead of an empty result list.

Changing a query immediately hides stale results. Clearing the field ignores pending answers and
returns to the initial state.

## Decisions

| Decision | Benefit | Alternative and drawback | Verification |
| --- | --- | --- | --- |
| 280 ms debounce | Responsive input without a request for every keystroke. | Immediate requests create unnecessary server load. | Covered by automated behavior tests. |
| Visible field label and helper text | The search purpose and rules remain clear while typing. | A placeholder alone disappears during input. | Browser keyboard and accessibility behavior confirmed by the user for step 4. |
| `aria-live` status and Material UI focus treatment | Feedback is available without watching the list. | Purely visual feedback is less accessible. | Screen-reader-specific verification remains open. |
| Symbolic FindCall wordmark and favicon | The brand is recognizable without a marketing panel. | External imagery would be harder to maintain and license. | Production build includes favicon; 16/32 px display remains a visual review item. |
| Compact list rather than cards | Many results remain scannable and need less mobile scrolling. | Large cards consume unnecessary space. | Browser layout was confirmed by the user for step 4. |
| Central DE/EN switch | Language and accessible labels change consistently without losing context. | Per-component translations drift more easily. | Automated checks and browser verification confirmed by the user. |
| Server-side pagination after complete search | No match is lost at a page boundary; ID sorting distinguishes equal names. | Filtering only a pre-paged subset gives incomplete results. | Local checks, browser verification, and GitHub Actions confirmed by the user. |
| Copy button per contact | A number can be transferred quickly and remains selectable after a failure. | Manual selection is slower; early success feedback is misleading. | Automated coverage and CI confirmed by the user; real Clipboard and keyboard testing remains open. |
| Server-side start-match ranking with literal highlights | Likely name matches appear first while all substring matches remain visible and scannable. | Client-side rank changes after pagination would make totals and pages inconsistent. | Automated ranking and highlight coverage added; browser review remains open. |
| Bottom Snackbar for copy feedback | Status does not move result content, and the temporary button check gives local confirmation. | Inline feedback shifts the list; a modal interrupts keyboard flow. | Automated state and stale-operation coverage added; mobile and keyboard review remains open. |
