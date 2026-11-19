# No AI slop

"Slop" is the generic look of AI-generated UI: it reads as made by a model, not for a product. It is banned in every visual this plugin produces, unless the user explicitly asks for one of these items.

## Automated checks: `scripts/slop-check.mjs <files|dir> [--json]`

It runs three detectors and merges their output:
1. **Impeccable** (`npx -y impeccable detect --json`): 60+ deterministic rules, including purple and violet gradients, gradient text, side-tab accent borders, cyan-on-dark, glowing dark mode, overused fonts (Inter, Roboto as the only face), flat type hierarchy, nested cards, everything centred, monotonous spacing, bounce or elastic easing, layout-property transitions, tiny body text, cramped padding, long lines, small targets, and WCAG contrast failures.
2. **taste copy-lint** (if tasteskill is installed): model-written copy tells.
3. **Ban-list scan** (built in): the cook and taste ban list below, where it can be detected in code.

Exit code 0 means clean; 2 means findings. Fix every finding, or justify an advisory in an HTML comment at the top of the file.

## Ban list (from cook's rules and tasteskill, extended)

**Visual**
- Purple or violet gradients; purple as a default accent; blue-to-purple hero washes
- Gradient text on headings
- Glowing orbs, blurred colour blobs, aurora backgrounds, decorative particles
- Glassmorphism as decoration
- Shockwave rings or pulses popping out of things for no reason
- Long thin decorative lines and dividers that carry no structure
- Eyebrow labels (small uppercase kicker above every heading)
- Monospace uppercase text used as decoration
- A random serif font with no reason
- Beige-on-beige "premium" palettes with no contrast
- 01 / 02 / 03 counters on sections or features
- Three identical feature cards with an icon, title and two lines
- Emoji as icons; generic line icons in tinted circles
- Side-border accent cards; a left coloured stripe on every card
- Everything centred; uniform spacing everywhere; nested cards
- Drop shadows on everything; a large radius on everything

**Motion**
- Bounce or elastic easing; things floating up for no reason; `transition: all`
- Fade-in on every element on scroll

**Copy**
- "Elevate", "unlock", "seamless", "supercharge", "revolutionize", "empower", "effortless", "game-changer", "in today's fast-paced world"
- Em dashes in UI copy
- Headings in the "X. Y. Z." triplet form, or "Not just X, it's Y"
- Lorem ipsum; fake round-number stats ("10x faster", "99.9%") that the brief does not support
- Generic CTAs ("Get started" on every button) when a specific verb fits

## What to do instead

- Take colour, type and layout from the **approved references** and `styleguide.md` tokens, not from defaults.
- Use real content from the brief. Specific beats generic.
- Give one moment of character per screen that is tied to the product's subject, and keep the rest quiet.
- Choose type deliberately: a pairing with a reason, a clear scale, and real hierarchy.

## Slop critic (visual review of screenshots)

The `slop-critic` agent marks each image **Clean**, **Borderline** or **Slop**. For each item it names the exact tell and the region, and says what would fix it. Anything marked Slop is rebuilt before the user sees it.
