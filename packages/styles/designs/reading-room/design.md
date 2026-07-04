---
version: 1.0
name: Reading Room
provider: agentdraw
description: >
  A literary institutional style for summaries, research maps, and knowledge organization.
---

# Reading Room

## Intent

Use when the board should feel thoughtful, archival, and quietly authoritative.

## Palette

- Canvas: `#F6EBD8`.
- Ink: `#2A231C`.
- Surface: `#FFF7EA`.
- Warm accent: `#DE916A`.
- Dusty secondary: `#D6C7CC`.
- Muted label: `#6C5C4B`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, section heading 20-24px, body 16-18px. Use sentence case and concise editorial copy.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use library-card panels, catalog rows, annotation strips, and quiet callout boxes. Corners 0-6px. Thin rules are preferred over heavy frames.

## Layout

Best for literature reviews, meeting synthesis, research collections, and knowledge maps. Group related ideas into shelves or columns.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid loud badges, high-energy arrows, and crowded sticky-note walls.
