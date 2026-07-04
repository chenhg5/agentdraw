---
version: 1.0
name: Pin & Paper
provider: agentdraw
description: >
  A graphic whiteboard style with paper cards, yellow highlights, and blue pin-like emphasis.
---

# Pin & Paper

## Intent

Use for collaborative plans, workshop synthesis, and practical agent workflows.

## Palette

Canvas white, ink `#161616`, pale yellow `#FFFBE1`, blue `#2A3C99`, yellow `#F1E84E`, muted blue `#576196`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, card title 20-24px, note text 15-17px. Labels may be casual but must stay concise.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use paper cards, small blue pin badges, yellow highlighter strips, and simple arrow routes. Rounded corners 4-10px.

## Layout

Works for kanban-like flows, note clusters, and review boards. Use yellow to highlight decisions, not every note.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid noisy sticky-note walls and low-contrast yellow text.
