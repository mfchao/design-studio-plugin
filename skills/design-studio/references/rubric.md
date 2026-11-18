# Design evaluation rubric

You score a UI design from screenshots alone. Score each dimension from 0.0 to 10.0 in steps of 0.1. Be strict: 9 means a top product team would ship it unchanged, and most good work scores 7 to 8.

| Key | Dimension | Weight | What it covers |
|---|---|---|---|
| `ease_of_use` | Ease of use | 15% | Can a first-time user complete the main task without help? Is the next step obvious? |
| `accessibility` | Accessibility | 15% | Contrast, text size, target size, focus visibility, not relying on colour alone, readable at mobile size |
| `hierarchy` | Visual hierarchy and clarity | 12% | The eye lands on the most important thing first; grouping and scanning work |
| `familiarity` | Familiarity and learnability | 10% | Uses conventions users already know (Jakob's law); new patterns are self-explaining |
| `consistency` | Consistency | 10% | One system: spacing, type, colour roles, components and states behave the same everywhere |
| `efficiency` | Efficiency | 8% | Few steps and little reading for common tasks; sensible defaults; no unneeded choices |
| `feedback_states` | Feedback and states | 8% | Clear hover, focus, active, selected, loading, empty, error and success states |
| `copy` | Copy clarity | 7% | Labels and messages are specific, short, plain and human; no filler or marketing fluff |
| `aesthetic` | Aesthetic quality and fit | 8% | Crafted, coherent and appropriate for its users and purpose; polish of detail |
| `originality` | Originality / non-generic | 7% | Looks made for this product, not a template; no AI-generated clichés |

## Anchors (apply to every dimension)

- **10:** no improvement a top team would make
- **9:** excellent, with only nitpicks
- **8:** good, with one or two clear improvements
- **7:** acceptable, with several noticeable issues
- **5:** works, but with significant problems
- **3:** major problems block users
- **0 to 1:** broken or missing

## Measured caps (applied by the orchestrator, not the critic)

- Any axe violation that is critical or serious caps `accessibility` at **7.0**. Any text contrast below WCAG AA caps it at **7.5**. A touch target under 44 px on mobile caps it at **8.0**.
- Slop-check primary findings cap `originality` at **7.5**.
- When several caps apply, the lowest wins.

Weighted score = sum of (median score × weight).

## Output format (critics must end with exactly this JSON block)

```json
{
  "scores": {"ease_of_use": 0.0, "accessibility": 0.0, "hierarchy": 0.0, "familiarity": 0.0, "consistency": 0.0, "efficiency": 0.0, "feedback_states": 0.0, "copy": 0.0, "aesthetic": 0.0, "originality": 0.0},
  "top_fixes": [
    {"dimension": "hierarchy", "where": "region or element", "problem": "...", "fix": "..."}
  ],
  "weakest": "dimension key"
}
```

Give 3 to 6 `top_fixes`, the most impactful first.
