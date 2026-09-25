# Current task: Focused README improvements and MIT License

## Goal

Improve the public project documentation in focused, factual ways and add an MIT License without
changing the existing README presentation, screenshots, product behaviour, or deployment setup.

## Scope

- Add `LICENSE` with the standard MIT text and the 2026 Jonas Greim copyright notice.
- Set the package license to `MIT`.
- Keep the README layout, screenshots, setup commands, and deployment structure; add concise
  challenge context, test-suite clarification, AI-assisted-development guidance, license, and
  clearly out-of-scope next steps.
- Include `docs/` once in the compact project structure and make License the final README section.
- Keep one detailed free-tier cold-start explanation and verify local configuration and CI/deploy
  wording against the repository configuration.

## Status

Implemented:

- Added the standard MIT License with `Copyright (c) 2026 Jonas Greim` and set the package
  metadata to `MIT`.
- Kept the README presentation and screenshots intact while adding concise challenge, testing,
  AI-assisted-development, license, and out-of-scope next-step guidance.
- Added the requested `docs/` structure entry and placed the unchanged MIT license link after the
  unchanged possible next steps.
- Reduced the repeated Render cold-start explanation to a reference to the primary Live demo
  section and kept development fallback and production environment-variable guidance aligned with
  `src/api.ts` and `render.yaml`.

Verified locally: local README links resolve; the MIT text and package metadata match; static
Markdown review found only standard GitHub-flavoured Markdown and existing supported image HTML.
`LICENSE`, package metadata, the single `docs/` entry, the final License heading, and the
relative `LICENSE` link were checked locally. `npm run check` passed again (typecheck, lint,
formatting, 34 tests, and production build), and `git diff --check` passed. The Vite build
retained its existing non-failing chunk-size warning.

Open limitation: GitHub light- and dark-theme rendering of these uncommitted README changes cannot
be inspected on GitHub without publishing a branch or pull request. Verify that presentation after
the user decides to publish; no code, screenshots, deployment configuration, or phonebook data
changed.
