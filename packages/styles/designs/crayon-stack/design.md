---
version: 1.0
name: Crayon Stack
provider: agentdraw
description: >
  A loud primary-color system with crayon-bright blocks, stacked cards, and obvious hierarchy.
---

# Crayon Stack

## Intent

Use for playful education, simple mental models, and high-energy maker workflows.

## Palette

Canvas white, ink `#151515`, pale warm surface `#FFF3EC`, red `#FF472B`, lime `#D3FE79`, blue `#2F65FF`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-48px, block title 22-28px, body 16-18px. Use simple words and strong labels.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use stacked cards, large colored labels, hard offset shadows, and thick black outlines. Light roughness is allowed.

## Layout

Best for 3-part explanations, teaching boards, and playful process maps. Use one primary color per stage.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid using red, lime, and blue in every card; avoid small text on bright fills.
