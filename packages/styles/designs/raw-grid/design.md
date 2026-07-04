---
version: 1.0
name: Raw Grid
provider: agentdraw
description: >
  A sharp digital brutalist grid style with black structure, pale surfaces, and strict alignment.
---

# Raw Grid

## Intent

Use for technical specs, system maps, issue boards, and diagrams that should feel native and exact.

## Palette

Canvas white, ink `#0A0A0A`, surface `#F8F8F8`, black accent, pale rose `#F2D4CF`, muted `#5B5B5B`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 32-40px, row labels 16-20px, body 14-16px. Use compact labels and strict alignment.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use sharp rectangles, grid cells, table rows, monospace-like labels when appropriate, and straight connectors. Corners 0.

## Layout

Best for matrices, system inventories, and data-flow maps. Align to a strong grid and keep spacing consistent.

## Avoid

Avoid rounded playful cards, hand-drawn roughness, and decorative shadows.
