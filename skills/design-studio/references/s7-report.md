# Section 7: Summary report

Goal: a short, scannable case study, problem to final design. A reader gets the story in 2 minutes.

## Intake

Ask the user (one AskUserQuestion) for the audience: "Stakeholders / client", "Portfolio case study", "Engineering handoff". Ask in plain chat whether there's anything extra to include (sketches, test results, quotes); copy those into `.design-studio/report/assets/`.

## Run `report-writer`

Give it: absolute paths of `brief.md`, `research.md`, `flow/flow-critique.md`, `styleguide.md`, `directions.md`, `ROUNDS.md`, the latest `evals/rNN.json`, the round-1 sheet, the final desktop shot, `report/assets/`, the audience, `<skill>/templates/report.html`, and the output path `.design-studio/report/index.html`. Pass these artifact rules in the prompt (don't load the artifact skills unless needed): `<title>` of 2 to 4 words, colours as tokens on `:root` with dark mode (already in the template), no horizontal scroll at phone width, scripts only from cdnjs/jsdelivr with pinned versions.

**Total text cap: 600 words.** Sections, in order, each ≤ 80 words of text:
1. **Cover:** project name, one-line outcome, final desktop shot, final score.
2. **Problem:** problem statement + HMW + users in one card row.
3. **Research:** 3 to 5 takeaways that shaped the design.
4. **Flow:** before/after Mermaid diagrams + the 3 most important fixes.
5. **Direction:** the round-1 sheet + why the chosen one won (≤ 3 bullets) + palette swatches.
6. **Final design:** large desktop shot with ≤ 5 numbered annotations, each tied to an objective or finding. Score-per-round SVG line chart with a 9.2 line.
7. **Next steps:** ≤ 4 bullets.

Images go in `report/assets/`, referenced relatively.

## Publish

1. Run `slop-check.mjs` on `report/index.html`.
2. Publish with the Artifact tool: `file_path` `.design-studio/report/index.html`, `files` mapping each `assets/...` image, `icon: "chart"`. Give the user the link and local path.
3. Section gate. "More here" means: edit and republish to the same URL.
