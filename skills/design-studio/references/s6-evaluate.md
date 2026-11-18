# Section 6: Evaluation to 9.2/10

Goal: score the final design on every design metric with zero-context critics on other models plus measured checks, then keep improving it until it reaches the bar.

## Input

The user uploads the final component, screens or design (HTML, images, or a link), or confirms `final/v-final.html`. Copy it into `.design-studio/final/`. An image-only design can be scored but not auto-fixed. In that case, say so, and offer to rebuild it as HTML so the loop can fix it, or return fixes as annotated recommendations each round.

## Bar (write it in ROUNDS.md)

Stop only when **all** are true:
- The weighted median score is **≥ 9.2** (weights in `rubric.md`).
- **No single dimension is below 8.5.**
- axe has **zero critical or serious violations**, every text contrast meets AA, and every touch target is at least 44 × 44 px (measured).
- `slop-check.mjs` exits 0.

## Each round

1. **Render:** `node <skill>/scripts/shoot.mjs --states --out .design-studio/final/rNN/shots final/<current>.html` takes desktop, mobile, focus-visible and any `data-state` variants.
2. **Measure** (run `a11y-auditor` with the HTML path and script paths, or run the scripts directly):
   - `node <skill>/scripts/axe.mjs final/<current>.html --out .design-studio/evals/rNN-axe.json` gives axe violations, contrast and touch targets.
   - `node <skill>/scripts/slop-check.mjs final/<current>.html --json > .design-studio/evals/rNN-slop.json`
3. **Critique, in parallel:** `critic-sonnet`, `critic-haiku` and `critic-fable`. Each gets **only**:
   - the absolute screenshot paths
   - the absolute path of `<skill>/references/rubric.md`
   - one neutral line: "This is a [component type] for [one-line generic purpose, e.g. 'booking a clinic appointment on mobile']."
   Never pass the brief, the code, previous scores, or who made it.
4. **Score:**
   - Parse each critic's JSON block. Take the **median per dimension**.
   - If any dimension's critic spread is more than 1.0, run one more critic (`critic-sonnet` again, fresh) and re-take the median.
   - Apply the measured caps from `rubric.md` (e.g. any serious axe violation caps accessibility at 7.0).
   - Compute the weighted score. Save everything to `evals/rNN.json`: raw per critic, median, caps applied, weighted score.
5. **Log** the round in `ROUNDS.md`, with measured and eyeballed numbers labelled separately.
6. **Report to the user** in a few lines: the score table, the weighted score, what changed, and the next focus. Then keep going without waiting, unless the user interrupts.
7. **Fix:** focus first on open user feedback, then failing measured checks, then the dimension with the largest weighted gap to 9.2. Apply the critics' top fixes for that focus. Use the installed `design:accessibility-review` and `design:design-critique` skill guidance where helpful. Save the result as `final/vNN.html`. Run the slop check again. If a round lowers the weighted score, revert to the best version and try a different fix, and log why.
8. **Stop check:** if the bar is met, finish. If not, start the next round.

## Honesty and cost guard

- After **8 rounds** without reaching the bar, stop the automatic loop and tell the user the current score, the blocking dimensions, and what would likely be needed (for example "familiarity is held back by the unconventional nav; fixing it means changing the direction"). Ask whether to continue, change direction, or accept. Never lower the bar silently.
- Self-scores may be logged as "own", but they never count.
- Calibration: if the user says the scores feel too high or too low, record the offset in ROUNDS.md and apply it from then on.

When the bar is met: show the final score table, before-and-after shots, and the path to the final file. Then run the section gate.
