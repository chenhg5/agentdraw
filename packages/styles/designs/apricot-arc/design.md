---
version: 1.0
name: Apricot Arc
provider: agentdraw
description: >
  A warm retro geometric system with apricot arcs, soft panels, and friendly product-story energy.
---

# Apricot Arc

## Intent

Use for product narratives, lifecycle diagrams, and friendly strategy maps.

## Palette

Canvas `#FFF8EE`, ink `#261B14`, surface white, apricot `#F69834`, soft pink `#F9C2BD`, brown `#82501B`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, card title 20-24px, body 15-17px. Use warm, direct labels.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use rounded cards, arc-like sequences approximated with stepped rectangles or circular markers, apricot header strips, and pink secondary panels.

## Layout

Good for circular loops, lifecycle maps, and 3-5 stage flows. Keep warm accents large but sparse.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid gradients, tiny ornament, and long text inside orange fills.
