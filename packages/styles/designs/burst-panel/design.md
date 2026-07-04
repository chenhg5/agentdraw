---
version: 1.0
name: Burst Panel
provider: agentdraw
description: >
  A loud yellow dashboard style with panel bursts, lavender contrast, and strong action blocks.
---

# Burst Panel

## Intent

Use for energetic dashboards, launch rooms, campaign maps, and action plans.

## Palette

Canvas `#FBD65A`, ink `#1E1E1E`, pale yellow `#FFF2B6`, lavender `#CFACE8`, white, brown `#9D5A36`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-48px, panel title 22-28px, body 16-18px. Use command-like labels.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use large panel blocks, dark dividers, lavender focus cards, and high-contrast status chips. Strokes 3-4px.

## Layout

Works as a dashboard grid, campaign board, or action matrix. Use yellow as the field and white/lavender as readable surfaces.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid small text directly on yellow, gradients, and overly formal thin-line diagrams.
