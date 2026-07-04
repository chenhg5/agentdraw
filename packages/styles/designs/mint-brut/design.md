---
version: 1.0
name: Mint Brut
provider: agentdraw
description: >
  A playful app-like brutalist style with mint canvas, candy accents, rounded cards,
  black borders, visible hard shadows, and stacked roadmap energy.
---

# Mint Brut

Use this style for product roadmaps, creator tools, early-stage plans, and optimistic workflow boards.

## Palette

- `canvas`: `#D0FDE4`.
- `ink`: `#000000`.
- `panel`: `#FFFFFF`.
- `pink`: `#F888C8`.
- `blue`: `#A7E7FF`.
- `green`: `#6DD89E`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

- Title: 34-40px, bold.
- Stage chip: 13-15px, bold, short uppercase.
- Card body: 22-26px, two short lines.
- Supporting row: 16-18px.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Components

- `stack-card`: rounded white or accent card, 3px black border, hard offset shadow.
- `stage-chip`: small rounded badge in the card corner.
- `roadmap-connector`: black arrow, slightly diagonal when it reinforces motion.
- `base-strip`: rounded summary strip at the bottom.

## Layout

Stagger cards vertically. Shadows can be colored and visible. Keep all text centered inside its card and give two-line labels generous height.

## Avoid

- subtle gray UI treatment;
- tiny captions;
- more than four roadmap cards in one row;
- shadows that obscure text.
