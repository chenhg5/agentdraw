---
version: 1.0
name: BlockFrame
provider: agentdraw
description: >
  A maximal candy sticker-book system with heavy black frames, bright blocks, and playful composition.
---

# BlockFrame

## Intent

Use for playful explainers, creator tools, and energetic concept maps where boldness is the point.

## Palette

Canvas `#FFFDF5`, ink black, surface white, pink `#FE90E8`, cyan `#C0F7FE`, yellow `#FCC715`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

Title 38-50px, card titles 22-28px, body 16-18px. Short punchy text only.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

Use thick black borders, sticker-like cards, hard colored shadows, large badges, and framed regions. Rounded corners 8-14px.

## Layout

Best for 3-5 chunky blocks with visible overlap. Make overlap intentional and keep text clear.

## Avoid

Avoid tiny captions, subtle muted palettes, and covering connectors with stickers.
