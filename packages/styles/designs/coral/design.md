---
version: 1.0
name: Coral
provider: agentdraw
description: >
  A warm journey-map style with soft coral emphasis, rounded cards, and a broad signal band.
---

# Coral

Use this style for customer journeys, onboarding maps, activation funnels, and experience diagrams.

## Palette

- `canvas`: `#F5F0E8`.
- `ink`: `#1A1A1A`.
- `panel`: `#FFFFFF`.
- `coral`: `#E85D5D`.
- `coral-soft`: `#F4B1A3`.
- `muted`: `#6B5248`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

- Title: 34-38px.
- Step title: 20-23px.
- Step body: 15-17px, usually two lines.
- Summary strip: 16-18px.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Components

- `journey-band`: wide soft coral rounded band behind the path.
- `moment-card`: white rounded card with black border and centered copy.
- `signal-dot`: coral circle aligned to the journey path.
- `summary-panel`: dark strip with light text for the main insight.

## Layout

Alternate cards above and below the band. Keep the path readable and route arrows between card edges, not through body text.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

- hard brutalist shadows;
- too many metrics per card;
- long labels that turn the journey into a table.
