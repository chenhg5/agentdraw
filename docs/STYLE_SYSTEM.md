# AgentDraw Style System

AgentDraw treats a style as a small design system, not as a color preset.

The primary agent pipeline is SVG-first:

```text
agent prompt -> design system -> restricted SVG -> SVG importer -> editable .agentdraw.json
```

This is the current preferred architecture because agents produce cleaner alignment, spacing, and
composition in SVG than in raw whiteboard JSON. The browser editor still receives editable scene
objects, so users can manually refine the result.

## What A Style Owns

Each style has a `design.md` that an agent can read before generating a board.

Required sections:

- `intent`: what the style is good for, and what it should not be used for.
- `palette`: named colors, semantic roles, and contrast rules.
- `typography`: title, section, body, caption sizes, weight, casing, and line height.
- `geometry`: corner radius, stroke width, density, spacing grid, and allowed shapes.
- `components`: reusable recipes such as cards, lanes, callouts, tables, badges, dividers, shadows, and connectors.
- `layout`: recommended narrative structures such as pipeline, hub-and-spoke, swimlane, matrix, timeline, and system map.
- `svg rules`: how to express the style in the supported SVG subset.
- `do / avoid`: concrete constraints that prevent generic palette swaps.
- `validation`: style-specific checks, such as minimum card padding, maximum text length per line, connector clearance, and intentional-overlap rules.

## SVG Import Boundary

The design system should tell agents how to draw the source SVG. The importer translates that source
into editable scene elements.

Supported source tags:

- `svg`, `g`, `rect`, `circle`, `ellipse`
- `line`, `polyline`
- `text`, `tspan`
- `defs`, `marker` for arrowheads

Supported transform:

- `translate(x y)` or `translate(x,y)` on groups

Avoid in editable boards:

- `foreignObject`, `image`, `clipPath`, `mask`, `filter`
- gradients
- arbitrary `path` geometry, except marker arrowhead definitions
- text converted to outlines

## Provider Boundary

The editable output is still provider-specific. Today the provider is Excalidraw, so the importer
maps SVG geometry into Excalidraw-compatible rectangles, ellipses, arrows, lines, and text.

For Excalidraw output:

- formal styles use low roughness, sharp or small-radius corners, sans text, and clean connectors;
- expressive styles may use roughness, larger color blocks, hard offset shadows, and sticker-like cards;
- shadows are duplicated editable shapes behind the main shape, not CSS or image effects;
- text must remain editable text, not outlines or screenshots.

Future providers can share the same SVG source and design systems if their editable object model is
useful enough.

## Recommended Package Shape

```text
packages/styles/
  designs/<style-id>/design.md
  src/catalog.ts
  src/design.ts

packages/scene/
  src/svg-import.ts
  src/validate.ts
  src/repair.ts
```

`catalog.ts` exposes searchable metadata. `design.md` carries the agent-facing rules. `design.ts`
exposes structured values that code can use without parsing Markdown.

## Builder Direction

The next useful abstraction is not a separate JSON dialect. It is a small SVG helper layer that
emits the supported SVG subset:

```ts
const board = createSvgBoard({ styleId: "boardroom", title: "Launch Room Loop" });

board.pipeline({
  lanes: ["Sense", "Frame", "Publish", "Learn"],
  cards: [
    { title: "Audience", body: ["pain", "segment"] },
    { title: "Promise", body: ["story", "offer"] },
    { title: "Surface", body: ["page", "asset"] },
    { title: "Signal", body: ["traffic", "reply"] },
  ],
});

board.toSvg();
```

The SVG is then converted through `agentdraw import-svg` into normal `.agentdraw.json`, so users can
still open and edit the board manually.

## Feasibility

This is feasible without replacing Excalidraw.

The key bet is that SVG is the stable generation layer and Excalidraw is the editable interaction
layer. The risky path is forcing agents to hand-place raw Excalidraw JSON. A style-aware SVG source
keeps model output cleaner, keeps token use understandable, and still gives users editable objects
after import.
