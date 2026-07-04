# AgentDraw

[中文 README](./README.zh.md)

AgentDraw is a local-first, editable whiteboard workspace for coding agents.

It lets Claude Code, Codex, Cursor, or any other agent generate a structured `.agentdraw.json`
scene, open it in a browser-based whiteboard editor, let a human refine it manually, and export the
result as JSON, SVG, or PNG.

The first canvas provider is Excalidraw. AgentDraw keeps the storage format, style system, local
server, and validation logic separate from the canvas implementation, so other providers can be
added later without replacing the whole app.

Powered by [Excalidraw](https://github.com/excalidraw/excalidraw).

## Gallery

AgentDraw examples are real editable scene files. The images below are generated previews for the
README; click a preview to open the source `.agentdraw.json`.

### Complex Board

<a href="./examples/complex-agentdraw-workbench.agentdraw.json">
  <img src="./assets/examples/complex-agentdraw-workbench.svg" alt="Complex AgentDraw Workbench preview" />
</a>

### Theme Examples

<table>
<tr>
<td width="50%"><a href="./examples/theme-agentdraw-os.agentdraw.json"><img src="./assets/examples/theme-agentdraw-os.svg" alt="AgentDraw Operating System preview" /></a><br />
<sub><a href="./examples/theme-agentdraw-os.agentdraw.json"><b>AgentDraw OS</b></a> · local agent diagram loop</sub>
</td>
<td width="50%"><a href="./examples/theme-incident-command.agentdraw.json"><img src="./assets/examples/theme-incident-command.svg" alt="Incident Command Center preview" /></a><br />
<sub><a href="./examples/theme-incident-command.agentdraw.json"><b>Incident Command</b></a> · severity and recovery map</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-message-bus.agentdraw.json"><img src="./assets/examples/theme-message-bus.svg" alt="Multi-Agent Message Bus preview" /></a><br />
<sub><a href="./examples/theme-message-bus.agentdraw.json"><b>Message Bus</b></a> · multi-agent coordination</sub>
</td>
<td width="50%"><a href="./examples/theme-launch-room.agentdraw.json"><img src="./assets/examples/theme-launch-room.svg" alt="Launch Room Loop preview" /></a><br />
<sub><a href="./examples/theme-launch-room.agentdraw.json"><b>Launch Room</b></a> · editorial growth loop</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-strategy-grove.agentdraw.json"><img src="./assets/examples/theme-strategy-grove.svg" alt="Quarterly Strategy Map preview" /></a><br />
<sub><a href="./examples/theme-strategy-grove.agentdraw.json"><b>Strategy Grove</b></a> · quarterly operating map</sub>
</td>
<td width="50%"><a href="./examples/theme-roadmap-mint.agentdraw.json"><img src="./assets/examples/theme-roadmap-mint.svg" alt="Creator Tool Roadmap preview" /></a><br />
<sub><a href="./examples/theme-roadmap-mint.agentdraw.json"><b>Roadmap Mint</b></a> · playful product roadmap</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-customer-journey.agentdraw.json"><img src="./assets/examples/theme-customer-journey.svg" alt="Customer Journey Signals preview" /></a><br />
<sub><a href="./examples/theme-customer-journey.agentdraw.json"><b>Customer Journey</b></a> · activation signal map</sub>
</td>
<td width="50%"><a href="./examples/theme-research-synthesis.agentdraw.json"><img src="./assets/examples/theme-research-synthesis.svg" alt="Research Synthesis Wall preview" /></a><br />
<sub><a href="./examples/theme-research-synthesis.agentdraw.json"><b>Research Synthesis</b></a> · interview clustering board</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-raw-grid.agentdraw.json"><img src="./assets/examples/theme-raw-grid.svg" alt="Scene Quality Matrix preview" /></a><br />
<sub><a href="./examples/theme-raw-grid.agentdraw.json"><b>Raw Grid</b></a> · strict validation matrix</sub>
</td>
<td width="50%"><a href="./examples/theme-bold-poster.agentdraw.json"><img src="./assets/examples/theme-bold-poster.svg" alt="Design Systems Win preview" /></a><br />
<sub><a href="./examples/theme-bold-poster.agentdraw.json"><b>Bold Poster</b></a> · high-impact design thesis</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/theme-soft-editorial.agentdraw.json"><img src="./assets/examples/theme-soft-editorial.svg" alt="Product Discovery Board preview" /></a><br />
<sub><a href="./examples/theme-soft-editorial.agentdraw.json"><b>Soft Editorial</b></a> · research and discovery board</sub>
</td>
<td width="50%"><a href="./examples/theme-block-frame.agentdraw.json"><img src="./assets/examples/theme-block-frame.svg" alt="Maker Mode Map preview" /></a><br />
<sub><a href="./examples/theme-block-frame.agentdraw.json"><b>BlockFrame</b></a> · playful maker workflow</sub>
</td>
</tr>
</table>

## Why

Agent-generated diagrams often fail in predictable ways: text overlaps, labels are not centered,
arrows miss their targets, or a complex scene opens under the toolbar. AgentDraw treats those as
engineering problems:

- diagrams are stored as editable structured JSON, not screenshots;
- styles are reusable presets rather than one-off colors;
- scenes can be validated before opening;
- humans can still edit the final board directly in the browser.

## Features

- Local `.agentdraw.json` scene files.
- Excalidraw-based editable canvas.
- 38 bundled styles, including formal diagram styles and palettes adapted from
  `beautiful-feishu-whiteboard`.
- CLI for opening and validating scenes.
- Local HTTP API for loading and saving the current board.
- Export to JSON, SVG, and PNG.
- Scene validation for text overlap, shape overlap, vertical centering, connector endpoints, and
  connectors crossing text.

## Quick Start

Run directly from npm:

```bash
npx @chg80333/agentdraw open board.agentdraw.json
```

Or use the repo:

```bash
pnpm install
pnpm build
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json
```

Open the printed URL in a browser. By default the local server uses:

```text
http://127.0.0.1:3927
```

For WSL or remote usage, run the server on the machine that has a browser:

```bash
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json --no-open
```

## CLI

Open a board:

```bash
pnpm agentdraw open examples/getting-started.agentdraw.json
```

Open without launching the system browser:

```bash
pnpm agentdraw open examples/getting-started.agentdraw.json --no-open
```

Boards replay their final scene by default when opened, so users can watch the diagram being drawn.
Disable the replay with any of these URL flags:

```text
?animate=0
?replay=0
?instant=1
```

Validate a generated scene:

```bash
pnpm validate:scene examples/complex-agentdraw-workbench.agentdraw.json
```

The validator returns a non-zero exit code for layout errors. Warnings are printed but do not fail
the command. A typical agent loop should be:

```text
generate scene -> validate scene -> repair reported element ids -> open board
```

## Example Sources

The gallery images are generated from these editable source files:

- [`examples/getting-started.agentdraw.json`](./examples/getting-started.agentdraw.json)
- [`examples/complex-agentdraw-workbench.agentdraw.json`](./examples/complex-agentdraw-workbench.agentdraw.json)
- [`examples/theme-agentdraw-os.agentdraw.json`](./examples/theme-agentdraw-os.agentdraw.json)
- [`examples/theme-incident-command.agentdraw.json`](./examples/theme-incident-command.agentdraw.json)
- [`examples/theme-message-bus.agentdraw.json`](./examples/theme-message-bus.agentdraw.json)
- [`examples/theme-launch-room.agentdraw.json`](./examples/theme-launch-room.agentdraw.json)
- [`examples/theme-strategy-grove.agentdraw.json`](./examples/theme-strategy-grove.agentdraw.json)
- [`examples/theme-roadmap-mint.agentdraw.json`](./examples/theme-roadmap-mint.agentdraw.json)
- [`examples/theme-customer-journey.agentdraw.json`](./examples/theme-customer-journey.agentdraw.json)
- [`examples/theme-research-synthesis.agentdraw.json`](./examples/theme-research-synthesis.agentdraw.json)
- [`examples/theme-raw-grid.agentdraw.json`](./examples/theme-raw-grid.agentdraw.json)
- [`examples/theme-bold-poster.agentdraw.json`](./examples/theme-bold-poster.agentdraw.json)
- [`examples/theme-soft-editorial.agentdraw.json`](./examples/theme-soft-editorial.agentdraw.json)
- [`examples/theme-block-frame.agentdraw.json`](./examples/theme-block-frame.agentdraw.json)

Regenerate the theme examples:

```bash
node scripts/generate-theme-examples.mjs
```

Regenerate the README preview images:

```bash
pnpm examples:previews
```

## Scene Format

An AgentDraw scene is a JSON envelope around provider-specific scene data:

```json
{
  "type": "agentdraw/scene",
  "version": 1,
  "title": "System map",
  "styleId": "system-formal",
  "providerId": "excalidraw",
  "elements": [],
  "appState": {},
  "files": {}
}
```

Agents usually generate or patch:

- `styleId`
- `providerId`
- `elements`
- `appState`
- `files`

The browser editor auto-saves manual edits back into the same file.

## Styles

Use a style id in the scene file, or switch styles from the toolbar. The default is:

```text
system-formal
```

Styles are intended to become design systems, not simple palette swaps. See
[`docs/STYLE_SYSTEM.md`](./docs/STYLE_SYSTEM.md) for the target architecture and
`packages/styles/designs/*/design.md` for agent-readable style rules.

Formal styles:

- `system-formal`
- `boardroom`
- `blueprint-formal`

Additional palette presets are grouped as:

- restrained: `avocado-press`, `grove`, `jade-lens`, `long-table`, `macchiato`, `monochrome`,
  `papier-bleu`, `reading-room`, `salmon-stamp`
- balanced: `apricot-arc`, `berry-pop`, `bold-poster`, `checker-bloom`, `cobalt-bloom`, `coral`,
  `cut-bloom`, `editorial-forest`, `lime-slab`, `linen-cut`, `pin-and-paper`, `raw-grid`,
  `riptide-cobalt`, `soft-editorial`, `violet-marker`
- bold: `block-frame`, `burst-panel`, `confetti-wedge`, `court-press`, `crayon-stack`,
  `grove-block`, `mint-brut`, `neo-grid-bold`, `riso-brut`, `specimen-bold`, `stencil-tablet`

High-formality styles render with square geometry, zero roughness, sans text, and elbow-style
defaults. Low-formality styles keep a more hand-drawn Excalidraw feel.

## Validation

The scene validator is intentionally lightweight. It catches common generated-board mistakes before
the browser opens:

- text bounding boxes overlapping;
- non-contained shape overlaps;
- text groups that are visibly off-center inside short containers;
- connector endpoints that are far from the nearest shape;
- connectors that cross text bounding boxes.

It is not a full visual renderer. For critical diagrams, use it as a first pass, then inspect the
board in the browser.

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Agent Skill

Agents should start from [`SKILL.md`](./SKILL.md), use [`CATALOG.md`](./CATALOG.md) to choose a
design system, then read the selected `packages/styles/designs/<style-id>/design.md` before
generating a scene.

Run the web app and API in development mode:

```bash
pnpm dev
```

Project layout:

```text
apps/web/          browser editor
packages/cli/      agentdraw command
packages/server/   local HTTP server
packages/scene/    scene IO and validation
packages/styles/   style catalog and render profiles
examples/          sample scenes
scripts/           repo utility scripts
```

## Repository

```bash
git remote add origin git@github.com:chenhg5/agentdraw.git
```

## License

[MIT](./LICENSE)

AgentDraw is powered by [Excalidraw](https://github.com/excalidraw/excalidraw).
