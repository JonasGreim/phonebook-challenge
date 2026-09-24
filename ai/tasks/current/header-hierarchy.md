# Current task: Load the initial alphabetized directory

## Goal

Show the first alphabetically sorted directory page before a search and restore it when the field
is cleared, without changing filtered search behavior.

## Scope and acceptance checks

- Request only the current page through the existing GraphQL pagination query.
- Label the initial card “Alle Kontakte” / “All contacts” and keep count and pagination visible.
- Use the same result card for filtered searches and preserve the existing no-match empty state.
- Keep the current Hero, responsive layout, localization, stable IDs, and clipboard behavior.
- Keep the results section in normal flow on the neutral background with existing spacing.
- Preserve search, GraphQL, pagination, translations, stable IDs, keyboard behavior, and Clipboard
  feedback. Run configured checks and record browser verification separately.

## Status and next step

Implemented: blank queries now request the paginated alphabetized directory page on mount and
after clearing. Filtered queries retain the debounce, ranking, highlighting, pagination, errors,
and empty state. Tests cover the initial request, labels, filtering, restoration, sorting, and
stable identifiers.

Verification: `npm run check` and `git diff --check` are pending. Browser verification should
check initial, filtered, cleared, empty, loading, error, pagination, long-result, and clipboard
states in both locales.
