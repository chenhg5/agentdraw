---
version: 1.0
name: Checker Bloom
provider: agentdraw
description: >
  A playful mint, blue, and green system with checker-like rhythm and hand-painted friendliness.
---

# Checker Bloom

## Intent

Use for approachable explainers, workshop outputs, and creative process boards.

## Palette

Canvas `#E8F1DD`, ink `#1E2620`, surface white, blue `#2C6EE0`, green `#5E9E4A`, pale green `#A7D2A0`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, card title 20-24px, note text 15-17px. Friendly wording works well.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use alternating tiles, soft rounded cards, green check blocks, blue emphasis labels, and light roughness.

## Layout

Good for matrices, workshop boards, and grouped idea maps. Checker rhythm should organize content, not become background noise.

## Avoid

Avoid tiny checker decoration, low contrast green text, and too many diagonal connectors.
