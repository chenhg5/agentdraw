---
version: 1.0
name: Lime Slab
provider: agentdraw
description: >
  An electric lime system with slab-like panels, strong black structure, and modern SaaS energy.
---

# Lime Slab

## Intent

Use for bold product architecture, growth systems, and high-energy operational diagrams.

## Palette

Canvas `#EEFA79`, ink `#0A0A05`, surface `#FFFFF2`, black accent, darker lime `#C6D938`, olive `#5F6B0E`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-48px, card title 21-26px, body 16-18px. Use clear product language.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use slab panels, thick black borders, rectangular status chips, and strong straight arrows. Corners 0-4px.

## Layout

Best for dashboards, system maps, and 4-6 block operating models. Let lime be the canvas; avoid filling every card with lime.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid low-contrast olive body text, gradients, and delicate thin-line aesthetics.
