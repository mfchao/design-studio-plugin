# Section 5: Design, 10 variations and iteration

Goal: 10 genuinely different, reference-grounded, slop-free variations of the chosen component or screen, then iterate with the user until they pick a direction.

## 1. Direction matrix (main thread, before building)

Write `.design-studio/directions.md`: 10 directions, each a row with:
- **Name** (two words, never "Modern Minimal")
- **Grounded in:** 1 to 3 approved refs (U02, F05) and exactly what is taken from each
- **Axes:** layout structure, density (airy, balanced, dense), hierarchy lead (type-led, image-led, data-led), surface (flat, layered, outlined), accent use, interaction and motion idea
- **Flow fit:** which flow step it serves, and how it addresses one Section 3 finding

Two directions may not share more than two axis values. At least two must be bold: unexpected but defensible. Cook's rule applies: references are the minimum bar, not inspiration, and you never copy one element 1:1.

## 2. Build (5 × `variant-builder` in parallel, 2 directions each)

Give each builder: the absolute paths of `brief.md`, `styleguide.md`, `directions.md` (and which two rows it owns), `flow/flow-critique.md`, the ref images it needs, `<skill>/references/slop.md`, the script paths, and its output paths `.design-studio/variations/r01/vNN.html`.

Each builder must:
- Write one self-contained HTML file per variation (inline CSS and JS; fonts from Google Fonts; no external images unless they are the approved refs or licensed stand-ins with credit in an HTML comment). Use the tokens in `styleguide.md`.
- Use real, specific content from the brief (real labels, plausible data, real copy). No lorem ipsum and no "Elevate your workflow".
- Include the key states the brief calls for: default, hover and focus, empty or error where relevant.
- Be responsive: 1440 and 390 widths, with no horizontal scroll.
- Run `node <skill>/scripts/slop-check.mjs <file>` and fix every finding, then re-run until it exits 0 (or justify each remaining advisory in a comment at the top of the file).
- Run `node <skill>/scripts/shoot.mjs --out .design-studio/variations/r01/shots <files>` for desktop and mobile shots.
- Return the paths and one sentence per variation.

## 3. Slop gate

Run `slop-critic` with **only** the screenshot paths and `slop.md`. Any variation it flags as Slop is rebuilt by a builder with the critic's notes. Then re-check it.

## 4. Show

`node <skill>/scripts/contact-sheet.mjs --title "Round 1" --labels --cols 5 --out .design-studio/variations/r01/sheet .design-studio/variations/r01/shots/*-desktop.png`, plus a mobile sheet. `open` both. In chat, give a one-line note per variation: its name, the refs it is grounded in, and the idea.

## 5. Iterate (the loop)

Ask what the user wants next. They might:
- pick favourites ("3 and 7")
- combine ("v3 header with v7 cards")
- edit ("warmer accent, less text, bigger chart")
- ask for more variations in a direction

For each round:
1. Log the user's exact words in the `ROUNDS.md` feedback inbox (from `templates/ROUNDS.md`, if it is not there yet).
2. Rebuild only the affected variations into `variations/rNN/` (a new round folder, keeping earlier rounds), with builders in parallel where they are independent.
3. Run the slop check, shots and slop critic, then the contact sheet again.
4. Log the round: what changed, and which feedback item each change closes.
5. Show it and ask again.

When the user picks a final direction, copy it to `.design-studio/final/v-final.html` and set `state.json` to match. Then run the section gate (Next goes to Section 6).
