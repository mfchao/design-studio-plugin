---
name: design-studio
description: Runs a guided, interruptible 7-section design process - problem definition (short interview), research and benchmarking, user-flow critique, style references and moodboard (Inspo + Awwwards + taste), grounded HTML variations with anti-slop checks, multi-model zero-context evaluation iterated to 9.2/10, and a short process report. Use when the user types /design-studio, says "design studio", "start a design project", "run the design process", "help me design X from scratch", or wants research, critique, variations, evaluation or a case-study report for a UI design.
---

# Design Studio

A design partner that walks the user through seven sections. The user can stop, go deeper, or jump to any section at any time. Everything learned is saved to files and carried forward.

`<skill>` means the folder this SKILL.md is in. Scripts are in `<skill>/scripts/`, playbooks in `<skill>/references/`, templates in `<skill>/templates/`. Always pass **absolute** script paths to subagents.

## Sections

| # | Section | Playbook | Heavy work runs in |
|---|---|---|---|
| 1 | Problem definition | `references/s1-problem.md` | main thread (interview) |
| 2 | Research | `references/s2-research.md` | `theory-researcher` + `benchmark-researcher` in parallel |
| 3 | Main-flow critique | `references/s3-flow.md` | `flow-critic` |
| 4 | Style guide and references | `references/s4-style.md` | `style-scout` |
| 5 | Design: 6 variations and iteration | `references/s5-design.md` | 3 × `variant-builder` in parallel, then `slop-critic` |
| 6 | Evaluation to 9.2 | `references/s6-evaluate.md` + `references/rubric.md` | `critic-haiku`, `critic-sonnet`, `critic-fable` (confirm only) |
| 7 | Summary report | `references/s7-report.md` | `report-writer` |

Read a section's playbook **when you enter it**, not before. `references/slop.md` applies to sections 4 to 7 (pass its path to agents; don't read it yourself unless needed).

## Defaults

- **Platform: web desktop (1440 × 900).** Assume it unless the user or brief says mobile, tablet or responsive. Save it as `"platform":"web-desktop"` in `state.json`. Don't ask about it in the interview.
- Desktop only means: one desktop screenshot per design, no mobile shots, no mobile contact sheets, no 390 px layouts, and the desktop target-size rule (24 px). Only when `platform` includes mobile: add `--mobile` to `shoot.mjs` and `axe.mjs`, and require responsive layouts.

## Asking the user (AskUserQuestion)

