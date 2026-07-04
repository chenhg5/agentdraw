---
version: 1.0
name: Stencil & Tablet
provider: agentdraw
description: >
  A retro skate-poster system with warm tablet background, orange, magenta, and teal blocks.
---

# Stencil & Tablet

## Intent

Use for bold creative workflows, campaign plans, and expressive process diagrams.

## Palette

Canvas `#E2DCC9`, ink `#201A17`, surface `#F4ECD8`, orange `#EE7A2E`, magenta `#C73B7A`, teal `#2D7E73`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-50px, stencil labels 20-28px, body 16-18px. Short labels work best.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use poster slabs, stencil-like labels, hard shadows, offset cards, and saturated route markers. Corners mostly square.

## Layout

Best for expressive 4-step flows, campaign maps, and creative pipelines. Assign each accent to a role.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid small text on saturated magenta/orange and avoid delicate thin-line formal diagrams.
