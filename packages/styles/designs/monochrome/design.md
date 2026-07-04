---
version: 1.0
name: Monochrome
provider: agentdraw
description: >
  A text-first minimal system with near-black ink, pale canvas, and no decorative accent dependence.
---

# Monochrome

## Intent

Use for serious diagrams where clarity and hierarchy matter more than visual personality.

## Palette

- Canvas: `#FAFADF`.
- Ink: `#1A1A16`.
- Surface: white.
- Rule and muted text: `#5E5E54`.
- Pale fill: `#E7E7C8`.
- Deep note: `#3D3D36`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 32-40px, section label 18-22px, body 15-17px. Weight and spacing create hierarchy because there is no strong accent.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use simple cards, dense tables, rule-based grouping, and clean connectors. Corners 0-4px. Stroke width 1-2px.

## Layout

Best for process maps, governance diagrams, and checklists. Align everything to a strict grid.

## Avoid

Avoid relying on color for meaning; use labels, ordering, and shape position instead.
