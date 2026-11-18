# Section 2: Research

Goal: use the brief to find (1) the key theory and concepts that matter for this project and (2) what already exists in the world today. Then present one report.

## Run two subagents in parallel

Give each one the absolute path of `.design-studio/brief.md`, its output path, and the date.

**`theory-researcher`** writes `.design-studio/research-theory.md`
- 5 to 10 theories, laws, frameworks or standards that directly affect this design (for example Hick's law for a menu-heavy flow, Fitts's law for touch targets, Fogg's behaviour model for habit products, cognitive load for dense dashboards, WCAG 2.2 and domain regulations such as HIPAA UX rules for health, platform HIG or Material guidance).
- Each one: what it says in two lines, why it matters for **this** brief, the design implication, and a source link.

**`benchmark-researcher`** writes `.design-studio/research-benchmark.md` and saves images to `.design-studio/refs/bench/`
- WebSearch and WebFetch: existing products, technologies and services, including adjacent ones and physical products when relevant.
- Inspo MCP: `recommend(brief)` plus `search_screens` for the relevant page types and macrostructures.
- Awwwards MCP: search for relevant categories and tags.
- Output: a comparison table (product, who it serves, key flow, strengths, weaknesses, notable UI pattern, link), 6 to 12 reference screens with URLs or saved image paths, patterns to adopt, patterns to avoid, and **gaps or opportunities** this project can own.

## Merge and present

1. Combine both into `.design-studio/research.md`: a summary at the top (5 bullets: the most important things learned), then Theory, then Landscape, then Opportunities mapped to the design objectives in the brief.
2. If the user agrees to it, build a moodboard of the benchmark screens with `node <skill>/scripts/contact-sheet.mjs --title "Benchmark" --out .design-studio/refs/bench/sheet <images...>` and `open` it.
3. Show the summary and opportunities in chat, with the paths to the full report and the sheet.
4. Section gate. "More follow-ups here" means: dig into one competitor, one theory, or a new question, using the same researchers.

## Fallbacks

If an MCP server is unreachable, use WebSearch only, and say so in the report.
