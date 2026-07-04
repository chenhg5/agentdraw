---
version: 1.0
name: Grove
provider: agentdraw
description: >
  A restrained editorial system on warm parchment with deep forest green as the main ink
  and a single terracotta accent for emphasis.
---

# Grove

Use this style for refined strategy, research, planning, and executive-summary boards.

## Palette

- `parchment`: `#E8E4D6` for the canvas.
- `panel`: `#F4EFE2` for cards and table bodies.
- `green`: `#192B1B` for body text, header bands, and structural emphasis.
- `coral`: `#C8524A` for one small warm spark.
- `muted`: `#766C58` for secondary labels.

Green is the main voice. Coral is rare: use it for a short rule, number, or small badge, not broad surfaces.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

- Title: 34-44px, medium or bold, editorial sentence case.
- Kicker: 15-17px, optional, muted or coral.
- Card title: 21-26px.
- Body: 16-18px.
- Favor calm phrasing and short lines.

## Geometry

- Mostly flat fills with few borders.
- Corners are square to lightly rounded: 0-8px.
- Strokes are 0-2px; use filled bands instead of heavy outlines.
- Avoid heavy shadows, rough hand-drawn effects, and noisy decoration.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Components

- `editorial-panel`: green fill with cream text, used for the main thesis or header.
- `paper-card`: parchment panel with green text and generous padding.
- `coral-rule`: short 3-4px horizontal rule used once per region.
- `quiet-table`: low-contrast body rows, green header, large row padding.
- `connector`: thin green connector, preferably straight or elbow, never crossing headings.

## Layout

Good structures:

- strategy map with a large thesis panel;
- research synthesis wall;
- operating cadence timeline;
- decision matrix.

Use wide margins. Keep density moderate and let the parchment show through.

## Avoid

- filling many blocks with coral;
- pure white panels;
- tiny captions on colored fills;
- playful sticker shapes.
