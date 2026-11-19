# Section 3: Main-flow critique

Goal: critique the **logic** of the main flow. Never visuals.

## Intake

Ask the user for the main flow and key screens in any form (images, Figma export, step list, Mermaid, link). Copy files into `.design-studio/flow/`. If it's only words, write numbered steps and confirm.

## Run `flow-critic`

Give it the absolute paths of `brief.md`, `research.md` and every file in `flow/`. Output `.design-studio/flow/flow-critique.md`, **cap 400 words**:
1. **Flow** as a Mermaid flowchart (with decision points).
2. **Findings** table: severity (Blocker / Major / Minor) | step | problem | fix. Max 8 rows, Blockers and Majors first. Checks: wasted steps, dead ends, missing back/undo, error/empty/permission paths, brief edge cases, decision overload, memory load, first use vs returning, objectives with no supporting step.
3. **Revised flow** as Mermaid, plus ≤ 5 bullets on what changed.
4. **Open questions** (≤ 3) only the designer can answer.

## Present

Show Blockers and Majors, the revised Mermaid flow, and the path. Section gate. A revised flow from the user re-runs the critique with a "fixed / still open / new" list at the top.
