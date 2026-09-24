# Current task: Reduce search helper-text prominence

## Goal

Keep the translated case-sensitivity hint useful while making it secondary to the field and page
content.

## Scope and acceptance checks

- Use the central translations and preserve search behavior.
- Use 13–14 px secondary, normal-weight helper typography with sufficient line height and natural
  wrapping at every viewport size.
- Run configured checks and record automated and browser verification separately.

## Status and next step

Implemented: helper text is now “Groß- und Kleinschreibung wird nicht berücksichtigt.” /
“Search is not case-sensitive.”. It uses 13 px normal-weight secondary text with 1.5 line height and
standard wrapping, without changing field behavior.

Verification passed: `npm run check` completed typecheck, lint, format check, 32 tests, and the
production build. Translation assertions cover German initial and English switched states. `git
diff --check` passed. The known build chunk-size warning is not a failure.

Pending browser verification: inspect 320, 375, 768, 1024, and 1440 px in both languages with
empty, focused, typed, result, empty-result, and error states. Check readability, alignment,
wrapping, layout shifts, and horizontal overflow.
