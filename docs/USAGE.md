# AgentDraw Usage

This document keeps operational details out of the README while preserving the commands agents and
humans need for day-to-day use.

## Local Server

Open a board:

```bash
agentdraw open examples/getting-started.agentdraw.json --background --open
```

Start the local server without launching the system browser:

```bash
agentdraw open examples/getting-started.agentdraw.json --background --no-open --format json
```

The default local URL is:

```text
http://127.0.0.1:3927
```

When `--background` is used, AgentDraw checks whether an AgentDraw server is already running on the
target port. If it is, the command reuses the server and returns a URL for the requested file. If
the port is occupied by another service, use `--port`.

## Import

Convert restricted SVG into an editable board:

```bash
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style boardroom --title "Agent workflow" --json
```

Convert a Mermaid flowchart into an editable board:

```bash
agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/flow.agentdraw.json --style blueprint-formal --title "Decision flow" --json
```

## Export

Export a rendered preview for visual review:

```bash
agentdraw export examples/getting-started.agentdraw.json --format png --out .agentdraw/getting-started.preview.png --scale 2 --json
agentdraw export examples/getting-started.agentdraw.json --format svg --out .agentdraw/getting-started.preview.svg --json
```

## Validation And Repair

Validate a generated scene:

```bash
agentdraw validate examples/complex-agentdraw-workbench.agentdraw.json --format json
agentdraw validate examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --format json
```

Repair deterministic display defaults and style-contract drift:

```bash
agentdraw repair examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --write --format json
```

Score scene quality:

```bash
agentdraw quality examples/complex-agentdraw-workbench.agentdraw.json --style system-formal --format json
```

The validator catches common generated-board mistakes before the browser opens:

- text bounding boxes overlapping;
- non-contained shape overlaps;
- text groups that are visibly off-center inside short containers;
- connector endpoints that are far from the nearest shape;
- connectors that cross text bounding boxes;
- colors, roughness, stroke widths, or type sizes that drift from the selected design contract.

Validation is not a full visual renderer. For critical diagrams, export a preview and inspect the
board in the browser.

## SVG Source Rules

AgentDraw's recommended source format for custom boards is restricted SVG:

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

Supported import tags:

- `svg`
- `g`
- `rect`
- `circle`
- `ellipse`
- `line`
- `polyline`
- `polygon`
- `text`
- `tspan`
- `defs`
- `marker`

Keep text as real text. Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients,
and arbitrary paths for editable boards.

## Scene Files

An AgentDraw scene is the editable browser storage format produced by `agentdraw import-svg` or
`agentdraw import-mermaid`. Agents should treat it as generated output, not the primary drawing
language.

Advanced agents may patch these fields when updating an existing board:

- `styleId`
- `providerId`
- `elements`
- `appState`
- `files`

The browser editor auto-saves manual edits back into the same file.

## Gallery And Style Guides

Use the gallery when the user has not expressed a visual preference:

```bash
agentdraw gallery --open --format json
agentdraw gallery --no-open --format json
```

Load style guidance and machine-readable contracts:

```bash
agentdraw guide styles --json
agentdraw guide style system-formal --format text
agentdraw guide contract system-formal --json
agentdraw guide patterns --json
agentdraw validate-style system-formal --json
```

## Replay

Boards open instantly by default. Enable replay only when explicitly desired:

```text
?animate=1
?replay=1
```

## Multiple Boards

An AgentDraw file is one editable infinite-canvas scene. You can place multiple related boards on
the same canvas as separate panels or frame-like regions:

- an overview board plus two detail boards;
- three article images in one review canvas;
- before/after diagrams with a shared legend;
- a flowchart next to an architecture explainer.

For new multi-panel work, the recommended approach is still to generate one SVG containing multiple
clearly separated regions, then import it into one `.agentdraw.json`.

When you already have several `.agentdraw.json` boards, combine them into one larger editable scene:

```bash
agentdraw combine board-a.agentdraw.json board-b.agentdraw.json board-c.agentdraw.json board-d.agentdraw.json --columns 2 --out combined.agentdraw.json --json
```

`combine` offsets each input board as a whole unit and rewrites element ids, bindings, group ids,
and file ids to avoid collisions. If `--columns` is omitted, the command uses a near-square grid;
four boards become `2x2` by default.

## Example Sources

Editable examples live in:

- [`examples/`](../examples)
- [`examples/layouts/`](../examples/layouts)

Preview assets live in:

- [`assets/examples/`](../assets/examples)
- [`assets/layouts/`](../assets/layouts)

Regenerate theme examples:

```bash
node scripts/generate-theme-examples.mjs
```

Regenerate README previews:

```bash
pnpm examples:previews
```
