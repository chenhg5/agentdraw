---
version: 1.0
name: Soft Editorial
provider: agentdraw
description: >
  A gentle magazine-like system with warm paper, pastel rose, and soft lime accents.
---

# Soft Editorial

## Intent

Use for user research, planning, and narrative boards that need warmth and approachability.

## Palette

Canvas `#ECE9DC`, ink `#202018`, surface white, rose `#E2A8CE`, lime `#C9DA4F`, muted `#8A786A`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, section 20-24px, body 15-17px. Editorial but not precious.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use magazine panels, soft callouts, rose pull quotes, lime decision markers, and gentle dividers. Corners 8-12px.

## Layout

Best for synthesis, journey maps, and priority boards. Use one large editorial panel plus smaller supporting cards.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid dark heavy borders, high-density technical routes, and too many pastel panels.
