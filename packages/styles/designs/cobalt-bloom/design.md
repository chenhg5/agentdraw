---
version: 1.0
name: Cobalt Bloom
provider: agentdraw
description: >
  A confident editorial system with dusty rose canvas, cobalt blocks, and oversized display type.
---

# Cobalt Bloom

## Intent

Use for bold editorial summaries, campaign strategy, and visual narratives with a strong point of view.

## Palette

Canvas `#DDA8A2`, ink `#171717`, pale rose `#F1C8C3`, cobalt `#4746C6`, white, muted purple `#6B4A7D`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 40-54px, block title 24-30px, body 16-18px. Let scale create drama.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use large cobalt feature panels, white quote cards, oversized numerals, and limited borders. Corners 0-8px.

## Layout

Best as a feature block plus supporting cards, or a 2x2 editorial grid. Keep density low.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid small cobalt text, lots of equal-size cards, and technical bus diagrams.
