---
version: 1.0
name: Salmon Stamp
provider: agentdraw
description: >
  A clean stamped-poster system with salmon and green accents, useful for compact playful explainers.
---

# Salmon Stamp

## Intent

Use when a board needs a little charm but must remain direct and readable.

## Palette

- Canvas: white.
- Ink: `#1A1A1A`.
- Pale salmon surface: `#FFF3F0`.
- Salmon accent: `#F0AE9E`.
- Green accent: `#049550`.
- Deep green label: `#35483C`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 32-40px, stamp labels 15-18px, body 15-17px. Short uppercase labels can work for stamps.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use stamp-like badges, bordered cards, small green verification marks, and simple flow arrows. Rounded corners 6-10px. Light roughness is acceptable.

## Layout

Good for four-step guides, onboarding notes, and small system explainers. Use salmon as a background mark, green as the action or success mark.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

Avoid using salmon and green equally everywhere; pick one dominant accent and one punctuation accent.
