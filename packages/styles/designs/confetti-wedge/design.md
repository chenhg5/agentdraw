---
version: 1.0
name: Confetti Wedge
provider: agentdraw
description: >
  A breezy celebratory pastel system using wedge-like blocks, rounded cards, and light motion.
---

# Confetti Wedge

## Intent

Use for onboarding, community flows, release celebrations, and lightweight workshop boards.

## Palette

Canvas `#F4F8FB`, ink `#1E252B`, surface white, pink `#F8BED4`, green `#62C0A5`, blue `#6F93D8`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 34-42px, card title 20-24px, body 15-17px. Keep labels bright but readable.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use rounded cards, small color wedges approximated with rectangles/diamonds, colored dot counters, and airy connectors.

## Layout

Best for journey maps, milestone boards, and lightweight pipelines. Scatter accents around content groups, not behind text.

## Avoid

Avoid literal confetti noise, too many tiny shapes, and low-contrast pastel text.
