# Backlog: FindCall improvements

## Task 2 - Empty result area and copy feedback

Planned only. Keep the result area empty for an empty query, while retaining search labels and
handling actual loading, no-result, and error states. Replace inline copy success feedback with a
non-modal bottom Snackbar, add brief stable-button success feedback, and handle repeated or late
clipboard results without stale messages. Verify accessibility, keyboard behavior, mobile layout,
and no layout shift.

## Task 3 - Targeted project structure improvement

Planned only. Before moving files, inspect the real structure and propose a compact target tree
with reasons for approval. Extract only independently useful React components or logic; apply a
consistent test pattern without moving tests merely for appearance. Review root-file purposes.
Move `telefonbuch.json` to a server data directory only after approval, verify its bytes before
and after, keep it out of client assets, and update all affected paths, documentation, and
`AGENTS.md`.
