# Section 1: Problem definition

Goal: just enough understanding to ground every later step. Short and sharp, not exhaustive.

## How to ask

- **One question per AskUserQuestion call, single-select** (see SKILL.md). Options: 1 or 2 suggested answers inferred from what the user said (real answers, not categories), then "Skip for now". "Other" takes free text.
- Before asking, drop any question the opening message, attachments or project files already answer. List those answers back in one line.
- Drill down at most **twice in the whole interview**, only on an answer that is vague or contradicts another.
- Platform is web desktop unless stated. Don't ask.

## Core questions (ask only what's still unknown)

1. What is the goal of the design, and what triggers this work?
2. Who are the users (types), and what is their main pain point?
3. What are the top 1 to 3 tasks they must complete?
4. What does success look like? (Push for something measurable.)
5. Hard constraints: deadline, design system, tech, brand?
6. Edge cases that matter (empty, error, first use, accessibility)?
7. What exists today (competitors, current version, workarounds)?
8. Who signs off, and what do they care about most?

Everything else (time on market, budget, stakeholders' detail) is skipped unless the user raises it.

## Save

Fill `templates/brief.md` into `.design-studio/brief.md`. User's words as given; mark guesses `(inferred)`; `skipped` where skipped. **Cap: 250 words.**

Show the Synthesis in chat (≤ 8 lines): problem statement, 1 or 2 "How might we", 3 testable objectives, success metrics, riskiest assumption.

Then run the section gate. "More here" means: ask skipped questions or test the riskiest assumption.
