# Requirements

## Product requirements

- Names are searched as free text while typing, without case sensitivity.
- Results show the complete name and phone number.
- The interface remains usable on small and large screens.
- `server/data/telefonbuch.json` is the byte-identical, server-side source of data.
- The client queries data at runtime through GraphQL.

## Agreed behavior

- A one-character-or-longer substring in `name` is searchable.
- Input is trimmed before searching; an empty input requests the first paginated directory page,
  sorted alphabetically by display name.
- Phone numbers are not searched and are always displayed as their original strings.
- Accents and transliterations are not normalized.
- The server searches every matching contact first and ranks name starts and starts after spaces
  or hyphens before remaining substring matches. Each group sorts deterministically by name and
  then stable contact ID before pagination.
- The default is 10 results per page; 10, 25, and 50 are available.
- Each response returns contacts, page, page size, total count, and total pages. Invalid page or
  page-size parameters are rejected by the server.
- Filtered requests start after 280 ms without input; the initial directory request starts on
  mount and clearing the field requests page one immediately. Abortion and a request ID prevent
  older responses from replacing newer state.
- After three pending seconds, a neutral translated message explains that a free hosted service may
  still be starting; it clears when the request finishes or is superseded.

## Internationalization

The interface supports German and English. The visible choice is stored locally and changes the
document language. UI text, statuses, errors, tooltips, and accessible labels come from a central
translation source. Brand name and contact data remain unchanged; switching language preserves
the query, page size, page, and results.

## Copying phone numbers

Every visible contact has an accessible copy action. It sends only the original phone-number
string to the Clipboard API. A success message follows only after completion; unavailable or
rejected Clipboard access produces a clear message. The visible phone number remains available
for manual selection. Feedback appears in a non-modal bottom Snackbar, avoiding layout shifts;
the successful button briefly shows a translated checkmark without changing its dimensions.

## Initial directory and empty result state

On initial load, and after clearing the field, the client requests only the current page of the
complete directory through the existing GraphQL pagination query. The initial card is labelled
“Alle Kontakte” / “All contacts”, keeps its result count and pagination controls, and does not
download the complete phonebook into the browser. Entering a term switches the same card to the
filtered search view.

After the latest accepted non-empty search returns zero matches, the
results card shows its translated heading, a `0` count, and one neutral contact-row-shaped empty
state with a search icon, name-weight message, and translated hint; it does not show pagination or
a page-size selector. Loading and technical errors remain separate states, and clearing invalidates
pending answers.

## Technical baseline and scope limits

Client, server, and relevant tests use strict TypeScript. JSON data continues to receive runtime
validation; types do not replace it. ESLint checks TypeScript/React code, while Prettier formats
only source and configuration, never the immutable `telefonbuch.json` source.

There is no sign-in, editing, database, or search index. Render deployment is prepared but not
created or verified; the public backend URL must be configured for the static production build.

## Verification coverage

Automated tests cover substrings, case, whitespace, duplicate names with distinct numbers, empty
search, no matches, data validation, late responses, clearing input, pagination traversal and
boundaries, invalid parameters, resets, and stale responses. They also cover Clipboard contact
selection, delayed success, rejected access, and a missing Clipboard API.

The user confirmed successful automated checks, browser verification, and GitHub Actions for
step 4. For step 5, the user confirmed a successful local `npm run check` with 21 tests and a
successful GitHub Actions run. A real browser copy and keyboard test is still open.

## Search ranking and highlighting

Search remains a case-insensitive, trimmed substring match against the complete name. A match at
the beginning of the name or immediately after a space or hyphen ranks ahead of a match within a
name; no valid substring match is removed. Multi-word searches stay contiguous substrings.

Displayed names highlight all non-overlapping literal matches with a semantic `mark` element.
Highlighting preserves original casing and characters, treats symbols literally, and uses the
query belonging to the accepted response so stale data cannot be misleadingly marked.
