# Section 5: Design, variations and iteration

Goal: **6** genuinely different, reference-grounded, slop-free variations of the chosen component or screen (desktop 1440 unless `platform` says otherwise), then iterate until the user picks one. If the user asks for more, build up to 10.

## 1. Direction matrix (main thread)

Write `.design-studio/directions.md` as one table, **one row per direction, ≤ 25 words per row**:
name (two words, never "Modern Minimal") | grounded in (refs + what's taken) | layout | density | hierarchy lead | surface | key idea | flow fix it addresses.

No two directions share more than two axis values. At least two are bold but defensible. Never copy a ref element 1:1.

## 2. Build (3 × `variant-builder` in parallel, 2 directions each)

Give each builder: absolute paths of `brief.md`, `styleguide.md`, `directions.md` (and its two rows), the ref images for its rows only, `<skill>/references/slop.md`, script paths, `platform`, and output paths `.design-studio/variations/r01/vNN.html`, shots in `.design-studio/variations/r01/shots/`. Don't pass the flow critique; the direction rows already carry the flow fix.

Builders write self-contained HTML at 1440 desktop using styleguide tokens and real content, run `slop-check.mjs` until clean, and shoot desktop only (`shoot.mjs` default).

## 3. Slop gate

Build the sheet first: `node <skill>/scripts/contact-sheet.mjs --title "Round 1" --labels --cols 3 --out .design-studio/variations/r01/sheet .design-studio/variations/r01/shots/*-desktop.png`.
Run `slop-critic` on **the sheet only** plus `slop.md`. Rebuild anything marked Slop with the critic's note, then re-shoot and redo the sheet.

## 4. Show

`open` the sheet. In chat, one line per variation: name, refs, idea.

## 5. Iterate

Ask what's next (favourites, combine, edit, more in a direction). Each round:
1. Log the user's exact words in `ROUNDS.md` (from `templates/ROUNDS.md` if missing).
2. Rebuild **only** affected variations into `variations/rNN/`. Small edits (copy, colour, spacing) you do in the main thread with Edit, no agent.
3. Slop check, desktop shot, sheet. Slop critic only if layout changed.
4. Log the round in ≤ 4 lines.
5. Show and ask again.

When the user picks a final direction, copy it to `.design-studio/final/v-final.html`, update `state.json`, and run the section gate.
