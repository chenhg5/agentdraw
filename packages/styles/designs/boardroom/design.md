---
version: 1.0
name: Boardroom
provider: agentdraw
description: >
  A precise executive command-board style for incidents, operating reviews, and decision maps.
  Quiet surfaces, strong hierarchy, and status panels that read quickly.
---

# Boardroom

Use this style when the audience needs to scan priority, ownership, status, and next action quickly.

## Palette

- `canvas`: `#FFFFFF`.
- `ink`: `#182230` for primary text and major structure.
- `panel`: `#F8FAFC` for operational cards.
- `accent`: `#4053D6` for active status and routed flow.
- `accent2`: `#E7EEF8` for selected cards or timeline surfaces.
- `muted`: `#667085` for timestamps, labels, and secondary facts.

## Typography

- Font family: use Excalidraw sans (`fontFamily: 2`) for readable multilingual text; avoid Virgil/handwritten text unless the user explicitly asks for it.

- Title: 32-38px, bold, direct.
- Status headline: 28-36px, bold, short.
- Card title: 20-24px.
- Fact rows: 15-17px.
- Use sentence case. Avoid playful copy.

## Components

- Use an outer frame, titled canvas boundary, or large enclosing region for architecture, operating-model, and layered diagrams.

- `command-panel`: dark ink fill, white text, one primary status chip.
- `decision-card`: light panel, 2px border, title plus two fact lines.
- `timeline`: one compact horizontal row with timestamps.
- `route`: elbow or straight connector, accent stroke, no crossing status text.

## Layout

Put the most urgent status block on the left. Put decision cards in a 2x2 grid to the right. Use a bottom timeline for temporal context.

## Avoid

- decorative shadows;
- bright multi-accent fills;
- dense paragraphs;
- connectors through titles.
