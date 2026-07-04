---
version: 1.0
name: Riptide Cobalt
provider: agentdraw
description: >
  A bold low-density cobalt poster style on warm cream, built for high-impact explanations.
---

# Riptide Cobalt

## Intent

Use for big-picture strategy, launch narratives, and simple systems with a strong primary path.

## Palette

Canvas `#FDF0E0`, ink `#1A2240`, surface white, cobalt `#375DFE`, pale cobalt `#DCE4FF`, muted tan `#6D5A45`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-48px, hero label 26-34px, body 16-18px. Keep the number of labels low.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use one large cobalt feature block, white cards, thick connectors, and strong section dividers. Corners 0-8px.

## Layout

Works as a central thesis with satellites or a low-density 3-step flow. Leave large margins.

## Avoid

Avoid dense tables, many small chips, and mixing cobalt with too many extra accents.
