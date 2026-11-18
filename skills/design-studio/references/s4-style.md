# Section 4: Style guide and references

Goal: lock a visual direction grounded in real references that the user approves, and pick the component or screen to design.

## Intake

Ask for visual references (images, links, a style guide, an existing design system, brand colours and fonts). Save the user's own refs as `.design-studio/refs/U01.png`, `U02...` (screenshot links with `node <skill>/scripts/ab.mjs open <url>` then `node <skill>/scripts/ab.mjs screenshot --full <path>`). Ask in one line for any words on mood ("calm, clinical, warm, playful...") if none are given.

## Run `style-scout`

Give it: the absolute paths of `brief.md`, `research.md`, the `refs/U*` files, `<skill>/references/slop.md`, the taste library folder (find it with `ls ~/.agents/skills/design-taste-frontend/library ~/.claude/skills/design-taste-frontend/library 2>/dev/null`), and the output paths. It:

1. Reads every user ref at full size and writes the **tone read**: mood words, palette (hex values), type (families, contrast, scale), density, shape language (radius, borders), imagery, motion feel.
2. Finds **8 to 12 more refs** that match that tone and are unique and striking rather than generic:
   - Inspo: `recommend` with the tone read as the brief, `find_by_color` for the key hexes, `find_similar` for the closest hits, `get_design_system` for the best two (real tokens), `find_reference_components` for the chosen component type.
   - Awwwards: search by colour, tag and category, design DNA for the best hits, and `create_design_brief` from the 2 to 5 strongest refs.
   - Taste: suggest palette and type pairings from `palettes.json` and `type.json` that fit the tone.
   - Removes every candidate that trips `slop.md`.
   - Saves the images as `refs/F01.png`, `F02...`, plus `refs/found.md` (source URL, why it fits, what to take).
3. Writes a draft `styleguide.md` from `templates/styleguide.md`.

## Approve

1. Build the moodboard: `node <skill>/scripts/contact-sheet.mjs --title "Moodboard" --labels --out .design-studio/refs/moodboard refs/U*.png refs/F*.png`, then `open` it.
2. Ask with AskUserQuestion (multiSelect, up to 4 options per question, several questions if needed) which found refs to **keep**. Anything not picked is dropped. Free text gives direction ("more like F03, less dark").
3. Update `styleguide.md`: the approved refs, with what to take from each (light, colour, type, layout, a component), plus tokens (colour roles with hex values and a contrast note, type scale, spacing scale, radius, elevation, motion) and the do and don't list.
4. Ask: "Which key component, screen or system should we design first?" Offer 2 or 3 suggestions from the flow (for example "the onboarding first screen", "the dashboard summary card", "the booking form") and save the answer in `state.json` as `component`.
5. Section gate. "More follow-ups here" means: another scout round with the user's direction.
