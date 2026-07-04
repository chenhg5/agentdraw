---
version: 1.0
name: Neo-Grid Bold
provider: agentdraw
description: >
  A bold editorial grid with black structure, neon lime emphasis, and precise modular composition.
---

# Neo-Grid Bold

## Intent

Use for modern editorial diagrams, product systems, architecture summaries, and priority maps.

## Palette

Canvas `#F5F4EF`, ink `#0A0A0A`, surface `#FFFFFF`, neon lime `#E6FF3D`, muted gray `#A9A9A1`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-50px, grid header 18-24px, body 15-17px. Use compact labels and strong ordering.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use strict grid cells, black frames, lime highlights, oversized row numbers, and straight connectors. Corners 0.

## Layout

Best for matrices, system maps, and feature prioritization. Keep all edges aligned.

## Avoid

Avoid soft rounded cards, diagonal decoration, and more than one neon role.
