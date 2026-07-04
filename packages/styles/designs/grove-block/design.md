---
version: 1.0
name: Grove Block
provider: agentdraw
description: >
  A confident flat green brand-forward system with bold blocks and restrained playful accents.
---

# Grove Block

## Intent

Use for brand systems, product strategy, and operating diagrams that need confidence and clarity.

## Palette

Canvas `#F7F1EC`, ink `#17211A`, surface white, green `#008248`, pink `#F6BDDA`, yellow `#FCC715`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 36-46px, block title 22-28px, body 16-18px. Use strong but clean phrasing.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use flat green hero panels, white cards, pink/yellow small tags, and thick clean dividers. Corners 0-8px.

## Layout

Works as a hero thesis plus supporting map, or a blocky roadmap. Green should carry the primary story.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid making pink the dominant fill, and avoid rough hand-drawn styling.
