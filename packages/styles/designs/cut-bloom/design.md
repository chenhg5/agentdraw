---
version: 1.0
name: Cut Bloom
provider: agentdraw
description: >
  A calm warm collage system with soft color blocks and gentle editorial composition.
---

# Cut Bloom

## Intent

Use for planning, journey maps, and explainers that need warmth without loudness.

## Palette

Canvas white, ink `#1A1A1A`, warm surface `#FFF7E1`, blue-violet `#535D9E`, yellow `#F0CB65`, rose `#E9A8B0`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, section 19-23px, body 15-17px. Prefer balanced labels and moderate line length.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use overlapping-but-clear panels, small color tabs, rounded content cards, and soft callouts. Hard shadows are optional and subtle.

## Layout

Works for layered maps, discovery boards, and narrative flows. Use one color per content role.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid using all accents as equal backgrounds and avoid text directly on yellow unless large.
