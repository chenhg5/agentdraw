---
version: 1.0
name: Linen Cut
provider: agentdraw
description: >
  A tasteful mid-century modern system with linen canvas, blue and green accents, and precise composition.
---

# Linen Cut

## Intent

Use for premium product maps, architecture explainers, and restrained strategy boards.

## Palette

Canvas `#E4D2C4`, ink `#1D2620`, surface `#F7EEE7`, blue `#044D99`, green `#04B24F`, muted brown `#8C6757`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, section 19-24px, body 15-17px. Use composed, spare language.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use cut-paper rectangles, color-block headers, small circular counters, and clean tables. Corners 0-8px.

## Layout

Good for layered architecture, roadmaps, and comparisons. Keep blue and green in separate roles.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid too many small decorations, roughness, and saturated full-canvas blocks.
