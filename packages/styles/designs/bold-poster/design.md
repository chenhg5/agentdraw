---
version: 1.0
name: Bold Poster
provider: agentdraw
description: >
  A loud print-poster style with single red emphasis, oversized type, and hard editorial structure.
---

# Bold Poster

## Intent

Use for thesis-driven diagrams, bold comparisons, and simple high-impact explanations.

## Palette

Canvas white, ink `#1C1410`, pale red `#FFF1EF`, red `#D8000F`, soft red `#F4C7C1`, deep brown `#5A2A23`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 40-52px, section labels 20-26px, body 16-18px. Large type is the decoration.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use poster blocks, red banners, numbered badges, and thick dividers. Corners mostly square. Strokes 2-4px.

## Layout

Works best with one large headline panel and 3-4 supporting blocks. Use red once as the loud element.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid many small cards, subtle gray UI, and multiple competing accent colors.
