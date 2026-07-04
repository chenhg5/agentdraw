---
version: 1.0
name: Long Table
provider: agentdraw
description: >
  A warm rustic single-ink system for long comparisons, menus, operating tables, and grouped lists.
---

# Long Table

## Intent

Use for content that should read like a crafted table, agenda, or field guide. It is structured and warm, not decorative.

## Palette

- Canvas: `#FAF1E2`.
- Rust ink and rules: `#B53D2A`.
- Light card: `#FFF8EE`.
- Soft divider: `#E8C4AF`.
- Deep label: `#5B3A2E`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 32-38px, row heading 18-22px, body 15-17px. Use medium-weight labels and compact descriptions.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use long horizontal rows, ruled sections, narrow badges, and table-like card stacks. Corners can be 0-6px. Use rust rules instead of heavy boxes.

## Layout

Best as a long table, timeline, checklist, or side-by-side comparison. Align columns carefully and keep row height consistent.

## Avoid

Avoid diagonal connectors, many accent colors, and tiny notes on the warm canvas.
