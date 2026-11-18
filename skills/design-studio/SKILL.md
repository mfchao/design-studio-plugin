---
name: design-studio
description: Runs a guided, interruptible 7-section design process - problem definition (grill-style interview), background research and benchmarking, user-flow critique, style references and moodboard (Inspo + Awwwards + taste), 10 grounded HTML variations with anti-slop checks, multi-model zero-context evaluation iterated to 9.2/10, and a storytelling process report. Use when the user types /design-studio, says "design studio", "start a design project", "run the design process", "help me design X from scratch", or wants research, critique, variations, evaluation or a case-study report for a UI design.
---

# Design Studio

A design partner that walks the user through seven sections. The user can stop, go deeper, or jump to any section at any time. Everything learned is saved to files and carried forward.

`<skill>` means the folder this SKILL.md is in (the base directory shown when the skill loads). Scripts are in `<skill>/scripts/`, section playbooks in `<skill>/references/`, templates in `<skill>/templates/`. Always pass **absolute** script paths to subagents.

## Sections

| # | Section | Playbook | Heavy work runs in |
|---|---|---|---|
| 1 | Problem definition | `references/s1-problem.md` | main thread (interview) |
| 2 | Research | `references/s2-research.md` | `theory-researcher` + `benchmark-researcher` in parallel |
| 3 | Main-flow critique | `references/s3-flow.md` | `flow-critic` |
| 4 | Style guide and references | `references/s4-style.md` | `style-scout` |
| 5 | Design: 10 variations and iteration | `references/s5-design.md` | 5 × `variant-builder` in parallel, then `slop-critic` |
| 6 | Evaluation to 9.2 | `references/s6-evaluate.md` + `references/rubric.md` | `a11y-auditor`, `critic-sonnet`, `critic-haiku`, `critic-fable` |
| 7 | Summary report | `references/s7-report.md` | `report-writer` |

Read the playbook for a section **when you enter it**, not before. `references/slop.md` applies to sections 4 to 7.

## State: `.design-studio/` in the user's project (current working directory)

```
.design-studio/
  state.json          {"current":N,"done":[..],"stale":[..],"project":"..","started":"ISO","component":".."}
  brief.md            Section 1 (template: templates/brief.md)
  research.md         Section 2
  flow/               user's flow inputs + flow-critique.md
  refs/               user refs (U01..) and found refs (F01..) + moodboard.png
  styleguide.md       Section 4 (approved refs, what to take, tokens)
  directions.md       Section 5 direction matrix
  variations/rNN/     vNN.html + shots/vNN-desktop.png, vNN-mobile.png, sheet.png
  ROUNDS.md           ledger for sections 5 and 6 (template: templates/ROUNDS.md)
  evals/rNN.json      Section 6 scores, raw + median + measured
  final/              the design under evaluation and its improved versions
  report/             Section 7 output
```

## Start or resume

1. If `.design-studio/state.json` exists: read it, `brief.md`, and the latest file of the current section. Then say in one or two lines where things stand and continue. **Never re-ask questions whose answers are already in `brief.md`.**
2. If it does not exist: greet in one line, say what the seven sections are in one line, create the folder and `state.json`, and run `node <skill>/scripts/doctor.mjs --quiet`. If it reports a missing piece, say so in one line with the fix and carry on (each section has a fallback).
3. After any context compaction, redo step 1 before your next action.

## Section gate (after every section)

When a section's output is saved and shown, update `state.json` and ask with AskUserQuestion:

- question: "Section N (name) is saved. What next?"
- options, in this order:
  1. "Next: Section N+1 (name)": one line on what it will do
  2. "More follow-ups here": go deeper, refine or add to this section
  3. "Jump to another section": then ask which section, 1 to 7

Free text through "Other" is treated as feedback on the current section. Never move on without this gate.

## Interrupts and loops

The user can interrupt at any point, in any words.
- A message that changes an earlier section's facts ("actually the users are nurses, not patients") means: update that section's file, add the later sections that depended on it to `stale` in `state.json`, tell the user in one line which sections are now stale, and ask whether to refresh them now or continue.
- "Go back to research", "/design-studio:goto 2" and the like: jump there, re-read its file, and continue that section's loop.
- When entering a stale section, re-run only what changed and say what was re-run.
- Feedback inside a loop (sections 5 and 6): log the exact words in `ROUNDS.md` and handle them before anything else.

## Subagent rules

- Subagents start with zero context. Give each one exactly what its playbook lists: absolute file paths to read, absolute paths to write, the script paths, and its done condition. Ask it to return only a short summary and the paths it wrote.
- Agent prompts write script paths as placeholders: `<slop-check.mjs>`, `<shoot.mjs>`, `<axe.mjs>`, `<ab.mjs>` (the agent-browser wrapper), and so on. Always replace each with its absolute path in `<skill>/scripts/`. Never call `agent-browser` by bare name: it may not be on PATH. Use `node <skill>/scripts/ab.mjs <args>`.
- Run independent subagents in parallel (one message, several Agent calls).
- Critics in Section 6 must get **only** screenshots, the rubric and a neutral one-line task. No brief, no code, no scores, no hint of who made it.
- You stay the owner: you merge, decide, keep the ledger and talk to the user.

## Showing work

- Images: give absolute paths, and open contact sheets with `open <path>` (macOS) so the user sees them. Read the PNGs yourself before describing them.
- Keep chat summaries short. The files hold the detail.

## Never

- Generate anything on the slop list (`references/slop.md`). Every visual output passes `scripts/slop-check.mjs` and a slop critic before the user sees it.
- Report a score or check you did not run. Write "not measured" instead.
- Let your own score decide Section 6. Critic medians and measured checks decide.
- Stop Section 6 below the bar without telling the user plainly where it stands.
- Skip the section gate.
- Put private details from the brief into public searches beyond what the research needs (no company-confidential names in web queries unless the user agrees).

## Credits

The loop, ledger and zero-context critic design are adapted from cook by Leon Lin (MIT). The anti-slop and copy-tell rules draw on tasteskill (design-taste-frontend) and Impeccable (Apache-2.0). The interview style follows Matt Pocock's grill-me (MIT).
