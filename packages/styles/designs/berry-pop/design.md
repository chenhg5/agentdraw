---
version: 1.0
name: Berry Pop
provider: agentdraw
description: >
  A fresh raspberry and periwinkle system for upbeat product flows, launch plans, and audience maps.
---

# Berry Pop

## Intent

Use when the board should feel modern, fresh, and accessible without becoming cartoonish.

## Palette

Canvas white, ink `#171717`, pale berry `#F8F3F7`, raspberry `#9E2B50`, periwinkle `#C7D2F0`, muted violet `#565A88`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-40px, section 18-22px, body 15-17px. Short labels, strong hierarchy.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use rounded cards, berry sidebars, periwinkle lanes, small pill tags, and clean connectors.

## Layout

Best for audience journeys, content maps, and activation funnels. Alternate berry emphasis with periwinkle support.

## Avoid

Avoid placing small dark text on raspberry, and avoid too many pastel fills in one cluster.