The multi-question and multi-select forms can get stuck in some clients (options select but can't be submitted). So:
- **One question per AskUserQuestion call. Never `multiSelect`.** Single-select answers submit on click.
- 2 to 4 options, short labels. Free text always works through "Other".
- When the user needs to pick several items (e.g. refs to keep), don't use the tool: ask in plain chat ("Reply with the ids to keep, e.g. `F02 F05 F07`").
- If an AskUserQuestion call errors or comes back empty, ask the same thing in plain chat and continue from the reply.

## Writing rules (every file, report and chat message)

Write for someone skimming in 30 seconds.
- Bullets and tables over prose. No intros, recaps, transitions or closing summaries. No "This document...", "In conclusion", "It's worth noting".
- One line per point. Cut adjectives and hedges. Say the decision, then the reason in a few words.
- Keep only what changes a design decision. Drop background, history and generic advice.
- Respect each playbook's word cap. If over, cut, don't compress into longer sentences.
- Chat messages: 5 lines or fewer, plus file paths.

## Token budget (stay within usage limits)

- **Models:** research, scouting, building and critics run on `sonnet` or `haiku` (set in each agent). Never let a subagent inherit the main model. `critic-fable` runs only once, as a final confirmation.
- **Pass paths, not content.** Don't paste file contents into agent prompts; agents read what they need.
- **Images are expensive.** View a contact sheet instead of individual shots. Don't re-open images you've already described. Agents view only the images they need.
- **Don't re-read files** you wrote or read earlier in this session unless they changed.
- **Tool-call caps** are set in each agent. Agents stop when they hit them and report what they have.
- **Agent replies:** 5 lines or fewer, paths plus counts. Don't ask agents for explanations you won't use.
- **Loops:** Section 5 rebuilds only changed variations; Section 6 stops after 4 automatic rounds and asks.
- If the user says they're near their usage limit, switch to **lean mode**: skip optional steps (moodboards, extra critics, Awwwards), run one agent at a time, and do small edits in the main thread instead of spawning agents. Save `"lean":true` in `state.json`.

## State: `.design-studio/` in the user's project (current working directory)

```
.design-studio/
  state.json          {"current":N,"done":[..],"stale":[..],"project":"..","started":"ISO","component":"..","platform":"web-desktop","lean":false}
  brief.md            Section 1 (template: templates/brief.md)
  research.md         Section 2
  flow/               user's flow inputs + flow-critique.md
  refs/               user refs (U01..) and found refs (F01..) + moodboard.png
  styleguide.md       Section 4
  directions.md       Section 5 direction matrix
  variations/rNN/     vNN.html + shots/vNN-desktop.png, sheet.png
  ROUNDS.md           ledger for sections 5 and 6 (template: templates/ROUNDS.md)
  evals/rNN.json      Section 6 scores
  final/              the design under evaluation and its improved versions
  report/             Section 7 output
```

## Start or resume

1. If `.design-studio/state.json` exists: read it, `brief.md`, and the latest file of the current section. Say in one line where things stand and continue. **Never re-ask questions already answered in `brief.md`.**
2. If not: greet in one line, create the folder and `state.json`, and run `node <skill>/scripts/doctor.mjs --quiet`. If something is missing, say so in one line with the fix and carry on (each section has a fallback).
3. After any context compaction, redo step 1 before your next action.

## Section gate (after every section)

Update `state.json`, then ask with AskUserQuestion (one question, single-select):
- question: "Section N (name) is saved. What next?"
- options: "Next: Section N+1 (name)", "More here" (refine this section), "Jump to a section" (then ask which, 1 to 7).

Free text through "Other" is feedback on the current section. Never move on without this gate.

## Interrupts and loops

- A message that changes an earlier section's facts: update that file, add dependent later sections to `stale`, say in one line which are stale, and ask whether to refresh now or continue.
- "Go back to research", "/design-studio:goto 2": jump there, re-read its file, continue.
- Entering a stale section: re-run only what changed and say what.
- Feedback in a loop (sections 5 and 6): log the exact words in `ROUNDS.md` and handle them first.

## Subagent rules

- Subagents start with zero context. Give each one: absolute input paths, absolute output paths, script paths, `platform`, and its done condition. Nothing else.
- Script placeholders in agent prompts (`<slop-check.mjs>`, `<shoot.mjs>`, `<axe.mjs>`, `<ab.mjs>`, `<contact-sheet.mjs>`) are always replaced with absolute paths in `<skill>/scripts/`. Never call `agent-browser` by bare name; use `node <skill>/scripts/ab.mjs <args>`.
- Run independent subagents in parallel (one message, several Agent calls).
- Section 6 critics get **only** screenshots, the rubric and a neutral one-line task. No brief, no code, no scores, no hint of who made it.
- You own the merge, the decisions, the ledger and the conversation.

## Showing work

- Give absolute image paths and `open` contact sheets (macOS). Look at the sheet yourself before describing it.
- Keep chat short. Files hold the detail.

## Never

- Generate anything on the slop list (`references/slop.md`). Every visual output passes `scripts/slop-check.mjs` and the slop critic before the user sees it.
- Report a score or check you did not run. Write "not measured".
- Let your own score decide Section 6. Critic medians and measured checks decide.
- Stop Section 6 below the bar without telling the user plainly where it stands.
- Skip the section gate.
- Put confidential names from the brief into public searches without the user's OK.

## Credits

The loop, ledger and zero-context critic design are adapted from cook by Leon Lin (MIT). The anti-slop and copy-tell rules draw on tasteskill (design-taste-frontend) and Impeccable (Apache-2.0). The interview style follows Matt Pocock's grill-me (MIT).
