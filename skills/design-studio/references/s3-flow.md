# Section 3: Main-flow critique

Goal: critique the **logic** of the user's main flow and journey. Not visuals. Do not comment on colour, type, style or polish, even when the screens show them.

## Intake

Ask the user to share the main user flow or journey and the key screens, in any form: images (drop them in chat or give paths), a Figma export, a written step list, a Mermaid or FigJam diagram, or a link. Copy files into `.design-studio/flow/`. If the flow is only in words, write it out as numbered steps and confirm it.

## Run `flow-critic`

Give it: the absolute paths of `brief.md`, `research.md` and every file in `flow/`. It writes `.design-studio/flow/flow-critique.md` with:

1. **The flow as understood:** numbered steps and a Mermaid flowchart, including decision points.
2. **Task walkthrough per user type** from the brief (cognitive walkthrough: will they know what to do, see how to do it, understand the feedback, and know they progressed?).
3. **Findings**, each with severity (Blocker, Major, Minor), the step, the problem, why it matters for the user or business goal, and the fix. It checks:
   - step count and wasted steps for the top use cases
   - dead ends, loops without exits, missing back and undo
   - error, empty, offline and permission paths, and the edge cases from the brief
   - decision overload (Hick's law), memory load across steps, interruptions and resuming
   - entry points and exit points, onboarding versus returning use
   - whether each design objective and success metric is supported by a step in the flow
   - the flow-level Nielsen heuristics (visibility of status, user control, error prevention and recovery, recognition over recall)
4. **Suggested revised flow** as a Mermaid flowchart, with what changed and why.
5. **Questions for the designer:** decisions only they can make.

## Present

Show the top findings (Blockers and Majors), the revised flow (as a Mermaid code block), and the path to the full critique. Then run the section gate. A new or revised flow from the user restarts this critique with a diff against the previous one ("fixed / still open / new").
