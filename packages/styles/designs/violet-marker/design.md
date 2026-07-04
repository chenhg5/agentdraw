---
version: 1.0
name: Violet Marker
provider: agentdraw
description: >
  A bright synthesis-wall style with clustered notes, marker colors, offset note shadows,
  and an explicit decision strip.
---

# Violet Marker

Use this style for research synthesis, interview clustering, brainstorm cleanup, and insight walls.

## Palette

- `canvas`: `#FFFFFF`.
- `ink`: `#171717`.
- `panel`: `#F8F4FF`.
- `violet`: `#C5A1FF`.
- `lime`: `#CFEE30`.
- `muted`: `#5E4A88`.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user explicitly asks for them.

- Title: 34-38px.
- Cluster title: 22-25px.
- Sticky note text: 13-15px, short phrases only.
- Decision strip: 16-18px.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Components

- `cluster-frame`: thin violet frame around a group.
- `sticky-note`: compact rounded note with hard colored shadow.
- `synthesis-arrow`: bold black arrow between clusters.
- `decision-strip`: final takeaway in a lime rounded panel.

## Layout

Use three clusters left to right: raw notes, themes, insights. Stagger notes inside the cluster, but keep them fully inside the frame.

## Connector Rules

Use style-matched connectors with enough clearance from labels and headers. Keep routes simple; reroute rather than crossing text.

## Avoid

- full paragraphs in sticky notes;
- notes extending outside their cluster;
- arrows crossing note text;
- using every bright color on every note.
