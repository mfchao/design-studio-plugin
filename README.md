# design-studio

A Claude Code plugin that walks you through a full design process in seven sections. You can loop on any section, or jump between them, at any time.

| # | Section | What happens |
|---|---|---|
| 1 | Problem definition | A grill-style interview (Enter skips a question). Saved to `.design-studio/brief.md` |
| 2 | Research | Theory and benchmarking subagents (web + Inspo + Awwwards), merged into a report |
| 3 | Flow critique | A critique of logic only, with a revised Mermaid flow |
| 4 | Style and references | A tone read, more refs from Inspo/Awwwards/tasteskill, a moodboard, your approval, then a style guide |
| 5 | Design | 10 grounded HTML variations, anti-slop gated, then iteration rounds |
| 6 | Evaluation | Sonnet, Haiku and Fable critics with zero context, plus axe and slop checks, looped until ≥ 9.2/10 |
| 7 | Report | A storytelling case-study HTML report with diagrams, published as a private artifact |

## Install

**1. Browser tooling** (for screenshots and accessibility checks). No sudo needed:
```bash
npm install --prefix ~/.design-studio/tools agent-browser
~/.design-studio/tools/node_modules/.bin/agent-browser install
```
(If `agent-browser` is already on your PATH, that works too.)

**2. The plugin**, using any one of these:
```bash
# from your shell
claude plugin marketplace add mfchao/design-studio-plugin
claude plugin install design-studio@mfchao-design-studio
```
```
# inside a Claude Code terminal session
/plugin install design-studio --marketplace mfchao/design-studio-plugin
```
```bash
# without the plugin commands (e.g. VS Code): clone it into your skills folder
git clone https://github.com/mfchao/design-studio-plugin ~/.claude/plugins-src/design-studio
ln -s ~/.claude/plugins-src/design-studio ~/.claude/skills/design-studio
```
Restart Claude Code, then run `/design-studio:doctor`.

The Inspo (hosted) and Awwwards (`npx awwwards-mcp`) MCP servers come with the plugin in `.mcp.json`. Neither needs an API key. For Awwwards motion capture, optionally run `npm i -g playwright && npx playwright install chromium`.

Optional companions, picked up automatically if installed: **cook** (`~/.agents/skills/cook`) and **tasteskill** (`~/.agents/skills/design-taste-frontend`, which enables copy-lint and the palette and type library).

## Use

```
/design-studio:start a mobile onboarding flow for a habit tracker
/design-studio:goto 4          # jump to a section
/design-studio:doctor          # check dependencies
```
You can also say "start a design studio project". All state lives in `.design-studio/` in your project folder, so you can stop and resume in a later session.

## Scripts (`skills/design-studio/scripts/`)

- `slop-check.mjs <files|dir> [--json]`: Impeccable, taste copy-lint and the built-in ban list. Exit 2 means there are findings.
- `shoot.mjs --out dir [--states] <html...>`: desktop and mobile screenshots, plus focus and `data-states` shots.
- `contact-sheet.mjs --out path [--labels] <images...>`: a grid as HTML and PNG.
- `axe.mjs <html> --out x.json`: axe-core WCAG 2.2 AA, contrast, and touch targets under 44 px.
- `doctor.mjs`: checks dependencies.

## Credits

The loop, ledger and critic design are adapted from [cook](https://github.com/Leonxlnx/cook) (MIT). Anti-slop rules draw on [tasteskill](https://www.tasteskill.dev/) and [Impeccable](https://impeccable.style) (Apache-2.0). References come from [Inspo MCP](https://inspomcp.dev) (MIT) and [Awwwards MCP](https://www.paralect.com/mcp/awwwards) (MIT, community). The browser is [agent-browser](https://agent-browser.dev). The interview style follows [grill-me](https://github.com/mattpocock/skills) (MIT).

## Privacy

The plugin itself collects nothing and sends no telemetry. Everything it records stays in `.design-studio/` in your project. It calls these third-party services only while it runs:
- **Inspo MCP** (`https://inspomcp.dev/api/mcp`, hosted by its maintainers): receives the short, generic style and search queries the agents send. Don't put confidential project names in briefs you want kept private; the agents are told to generalise them.
- **Awwwards MCP** runs locally through `npx`, and fetches public Awwwards pages.
- **axe-core** is loaded from cdnjs into the local page under test.
- **Web search** goes through Claude Code's own search tool.
- A report is published to claude.ai only in Section 7, as a private artifact that you choose whether to share.
