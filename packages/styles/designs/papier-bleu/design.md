---
version: 1.0
name: Papier Bleu
provider: agentdraw
description: >
  An airy artful blue system inspired by cut paper: calm, spacious, and gently expressive.
---

# Papier Bleu

## Intent

Use for conceptual explainers, creative workflows, and maps that benefit from an artful but still readable tone.

## Palette

- Canvas: `#FAF3EB`.
- Ink: `#1A3C8F`.
- Surface: white.
- Sky accent: `#72D0E9`.
- Deep blue: `#1A3C8F`.
- Muted blue: `#6D7FA6`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, block title 20-24px, body 15-17px. Use short poetic labels, not paragraphs.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use floating panels, blue rules, circular lenses, and sparse accent blocks. Rounded rectangles 8-12px are fine. Keep connectors thin and graceful.

## Layout

Works well as a loose concept map, three-part explanation, or calm journey. Leave large breathing room between clusters.

## Avoid

Avoid dense tables, heavy black borders, and more than one large sky-blue fill per region.
