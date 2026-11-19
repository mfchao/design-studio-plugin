# Section 4: Style guide and references

Goal: a visual direction grounded in references the user approves, and the component or screen to design first.

## Intake

Ask for visual references (images, links, style guide, design system, brand colours and fonts). Save the user's refs as `.design-studio/refs/U01.png`, `U02...` (for links: `node <skill>/scripts/ab.mjs open <url>` then `node <skill>/scripts/ab.mjs screenshot <path>` at 1440 wide, viewport only). If no mood words are given, ask for them in one line.

## Run `style-scout`

Give it: absolute paths of `brief.md`, `research.md`, the `refs/U*` files, `<skill>/references/slop.md`, `<skill>/templates/styleguide.md`, the taste library folder (`ls ~/.agents/skills/design-taste-frontend/library ~/.claude/skills/design-taste-frontend/library 2>/dev/null`), and output paths. It writes a tone read, finds **6 found refs** (`refs/F01..F06.png` + `refs/found.md`), and drafts `styleguide.md`.

## Approve

1. Moodboard: `node <skill>/scripts/contact-sheet.mjs --title "Moodboard" --labels --out .design-studio/refs/moodboard refs/U*.png refs/F*.png`, then `open` it.
2. Ask **in plain chat** (not AskUserQuestion): "Reply with the found refs to keep (e.g. `F01 F04`), plus any direction (e.g. 'more like F03, less dark')." Drop the rest.
3. Update `styleguide.md` (**cap 300 words**, mostly tokens): approved refs and what to take from each, tokens, do/don't.
4. Ask with AskUserQuestion (one question): "Which component or screen should we design first?" with 2 or 3 suggestions from the flow. Save it as `component` in `state.json`.
5. Section gate. "More here" means: another scout round with the user's direction.
