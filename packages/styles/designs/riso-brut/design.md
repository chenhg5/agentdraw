---
version: 1.0
name: Riso Brut
provider: agentdraw
description: >
  A neo-brutalist editorial system with warm cream canvas, heavy ink borders,
  hard offset shadows, saturated color blocks, and bold explanatory structure.
---

# Riso Brut

Use this style for high-energy explanatory boards: launch plans, growth loops, bold strategy maps, and opinionated process diagrams.

## Palette

- `cream`: `#EFE9D9` for the canvas.
- `panel`: `#FFF8E8` for cards and readable body surfaces.
- `ink`: `#1E1B16` for borders, body text, and default shadows.
- `green`: `#1F8A4C` as the dominant accent.
- `pink`: `#F06CA8` as a high-energy secondary accent.
- `orange`: `#E85A1F` for featured shadows, numbers, or emphasis.

Use two or three accents per board. Do not use every bright color in every component.

## Typography

- Title: 36-48px, bold, compact.
- Stage label: 16-20px, bold, uppercase only when the label is short.
- Card title: 24-30px, bold.
- Body label: 16-18px.
- Keep text short and punchy. Wrap rather than shrinking below 16px.

## Geometry

- Corners are square: radius 0.
- Structural stroke: 3-4px ink.
- Cards can intentionally collide visually through color, but text and connectors must remain clear.
- Hard shadows are duplicate rectangles offset by 10-12px behind the real shape.
- Avoid blur, gradients, opacity, or soft shadows.

## Components

- `brut-card`: offset shadow, cream or accent fill, 4px ink border, 24px padding.
- `stage-banner`: saturated fill, ink border, short bold label.
- `stamp`: small square or pill badge used for numbers and tags.
- `connector`: thick straight connector, preferably horizontal, routed outside text boxes.
- `callout`: one large accent panel with a hard shadow; use sparingly.

## Layout

Good structures:

- strong left-to-right stages;
- poster-like quadrant map;
- chunky table with loud header;
- central thesis with surrounding proof blocks.

Leave more whitespace than the colors imply: at least 40px between major blocks and 24px between cards.

## Avoid

- subtle gray UI surfaces;
- thin 1px borders;
- small low-contrast labels;
- decorative noise that does not carry meaning.
