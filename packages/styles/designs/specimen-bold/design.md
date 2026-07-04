---
version: 1.0
name: Specimen Bold
provider: agentdraw
description: >
  A type-specimen inspired system with graphic labels, green/yellow accents, and loud hierarchy.
---

# Specimen Bold

## Intent

Use for boards where typography and category contrast should do most of the design work.

## Palette

Canvas `#F3F3F3`, ink `#2E302E`, surface white, green `#3EC06A`, yellow `#FBEF4A`, muted `#8B8F87`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 40-54px, specimen labels 24-32px, body 16-18px. Use large labels, short supporting copy.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use type blocks, numbered specimens, thick rules, green category cards, and yellow emphasis tags.

## Layout

Best for taxonomies, comparisons, and concept breakdowns. Let one huge label anchor each region.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid many same-size cards and low-hierarchy paragraph layouts.
