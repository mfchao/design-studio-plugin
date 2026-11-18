# Section 1: Problem definition

Goal: understand the project well enough that every later step is grounded. Interview like grill-me: relentless but kind. Ask one topic at a time, and drill into answers that are vague, contradictory or assumed.

## How to ask

- Use AskUserQuestion, **up to 4 questions per call**, grouped by topic.
- Each question gets these options, in this order:
  1. **"Skip"** (first, so pressing Enter skips it). Description: "Leave blank for now; you can add it later."
  2. One or two **suggested answers** inferred from what the user already said, written as real answers, not categories. If nothing can be inferred, give one common answer for this kind of project.
  - Free text always works through "Other". Say once, at the start: "Enter skips a question; pick Other to type your own answer."
- Before asking, skip any question the user's opening message or attachments already answered. Write those answers into the brief directly and list them back in one line.
- **Drill-down:** after each call, if an answer is vague ("make it better", "everyone"), contradicts an earlier answer, or hides an assumption, ask one sharp follow-up about it before moving on. At most one follow-up per answer, so the interview never stalls.
- If a question can be answered from files in the project (a README, an existing design, previous iterations), read them instead of asking, and say what you found.

## Block A: the challenge

1. What is the goal of the design?
2. What are the details and context (product, where it sits, what triggers this work)?
3. What are the timeline, devices and other constraints?
4. Which edge cases should it handle (empty, error, offline, extreme data, first use, accessibility needs)?
5. What are the business needs? Are there specific goals the company wants to prioritize?
6. Who are the stakeholders, and who signs off?

## Block B: users and context

7. What are the different types of users, and what are their pain points and goals?
8. What do we assume about their behaviour and problems?
9. What are the most common use cases?
10. What benefits should the design give them?
11. What are the design objectives? (Offer 3 draft objectives built from the answers so far as suggestions.)
12. Benchmarking: what already exists today (competitors, internal tools, workarounds)?
13. What would the company or client call success? (Push for something measurable.)
14. Are there preferences for the form of the solution (digital or physical, platform)?
15. How long is the product planned to be on the market?
16. What is the timeline for development and shipping, and are there deadlines?
17. Are there previous design iterations to keep in mind? (Ask for files or links.)
18. Are there budget or resource limits?
19. Are there limits on the tools or technologies used (design system, framework, platform)?

## Save

Fill `templates/brief.md` into `.design-studio/brief.md`. Every question has a line, with `skipped` where the user skipped it. Keep the user's words, and mark anything you inferred as `(inferred)`.

Then write the **Synthesis** part of the brief and show it in chat (one screen at most):
- Problem statement (one sentence)
- 1 to 3 "How might we" questions
- Design objectives (3 to 5, each testable)
- Success metrics (what will be measured, with a target where possible)
- Open questions and risky assumptions (from the skips and drill-downs)

Then run the section gate. "More follow-ups here" means: ask the skipped questions again, or dig into the riskiest assumption.
