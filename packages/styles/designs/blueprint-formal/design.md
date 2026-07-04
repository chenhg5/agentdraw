---
version: 1.0
name: Blueprint Formal
provider: agentdraw
description: >
  A technical blueprint style for architecture, event buses, protocols, and systems.
  Blue ink, straight routing, white cards, and diagrammatic spacing.
---

# Blueprint Formal

Use this style for technical maps where the relationships matter more than decoration.

## Palette

- `canvas`: `#F8FBFF`.
- `ink`: `#163B68`.
- `panel`: `#FFFFFF`.
- `accent`: `#0B63CE` for backbone rails and active routes.
- `accent2`: `#DBEAFE` for secondary modules.
- `muted`: `#5B708A` for labels.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

- Title: 32-38px.
- Module title: 19-22px.
- Module body: 14-16px.
- Backbone label: 16-18px, all-caps only for short technical phrases.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Components

- Use an outer blueprint frame or titled system boundary for architecture, layered system, and workflow diagrams.

- `module`: white rectangle, 2px blue border, centered title and two-line body.
- `backbone`: thick horizontal accent rail with white text.
- `store`: secondary rectangle below the backbone.
- `route`: vertical or elbow connector into the backbone.
- `projection-card`: secondary module aligned to a backbone station. It must share the same center x as the related top module or rail tap.
- `constraint-strip`: full-width white rule panel near the bottom, aligned to the rail width and frame gutters.

## Layout

Blueprint Formal should read like an engineering drawing: exact stations, repeated dimensions, and visible alignment. Use a central bus or rail only when all related modules snap to it.

Recommended structure:

- Top row: 3-5 equal `module` cards with shared y, width, height, and centerline. Keep the horizontal gap identical between every module.
- Middle: one `backbone` rail aligned to the same left and right gutters as the module group.
- Bottom row: 2-4 `projection-card` modules. Each bottom card should either share a center x with a top module or sit on an evenly spaced rail station.
- Footer: one `constraint-strip` or note aligned to the rail width.

Grid rules:

- Work on an 8px grid. Prefer x/y/width/height values divisible by 8.
- Major horizontal gutters should match: left frame gutter, rail inset, and footer inset should visually line up.
- Repeated modules in one row should share width and height. Do not mix 264px, 280px, and 320px cards in the same row unless width encodes data.
- Vertical bands should have predictable spacing: title -> top modules -> rail -> bottom modules -> footer. Avoid large accidental empty zones.
- Connector geometry must be orthogonal. Use vertical taps into the rail and short horizontal elbows. Do not draw long diagonal or crowded crossing routes.
- Arrowheads should appear only on directional process routes. Use plain lines for dividers, rails, and blueprint measurement guides.

Self-check before import:

- Can you draw vertical guide lines through related top and bottom modules?
- Are all top modules equal size and all bottom cards equal size?
- Does the rail align with the module group instead of floating wider or narrower?
- Are connector endpoints on module edges or rail edges, not inside text?
- When zoomed out, does the page look like a technical blueprint rather than scattered cards?

## Avoid

- organic shapes;
- rough hand-drawn styling;
- large saturated blocks outside the backbone;
- diagonal routes when an elbow route is clearer;
- uneven station spacing;
- orphan modules that do not align to the rail;
- decorative arrowheads on divider lines or measurement guides.
