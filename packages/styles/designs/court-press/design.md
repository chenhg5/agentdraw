---
version: 1.0
name: Court Press
provider: agentdraw
description: >
  A sporty tactical-board style with green, rose, and yellow accents for fast-moving plans.
---

# Court Press

## Intent

Use for tactics, team workflows, response plans, and competitive strategy diagrams.

## Palette

Canvas `#F2EFE6`, ink `#1F251B`, surface white, green `#66914C`, rose `#DA9EB7`, yellow `#E7C85E`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 36-46px, play label 18-22px, body 15-17px. Use active verbs.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use court lanes, route arrows, numbered plays, score strips, and compact cards. Rounded corners 4-8px.

## Layout

Works as a tactical map or play sequence. Route arrows can be energetic but must not cross labels.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid dense prose, purely decorative play lines, and more than three route colors.
