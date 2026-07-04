---
version: 1.0
name: Jade Lens
provider: agentdraw
description: >
  A calm minimal green system for refined maps, service diagrams, and decision summaries.
---

# Jade Lens

## Intent

Use when the board should feel precise, quiet, and high-trust. Good for customer insights, service design, and product architecture.

## Palette

- Canvas: `#F5F1EE`.
- Ink: `#1E2421`.
- Main surface: white.
- Jade accent: `#2BA483`.
- Pale jade: `#D9ECE5`.
- Muted copy: `#6D7771`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 32-40px, section labels 17-20px, card body 15-17px. Use calm sentence case and avoid loud all-caps.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Prefer border-light cards, jade side rails, lens-like circular counters, and quiet table rows. Corners 8-12px are acceptable; strokes stay 1-2px.

## Layout

Use radial maps, service blueprints, or soft comparison matrices. Keep generous margins and avoid filling the canvas edge-to-edge.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid saturated multi-color blocks, heavy shadows, and dense labels on colored fills.
