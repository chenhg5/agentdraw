# AgentDraw

[中文 README](./README.zh.md)

[![npm version](https://img.shields.io/npm/v/@aidraw/agentdraw?color=182230)](https://www.npmjs.com/package/@aidraw/agentdraw)
[![license: MIT](https://img.shields.io/badge/license-MIT-1F8A4C.svg)](./LICENSE)
[![SVG-first](https://img.shields.io/badge/SVG--first-editable%20boards-4053D6)](#svg-first-format)
[![local-first](https://img.shields.io/badge/local--first-browser%20editor-0B63CE)](#why-agentdraw)
[![powered by Excalidraw](https://img.shields.io/badge/powered%20by-Excalidraw-6965DB)](https://github.com/excalidraw/excalidraw)
[![agent ready](https://img.shields.io/badge/agent--ready-Codex%20%7C%20Claude%20Code%20%7C%20Cursor-1E1B16)](./skills/agentdraw/SKILL.md)

AgentDraw is a local-first, SVG-first editable whiteboard workspace for coding agents.

It lets Claude Code, Codex, Cursor, or any other agent draft a clean SVG diagram, convert it into an
editable `.agentdraw.json` whiteboard, open it in a browser editor, let a human refine it manually,
and export the result as JSON, SVG, or PNG.

The first canvas provider is Excalidraw. AgentDraw uses SVG as the agent-friendly source draft and
`.agentdraw.json` as the editable browser format.

Powered by [Excalidraw](https://github.com/excalidraw/excalidraw).

## Install

Recommended: ask your coding agent to install both the CLI and the skill.

```text
Install AgentDraw:
npm install -g @aidraw/agentdraw
npx skills add agentdraw/agentdraw --skill agentdraw -g -y
```

Agent bootstrap URL:

```text
https://raw.githubusercontent.com/agentdraw/agentdraw/main/INSTALL.md
```

For human CLI-only usage:

```bash
npm install -g @aidraw/agentdraw
agentdraw --help
agentdraw guide
```

No global install:

```bash
npx @aidraw/agentdraw@latest import-mermaid flow.mmd --out flow.agentdraw.json --style blueprint-formal --json
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --background --open
```

See [INSTALL.md](./INSTALL.md) for agent-specific install options.

## Gallery

AgentDraw examples are generated previews. Theme previews link to the `design.md` system that
produced the look.

### Complex Board

<a href="./examples/complex-agentdraw-workbench.agentdraw.json">
  <img src="./assets/examples/complex-agentdraw-workbench-en.svg" alt="Complex AgentDraw Workbench preview" />
</a>

### Layout Examples

These examples show communication layouts, not just color themes. Each image links to an editable
`.agentdraw.json` scene. The layout rules live in
[`editorial-layouts.md`](./skills/agentdraw/method/editorial-layouts.md).

<table>
<tr>
<td width="50%"><a href="./examples/layouts/01-monochrome-big-number.agentdraw.json"><img src="./assets/layouts/01-monochrome-big-number.svg" alt="Monochrome Big Number layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e01-monochrome-big-number"><b>E01 Monochrome Big Number</b></a> · three-stage editorial argument</sub>
</td>
<td width="50%"><a href="./examples/layouts/02-reading-room-overlap.agentdraw.json"><img src="./assets/layouts/02-reading-room-overlap.svg" alt="Reading Room Overlap layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e02-reading-room-overlap"><b>E02 Reading Room Overlap</b></a> · calm thesis with staggered panels</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/03-swiss-statement-grid.agentdraw.json"><img src="./assets/layouts/03-swiss-statement-grid.svg" alt="Swiss Statement Grid layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e03-swiss-statement-grid"><b>E03 Swiss Statement Grid</b></a> · executive claim plus evidence grid</sub>
</td>
<td width="50%"><a href="./examples/layouts/04-editorial-sidebar.agentdraw.json"><img src="./assets/layouts/04-editorial-sidebar.svg" alt="Editorial Sidebar layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e04-editorial-sidebar"><b>E04 Editorial Sidebar</b></a> · asymmetric article visual</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/05-poster-ledger.agentdraw.json"><img src="./assets/layouts/05-poster-ledger.svg" alt="Poster Ledger layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e05-poster-ledger"><b>E05 Poster Ledger</b></a> · punchy headline with ruled proof rows</sub>
</td>
<td width="50%"><a href="./examples/layouts/06-reading-room-index.agentdraw.json"><img src="./assets/layouts/06-reading-room-index.svg" alt="Reading Room Index layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e06-reading-room-index"><b>E06 Reading Room Index</b></a> · long-form synthesis with several anchors</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/07-strategic-quadrant.agentdraw.json"><img src="./assets/layouts/07-strategic-quadrant.svg" alt="Strategic Quadrant layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e07-strategic-quadrant"><b>E07 Strategic Quadrant</b></a> · SWOT and positioning analysis</sub>
</td>
<td width="50%"><a href="./examples/layouts/08-editorial-timeline.agentdraw.json"><img src="./assets/layouts/08-editorial-timeline.svg" alt="Editorial Timeline layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e08-editorial-timeline"><b>E08 Editorial Timeline</b></a> · time progression with one inflection point</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/09-roadmap-terrace.agentdraw.json"><img src="./assets/layouts/09-roadmap-terrace.svg" alt="Roadmap Terrace layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e09-roadmap-terrace"><b>E09 Roadmap Terrace</b></a> · phased roadmap and maturity ladder</sub>
</td>
<td width="50%"><a href="./examples/layouts/10-decision-scoreboard.agentdraw.json"><img src="./assets/layouts/10-decision-scoreboard.svg" alt="Decision Scoreboard layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e10-decision-scoreboard"><b>E10 Decision Scoreboard</b></a> · option comparison and recommendation</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./examples/layouts/11-ecosystem-orbit.agentdraw.json"><img src="./assets/layouts/11-ecosystem-orbit.svg" alt="Ecosystem Orbit layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e11-ecosystem-orbit"><b>E11 Ecosystem Orbit</b></a> · stakeholder and platform force maps</sub>
</td>
<td width="50%"><a href="./examples/layouts/12-pyramid-stack.agentdraw.json"><img src="./assets/layouts/12-pyramid-stack.svg" alt="Pyramid Stack layout preview" /></a><br />
<sub><a href="./skills/agentdraw/method/editorial-layouts.md#e12-pyramid-stack"><b>E12 Pyramid Stack</b></a> · hierarchy, maturity, and dependency levels</sub>
</td>
</tr>
</table>

### Theme Examples

<table>
<tr>
<td width="50%"><a href="./packages/styles/designs/system-formal/design.md"><img src="./assets/examples/theme-agentdraw-os.svg" alt="AgentDraw Operating System preview" /></a><br />
<sub><a href="./packages/styles/designs/system-formal/design.md"><b>System Formal</b></a> · precise architecture and workflow diagrams</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/boardroom/design.md"><img src="./assets/examples/theme-incident-command.svg" alt="Incident Command Center preview" /></a><br />
<sub><a href="./packages/styles/designs/boardroom/design.md"><b>Boardroom</b></a> · executive operating reviews and decisions</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/blueprint-formal/design.md"><img src="./assets/examples/theme-message-bus.svg" alt="Multi-Agent Message Bus preview" /></a><br />
<sub><a href="./packages/styles/designs/blueprint-formal/design.md"><b>Blueprint Formal</b></a> · technical systems and protocols</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/runtime-doc/design.md"><img src="./assets/examples/theme-plugin-runtime.svg" alt="Agent Plugin Runtime preview" /></a><br />
<sub><a href="./packages/styles/designs/runtime-doc/design.md"><b>Runtime Doc</b></a> · technical document explainers</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/slate-notes/design.md"><img src="./assets/examples/theme-spec-notes.svg" alt="Product Spec Notes preview" /></a><br />
<sub><a href="./packages/styles/designs/slate-notes/design.md"><b>Slate Notes</b></a> · clean product spec boards</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/manual-cream/design.md"><img src="./assets/examples/theme-runbook-manual.svg" alt="Repair Runbook preview" /></a><br />
<sub><a href="./packages/styles/designs/manual-cream/design.md"><b>Manual Cream</b></a> · retro instruction manuals</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/riso-brut/design.md"><img src="./assets/examples/theme-launch-room.svg" alt="Launch Room Loop preview" /></a><br />
<sub><a href="./packages/styles/designs/riso-brut/design.md"><b>Riso Brut</b></a> · editorial launch and growth loops</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/grove/design.md"><img src="./assets/examples/theme-strategy-grove.svg" alt="Quarterly Strategy Map preview" /></a><br />
<sub><a href="./packages/styles/designs/grove/design.md"><b>Grove</b></a> · grounded strategy and planning maps</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/mint-brut/design.md"><img src="./assets/examples/theme-roadmap-mint.svg" alt="Creator Tool Roadmap preview" /></a><br />
<sub><a href="./packages/styles/designs/mint-brut/design.md"><b>Mint Brut</b></a> · playful product roadmaps</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/coral/design.md"><img src="./assets/examples/theme-customer-journey.svg" alt="Customer Journey Signals preview" /></a><br />
<sub><a href="./packages/styles/designs/coral/design.md"><b>Coral</b></a> · warm journeys and onboarding maps</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/violet-marker/design.md"><img src="./assets/examples/theme-research-synthesis.svg" alt="Research Synthesis Wall preview" /></a><br />
<sub><a href="./packages/styles/designs/violet-marker/design.md"><b>Violet Marker</b></a> · clustering and research walls</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/archive-shelf/design.md"><img src="./assets/examples/theme-knowledge-shelf.svg" alt="Knowledge Shelf Map preview" /></a><br />
<sub><a href="./packages/styles/designs/archive-shelf/design.md"><b>Archive Shelf</b></a> · catalog-card research maps</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/inkline/design.md"><img src="./assets/examples/theme-spec-ledger.svg" alt="Spec Ledger preview" /></a><br />
<sub><a href="./packages/styles/designs/inkline/design.md"><b>Inkline</b></a> · severe technical memos and specs</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/espresso-paper/design.md"><img src="./assets/examples/theme-executive-brief.svg" alt="Executive Brief Board preview" /></a><br />
<sub><a href="./packages/styles/designs/espresso-paper/design.md"><b>Espresso Paper</b></a> · warm executive decision pages</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/incident-dark/design.md"><img src="./assets/examples/theme-cache-incident.svg" alt="KV Cache Incident Report preview" /></a><br />
<sub><a href="./packages/styles/designs/incident-dark/design.md"><b>Incident Dark</b></a> · dark RCA and incident reports</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/neon-grid/design.md"><img src="./assets/examples/theme-signal-grid.svg" alt="Runtime Signal Grid preview" /></a><br />
<sub><a href="./packages/styles/designs/neon-grid/design.md"><b>Neon Grid</b></a> · high-energy event and signal maps</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/soft-pop/design.md"><img src="./assets/examples/theme-product-pop.svg" alt="Onboarding Momentum Map preview" /></a><br />
<sub><a href="./packages/styles/designs/soft-pop/design.md"><b>Soft Pop</b></a> · friendly product and onboarding maps</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/raw-grid/design.md"><img src="./assets/examples/theme-raw-grid.svg" alt="Scene Quality Matrix preview" /></a><br />
<sub><a href="./packages/styles/designs/raw-grid/design.md"><b>Raw Grid</b></a> · strict validation and issue matrices</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/bold-poster/design.md"><img src="./assets/examples/theme-bold-poster.svg" alt="Design Systems Win preview" /></a><br />
<sub><a href="./packages/styles/designs/bold-poster/design.md"><b>Bold Poster</b></a> · high-impact thesis boards</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/soft-editorial/design.md"><img src="./assets/examples/theme-soft-editorial.svg" alt="Product Discovery Board preview" /></a><br />
<sub><a href="./packages/styles/designs/soft-editorial/design.md"><b>Soft Editorial</b></a> · research and discovery boards</sub>
</td>
</tr>
<tr>
<td width="50%"><a href="./packages/styles/designs/block-frame/design.md"><img src="./assets/examples/theme-block-frame.svg" alt="Maker Mode Map preview" /></a><br />
<sub><a href="./packages/styles/designs/block-frame/design.md"><b>BlockFrame</b></a> · playful maker workflows</sub>
</td>
<td width="50%"><a href="./packages/styles/designs/long-table/design.md"><img src="./assets/examples/theme-meeting-ledger.svg" alt="Operating Meeting Ledger preview" /></a><br />
<sub><a href="./packages/styles/designs/long-table/design.md"><b>Long Table</b></a> · warm action tables and agendas</sub>
</td>
</tr>
</table>

## Why

Agent-generated diagrams often fail in predictable ways: text overlaps, labels are not centered,
arrows miss their targets, or raw whiteboard JSON drifts into messy coordinates. AgentDraw treats
those as engineering problems:

- agents route standard structured diagrams through Mermaid, and custom explanatory visuals through
  restricted SVG;
- SVG is converted into editable structured JSON, not screenshots;
- styles are reusable design systems rather than one-off colors;
- layout styles are explicit communication patterns, not free-form decoration;
- imported scenes can be repaired and validated before opening;
- humans can still edit the final board directly in the browser.

The product goal is simple: spend fewer tokens, finish faster, and get a better first result. The
agent should not hand-place raw whiteboard JSON unless it is patching an existing board. It should
choose the cheapest reliable source format first, let AgentDraw convert it, then use validation and
preview export only where quality matters.

## Architecture

AgentDraw separates the parts that usually get mixed together in AI diagram tools:

```text
intent/source
  -> provider routing
  -> design style
  -> layout style
  -> Mermaid or SVG source
  -> editable .agentdraw.json
  -> repair / validate / quality / preview
  -> local browser editor
```

### Provider Routing

Use Mermaid when the diagram already has a mature grammar: flowcharts, sequence diagrams, class
diagrams, state diagrams, ER diagrams, timelines, journeys, and similar structured types. Mermaid is
usually faster, cheaper in tokens, and more stable for these.

Use restricted SVG for explanatory article visuals, architecture maps, layered structures,
mechanism diagrams, strategy one-pagers, and slide-like single visuals. SVG gives the agent direct
control over hierarchy, spacing, typography, and composition while still importing into editable
objects.

### Design Style vs Layout Style

Design style controls the visual language: palette, typography, geometry, connector treatment,
spacing, density, and avoid rules. Each bundled style has an agent-readable `design.md` and a
machine-readable design contract.

Layout style controls the information structure. AgentDraw now asks agents to choose a locked layout
style such as contrast split, center mechanism, layered stack, pipeline, loop, matrix, timeline,
orbit map, assertion pillars, hero evidence, bento brief, or decision ladder before drawing SVG.

This split is the main quality-control mechanism. The agent should not "pick a theme and draw
boxes"; it should pick the communication job, then the provider, then the visual system, then the
layout pattern.

### Quality Loop

For important boards, the expected loop is:

```text
plan -> generate Mermaid/SVG -> import -> repair -> validate -> quality score -> export preview -> revise source -> open
```

`agentdraw validate` catches deterministic layout problems such as overlap, vertical-centering
drift, connector endpoint errors, and style-contract drift. `agentdraw quality` adds a lightweight
rubric for structure, readability, connector quality, and editability. The skill also defines P0/P1
quality gates: P0/P1 issues should be fixed before the board is delivered.

## Why AgentDraw

AgentDraw is built for the handoff between coding agents and humans. It is not trying to be a full
hosted AI diagram app; it is a small local tool that agents can install, reason about, validate, and
open for a human to edit.

- **Made for coding agents, not only chat users**: the CLI, schemas, `guide` commands, JSON output,
  and skill file are designed so Claude Code, Codex, Cursor, or another agent can discover the
  workflow and run it without guessing.
- **SVG-first generation**: agents are much better at producing aligned SVG than hand-placed
  whiteboard JSON. AgentDraw turns that stable SVG draft into editable browser objects.
- **Local-first by default**: generated boards live in project-local `.agentdraw.json` files and open
  through a local server. Teams can keep diagrams next to code, prompts, docs, and eval artifacts
  instead of sending every draft through a hosted workspace.
- **Editable structured output**: the result is a real whiteboard scene, not a screenshot. Humans can
  adjust layout, labels, colors, and connectors in the browser after the agent drafts the board.
- **Design systems before drawing**: each theme includes agent-readable `design.md` guidance plus a
  machine-readable contract for palette, typography, geometry, spacing, connectors, and avoid rules,
  so the agent has a design standard instead of just picking colors.
- **Quality gates before preview**: validation catches common generated-board failures such as text
  overflow, overlap, visual centering drift, connector mistakes, wrong font family, and style-contract
  drift.
- **A tighter scope than AI draw.io apps**: projects like
  [`next-ai-draw-io`](https://github.com/DayuanJiang/next-ai-draw-io) focus on chat-driven creation
  and editing of draw.io diagrams. AgentDraw focuses on local agent workflows: generate a structured
  scene, check it, open it, edit it, and keep the artifact in the project.
- **Provider boundary**: Excalidraw is the first editor, but AgentDraw keeps SVG import, scene IO,
  style contracts, validation, local serving, and provider code separated.

## Features

- SVG-first agent workflow with editable `.agentdraw.json` output.
- Restricted SVG importer for `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text/tspan`, groups,
  and arrow markers.
- Excalidraw-based editable canvas.
- 44 bundled styles, including formal diagram styles and palettes adapted from
  `beautiful-feishu-whiteboard`.
- CLI for opening and validating scenes.
- Machine-readable design contracts for palette, typography, geometry, spacing, connector rules,
  and style-specific avoid rules.
- Local HTTP API for loading and saving the current board.
- Export to JSON, SVG, and PNG.
- Scene validation for text overlap, shape overlap, vertical centering, connector endpoints,
  connectors crossing text, and style-contract drift.

## Quick Start

Draft a board as SVG, convert it, then open the editable result:

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest repair board.agentdraw.json --style boardroom --write --json
npx @aidraw/agentdraw@latest validate board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --background --open
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

When using `--background`, AgentDraw first checks the target port for an existing AgentDraw server.
If one is already running, it reuses that server and returns a URL for the requested file instead of
starting another process. If the port is occupied by something else, the command fails and asks for a
different `--port`. This keeps repeated agent runs from leaking background servers.

For WSL or remote usage, run the server on the machine that has a browser:

```bash
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json --background --open
```

For a headless host, keep the server in the background and return the URL:

```bash
pnpm agentdraw open examples/complex-agentdraw-workbench.agentdraw.json --background --no-open --format json
```

## Multiple Boards

An AgentDraw file is one editable infinite-canvas scene. You can place multiple related boards on
the same canvas as separate panels or frame-like regions, for example:

- an overview board plus two detail boards;
- three article images in one review canvas;
- before/after diagrams with a shared legend;
- a flowchart next to an architecture explainer.

For agents, the recommended approach is to generate one SVG containing multiple clearly separated
regions, then import it into one `.agentdraw.json`. Use consistent gutters, titles, and outer
boundaries so each region reads as its own board.

AgentDraw does not yet have a first-class multi-page/artboard model or a `merge` command for
combining several existing `.agentdraw.json` files. If you need a sequence of unrelated visuals
today, generate separate files; if you need a single presentation canvas, compose multiple panels in
one SVG before import.

## CLI

Discover commands:

```bash
pnpm agentdraw --help
pnpm agentdraw schema open --json
pnpm agentdraw guide styles --json
```

Open a board:

```bash
pnpm agentdraw open examples/getting-started.agentdraw.json --background --open
```

Open without launching the system browser:

```bash
pnpm agentdraw open examples/getting-started.agentdraw.json --background --no-open --format json
```

Create a scene file without starting the editor:

```bash
pnpm agentdraw init .agentdraw/board.agentdraw.json
```

Convert a restricted SVG into an editable board:

```bash
pnpm agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style boardroom --title "Agent workflow" --json
```

Convert a Mermaid flowchart into an editable board:

```bash
pnpm agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/flow.agentdraw.json --style blueprint-formal --title "Decision flow" --json
```

Export a rendered preview for visual review:

```bash
pnpm agentdraw export examples/getting-started.agentdraw.json --format png --out .agentdraw/getting-started.preview.png --scale 2 --json
```

Boards open instantly by default. Enable replay only when you explicitly want to watch the diagram
being drawn:

```text
?animate=1
?replay=1
```

Validate a generated scene:

```bash
pnpm validate:scene examples/complex-agentdraw-workbench.agentdraw.json
pnpm agentdraw validate examples/complex-agentdraw-workbench.agentdraw.json --format json
pnpm agentdraw validate examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --format json
pnpm agentdraw repair examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --write --format json
pnpm agentdraw quality examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --format json
pnpm agentdraw export examples/complex-agentdraw-workbench.agentdraw.json --format png --out .agentdraw/complex.preview.png --json
pnpm agentdraw gallery --no-open --format json
```

The validator returns a non-zero exit code for layout errors. Warnings are printed but do not fail
the command. Style-contract drift is reported as warnings so agents can repair weak outputs without
blocking intentionally custom boards. A typical agent loop should be:

```text
choose style -> load design guide + contract -> choose Mermaid for standard flowcharts or SVG for high-design boards -> inspect source -> import -> repair -> validate -> score quality -> export preview when quality matters -> revise source if needed -> open board
```

Use `agentdraw import-mermaid` for conventional flowcharts and decision flows. Use
`agentdraw guide scene` and `agentdraw guide patterns --json` before generating SVG. The SVG
contract keeps the source draft simple enough to import into editable objects while preserving the
layout quality agents usually achieve with SVG. `agentdraw repair` normalizes deterministic display
defaults after import. Use `agentdraw gallery --open` when the user has not expressed a visual
preference and should choose between theme directions.

## SVG-First Format

AgentDraw's recommended source format is a restricted SVG:

```svg
<svg width="1200" height="760" viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" />
    </marker>
  </defs>
  <rect x="80" y="80" width="1040" height="600" rx="10" fill="#FFFFFF" stroke="#172033" />
  <text x="120" y="140" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="750" fill="#172033">System map</text>
</svg>
```

Supported import tags are `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`,
`tspan`, `defs`, and `marker`. Keep text as real text. Avoid `foreignObject`, `image`, `clipPath`,
`mask`, `filter`, gradients, and arbitrary paths for editable boards.

## Scene Format

An AgentDraw scene is the editable browser storage format produced by `agentdraw import-svg`.
Agents should treat it as generated output, not the source drawing language.

Advanced agents may patch these fields only when updating an existing board:

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

Agents should load both the narrative guide and the machine-readable contract:

```bash
agentdraw guide style system-formal --format text
agentdraw guide contract system-formal --json
agentdraw guide patterns --json
agentdraw gallery --open --format json
agentdraw validate-style system-formal --json
```

Formal styles:

- `system-formal`
- `boardroom`
- `blueprint-formal`

Additional palette presets are grouped as:

- restrained: `archive-shelf`, `avocado-press`, `espresso-paper`, `grove`, `inkline`, `jade-lens`,
  `long-table`, `manual-cream`, `papier-bleu`, `runtime-doc`, `salmon-stamp`, `slate-notes`
- balanced: `apricot-arc`, `berry-pop`, `bold-poster`, `checker-bloom`, `cobalt-bloom`, `coral`,
  `cut-bloom`, `editorial-forest`, `incident-dark`, `lime-slab`, `linen-cut`, `pin-and-paper`,
  `raw-grid`, `riptide-cobalt`, `soft-editorial`, `soft-pop`, `violet-marker`
- bold: `block-frame`, `burst-panel`, `confetti-wedge`, `court-press`, `crayon-stack`,
  `grove-block`, `mint-brut`, `neo-grid-bold`, `neon-grid`, `riso-brut`, `specimen-bold`,
  `stencil-tablet`

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
- colors, roughness, stroke widths, or type sizes that drift from the selected design contract.

It is not a full visual renderer. For critical diagrams, use it as a first pass, then inspect the
board in the browser.

## Quality Scoring

`agentdraw quality` turns the first rubric into a machine-readable preflight score:

```bash
agentdraw quality examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --json
```

It scores task fit, structure, visual design, readability, connector quality, and validation/editability
on a 24-point scale. The task-fit dimension is marked as review-required because the CLI cannot know
the user's original prompt; use the score as a guardrail, not as a replacement for prompt-aware review.

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Agent Skill

Agents should install [`skills/agentdraw/SKILL.md`](./skills/agentdraw/SKILL.md), then use the CLI
for version-matched guidance:

```bash
agentdraw guide styles --json
agentdraw gallery --no-open --format json
agentdraw guide style system-formal --format text
agentdraw guide contract system-formal --json
agentdraw guide patterns --json
agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/flow.agentdraw.json --style blueprint-formal --json
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style system-formal --json
agentdraw repair .agentdraw/board.agentdraw.json --style system-formal --write --json
agentdraw validate .agentdraw/board.agentdraw.json --style system-formal --json
agentdraw quality .agentdraw/board.agentdraw.json --style system-formal --json
agentdraw guide quality --format text
```

## Evaluation

Use [`evals/`](./evals) to check whether the skill produces boards that are useful, editable, and
visually intentional. The first eval set includes prompts and a 24-point rubric for task fit,
structure, visual design, readability, connector quality, and validation.

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
packages/styles/   style catalog, render profiles, and design contracts
examples/          sample scenes
scripts/           repo utility scripts
```

## Inspired By

AgentDraw is shaped by several projects and ideas:

- [Excalidraw](https://github.com/excalidraw/excalidraw): the editable canvas experience that makes
  AI drafts practical for human follow-up.
- [Mermaid](https://github.com/mermaid-js/mermaid): the right source format for standard structured
  diagrams where grammar and layout semantics matter more than custom composition.
- [Drawnix](https://github.com/plait-board/drawnix): a reference point for open-source whiteboard
  editing and local-first drawing workflows.
- [beautiful-feishu-whiteboard](https://github.com/zarazhangrui/beautiful-feishu-whiteboard): an
  early proof that agent-readable design guidance can produce more polished whiteboard visuals.
- [open-design](https://github.com/nexu-io/open-design): inspiration for treating AI visual output
  as a design-runtime problem, not only a prompt problem.
- [Google design.md](https://github.com/google-labs-code/design.md): inspiration for making design
  rules explicit and readable by coding agents.
- [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) and
  [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill): references for layout discipline,
  theme systems, and presentation-style visual constraints.
- [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io),
  [ai-excalidraw](https://github.com/co-pine/ai-excalidraw),
  [fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph),
  [architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator),
  and GitHub's
  [excalidraw-diagram-generator skill](https://github.com/github/awesome-copilot/blob/main/skills/excalidraw-diagram-generator/SKILL.md):
  useful references for AI-assisted diagram generation, prompt structure, and where AgentDraw should
  stay focused on local editable agent workflows.

## Repository

```bash
git remote add origin git@github.com:agentdraw/agentdraw.git
```

## License

[MIT](./LICENSE)

AgentDraw is powered by [Excalidraw](https://github.com/excalidraw/excalidraw).
