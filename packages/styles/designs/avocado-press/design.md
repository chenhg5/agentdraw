---
version: 1.0
name: Avocado Press
provider: agentdraw
description: >
  A clean duotone system with blue structure and lime emphasis. Best for calm product explainers,
  process maps, and lightweight technical diagrams.
---

# Avocado Press

## Intent

Use for clear, friendly diagrams that need freshness without becoming playful. It should feel like a well-edited product brief.

## Palette

- Canvas: white.
- Ink and primary structure: `#0055A4`.
- Light surface: `#F4FAEE`.
- Lime emphasis: `#DCF4A2`, used as highlight blocks, not as body text.
- Dark neutral: `#1A1A1A` only for tiny contrast anchors.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 32-38px, card titles 20-24px, body labels 15-17px. Use sentence case. Keep body lines short.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use rounded cards with 6-10px radius, thin blue borders, lime tags, and clean straight connectors. A good component is a white card with a small lime header tab.

## Layout

Works well as a 3-5 step pipeline, feature map, or onboarding flow. Leave at least 28px between cards and 18px internal padding.

## Avoid

Do not overuse lime, use roughness, or place blue text on lime without enough size and contrast.
