---
version: 1.0
name: Macchiato
provider: agentdraw
description: >
  A warm monochrome system with almond surfaces and espresso ink. Quiet, premium, and text-first.
---

# Macchiato

## Intent

Use when the diagram should feel mature and editorial: executive summaries, strategy maps, and calm operating models.

## Palette

- Canvas: `#EDE7DD`.
- Ink: `#25211B`.
- Card surface: `#F8F3EA`.
- Secondary rule: `#6E6558`.
- Soft fill: `#D2C6B7`.
- Deep caption: `#403B32`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, section heading 20-24px, body 16-18px. Use restrained contrast and avoid oversized novelty type.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use soft panels, thin rules, narrow label strips, and low-contrast tables. Corners 4-8px. Shadows should be absent or very hard and subtle.

## Layout

Works well for quadrant maps, decision trees, and executive one-pagers. Let negative space carry the design.

## Avoid

Avoid bright accent inserts, playful stickers, and noisy connector paths.
