# Section 6: Evaluation to 9.2/10

Goal: score the final design with zero-context critics plus measured checks, and improve it until it reaches the bar.

## Input

The user uploads the final design (HTML, images or a link), or confirms `final/v-final.html`. Copy it into `.design-studio/final/`. Image-only designs can be scored but not auto-fixed: say so, and offer to rebuild as HTML or return fixes as recommendations.

## Bar (write it in ROUNDS.md)

All true:
- Weighted median ≥ **9.2** (weights in `rubric.md`), no dimension below **8.5**.
- axe: zero critical or serious, AA contrast, targets ≥ 24 px (≥ 44 px if `platform` includes mobile). Measured.
- `slop-check.mjs` exits 0.

## Each round

1. **Render:** `node <skill>/scripts/shoot.mjs --states --out .design-studio/final/rNN/shots final/<current>.html` (desktop + focus + states; add `--mobile` only if `platform` includes mobile).
2. **Measure** directly in the main thread (no agent needed):
   - `node <skill>/scripts/axe.mjs final/<current>.html --out .design-studio/evals/rNN-axe.json`
   - `node <skill>/scripts/slop-check.mjs final/<current>.html --json > .design-studio/evals/rNN-slop.json`
   Fix measured failures **before** spending critics on the round.
3. **Critique, in parallel:** `critic-haiku` + `critic-sonnet`. Each gets only: absolute screenshot paths (desktop + focus; state shots only if the rubric's feedback_states is the focus), the rubric path, and one neutral line: "This is a [component type] for [generic purpose] on desktop web."
4. **Score:** median per dimension of the critics. Run a third critic (fresh `critic-sonnet`) only if a dimension spreads by more than 1.5. Apply the measured caps from `rubric.md`. Save to `evals/rNN.json`: raw, median, caps, weighted.
5. **Confirm:** when the two-critic score meets the bar, run `critic-fable` once on the same shots. Final score = median of all three. If it falls below the bar, continue the loop.
6. **Log** the round in `ROUNDS.md` (≤ 6 lines + score row).
7. **Report** in ≤ 4 lines: weighted score, lowest dimensions, what changed, next focus. Keep going unless the user interrupts.
8. **Fix:** open user feedback first, then failing checks, then the largest weighted gap. Apply the critics' top 2 or 3 fixes with Edit in the main thread (spawn `variant-builder` only for structural changes). Save as `final/vNN.html`, re-run slop-check. If a round lowers the score, revert to the best version and try another fix.

## Cost guard

- After **4 rounds** without reaching the bar, stop and tell the user: score, blocking dimensions, what would likely fix it. Ask: continue, change direction, or accept. Never lower the bar silently.
- Self-scores never count.
- If the user says scores feel off, record the offset in ROUNDS.md and apply it.

When the bar is met: show the score table, before/after desktop shots and the final path. Section gate.
