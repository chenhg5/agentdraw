---
version: 1.0
name: Editorial Forest
provider: agentdraw
description: >
  A bookish forest-green and rose system for refined editorial boards and strategic summaries.
---

# Editorial Forest

## Intent

Use for high-formality strategy, research, and narrative diagrams with an editorial feel.

## Palette

Canvas `#EFE7D4`, ink `#1E241A`, surface `#FBF6EA`, forest `#2E4A2A`, rose `#E89CB1`, muted `#7A6C58`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 36-44px, section heading 21-26px, body 16-18px. Use polished, concise writing.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use forest header panels, cream cards, rose annotation marks, and quiet dividers. Mostly square corners.

## Layout

Good for thesis-plus-evidence layouts, research maps, and executive one-pagers. Use rose only as punctuation.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid bright candy accents, roughness, and crowded note walls.
