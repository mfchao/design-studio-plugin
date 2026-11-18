# Section 7: Summary report

Goal: one polished report that tells the story of the whole process, from problem to final design, with rationale. It should be good enough for a portfolio case study or a stakeholder review.

## Intake

Ask the user to upload the final design (if it differs from `final/`), plus anything else they want included (photos of sketches, test results, stakeholder quotes). Copy these into `.design-studio/report/assets/`. Ask one question with AskUserQuestion: the report's audience (for example "Stakeholders / client", "Portfolio case study", "Engineering handoff", or Other), because it sets tone and depth.

## Run `report-writer`

Give it: the absolute path of every file in `.design-studio/` (brief, research, flow critique, styleguide, directions, ROUNDS.md, evals/*.json, contact sheets, final shots, report/assets), the audience, `<skill>/templates/report.html`, and the output path `.design-studio/report/index.html`. Before writing, the orchestrator loads the `artifact-design` and `artifact-diagramming` skills and passes their key rules to the writer (title, tokens, dark mode, phone width, allowed CDNs).

The report contains, in order:
1. **Cover:** project name, one-line outcome, final hero shot, final score.
2. **The problem:** a problem statement card, a "How might we" card, the context, constraints and stakeholders.
3. **Users:** persona or needs cards per user type (pain points, goals, assumptions), plus a **journey map** diagram (stages × actions, thoughts, pain points, opportunities).
4. **Goals:** design objectives and success metrics as a compact table.
5. **Research:** the key theories (why they mattered), a landscape comparison table, benchmark thumbnails, and opportunities.
6. **Main flow:** the flow before and after critique, shown as two diagrams (Mermaid from the jsdelivr CDN, pinned version), and the key findings with how they were resolved.
7. **Visual direction:** the moodboard, the approved refs with what was taken from each, and the tokens shown as swatches and a type scale.
8. **Exploration:** the grid of 10 variations with names, and why the chosen one won.
9. **Iteration:** a timeline from ROUNDS.md (each round: feedback quote, change, score), and a **score-per-round chart** (inline SVG line chart of the weighted score, with a 9.2 bar line) plus a final per-dimension bar chart.
10. **Final design:** large shots (desktop and mobile), with numbered annotations tying each design decision back to an objective, research finding or flow fix.
11. **Outcome and next steps:** how it meets the success metrics, what remains open, and recommendations.

Images go in `report/assets/` and are referenced relatively. Copy the screenshots used.

## Publish

1. Run `slop-check.mjs` on `report/index.html` (the report itself must not look AI-made).
2. Publish with the Artifact tool. Pass `file_path` `.design-studio/report/index.html`, `files` mapping each `assets/...` image, and `icon: "chart"`. The page is private until the user shares it. Give the user the link and the local path.
3. Offer an export of the PDF version (print stylesheet included) if they want a file.
4. Section gate. "More follow-ups here" means: edit the report and republish it to the same URL.
