# AgentDraw Style System

AgentDraw should treat a style as a small design system, not as a color preset.

The scene file remains the editable storage format:

```text
agent prompt -> design system -> scene builder -> provider adapter -> .agentdraw.json
```

This keeps the browser editor simple while giving agents enough guidance to produce boards that look designed.

## What A Style Owns

Each style should have a `design.md` that an agent can read before generating a board.

Required sections:

- `intent`: what the style is good for, and what it should not be used for.
- `palette`: named colors, semantic roles, and contrast rules.
- `typography`: title, section, body, caption sizes, weight, casing, and line height.
- `geometry`: corner radius, stroke width, density, spacing grid, and allowed shapes.
- `components`: reusable recipes such as cards, lanes, callouts, tables, badges, dividers, shadows, and connectors.
- `layout`: recommended narrative structures such as pipeline, hub-and-spoke, swimlane, matrix, timeline, and system map.
- `do / avoid`: concrete constraints that prevent generic palette swaps.
- `validation`: style-specific checks, such as minimum card padding, maximum text length per line, connector clearance, and intentional-overlap rules.

## Provider Boundary

The design system must be provider-neutral. It should describe intent and recipes; adapters translate those recipes into canvas elements.

For Excalidraw:

- formal styles use `roughness: 0`, sharp corners, sans text, and elbow connectors;
- expressive styles may use roughness, larger color blocks, hard offset shadows, and sticker-like cards;
- shadows are duplicated shapes behind the main shape, not CSS or image effects;
- text must still be real editable text, not outlines or screenshots.

For future providers:

- SVG import can be a compiler target, but not the canonical format;
- tldraw or another canvas can be another adapter if its editable object model is useful;
- draw.io-like output should come from the same semantic scene builder, not a separate hand-built JSON dialect.

## Recommended Package Shape

```text
packages/styles/
  designs/<style-id>/design.md
  src/catalog.ts
  src/design.ts

packages/scene/
  src/builders/
    layout.ts
    components.ts
    excalidraw.ts
  src/validate.ts
```

`catalog.ts` exposes searchable metadata. `design.md` carries the agent-facing rules. `design.ts` exposes structured values that code can use without parsing Markdown.

## Builder API Direction

Agents should not have to hand-place every primitive. They should be able to call higher-level recipes:

```ts
const board = createBoard({ styleId: "riso-brut", title: "Launch Room Loop" });

board.pipeline({
  lanes: ["Sense", "Frame", "Publish", "Learn"],
  cards: [
    { title: "Audience", body: ["pain", "segment"] },
    { title: "Promise", body: ["story", "offer"] },
    { title: "Surface", body: ["page", "asset"] },
    { title: "Signal", body: ["traffic", "reply"] },
  ],
});

board.validate();
board.toExcalidrawScene();
```

The builder should emit normal `.agentdraw.json`, so users can still open and edit the result manually.

## Feasibility

This is feasible without replacing Excalidraw.

The first useful step is to add `design.md` files for the bundled styles and teach examples/scripts to read structured style rules. The second step is a small component/layout builder so agents generate semantic cards, tables, lanes, and connectors instead of raw coordinates. The third step is style-aware validation, so each design system can define what counts as good spacing, text length, shadow usage, and connector routing.

The risky path is trying to make provider switching solve design quality. Excalidraw can produce more formal boards if the generated scene uses sharper geometry, lower roughness, tighter typography, and stronger layout recipes. Provider choice matters less than the upstream design contract.
