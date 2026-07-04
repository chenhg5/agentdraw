---
version: 1.0
name: System Formal
provider: agentdraw
description: >
  A clean product-diagram system for technical architecture, workflows, and operating maps.
  White canvas, square geometry, low ornament, precise connector routing, and compact sans text.
---

# System Formal

Use this style when the board should feel like a serious product or systems diagram rather than a sketch.

## Palette

- `canvas`: `#FFFFFF` for the page.
- `ink`: `#172033` for body text and structural borders.
- `panel`: `#F7F9FC` for cards, tables, and grouped surfaces.
- `accent`: `#2563EB` for primary headers, active paths, and emphasis.
- `accent2`: `#D8E5FF` for secondary surfaces.
- `muted`: use cool gray text only for labels and secondary notes.

## Typography

- Font family: use Excalidraw sans (`fontFamily: 2`) for readable multilingual text; avoid Virgil/handwritten text unless the user explicitly asks for it.

- Title: 32-40px, medium or bold, sentence case.
- Section heading: 18-22px, medium.
- Card title: 18-24px, medium or bold.
- Body label: 14-18px.
- Avoid all-caps except for tiny category labels.

## Geometry

- Corners are square or lightly rounded: 0-6px.
- Structural strokes are 2px.
- Keep roughness at 0.
- Use rectangles, tables, lanes, and elbow connectors.
- Avoid decorative stickers, torn paper effects, organic blobs, and large shadows.

## Components

- `system-card`: light panel fill, 2px ink border, 20-28px internal padding.
- `header-band`: accent fill, white text, 34-48px high.
- `lane`: thin bordered region with a compact header.
- `table`: restrained grid lines, 44-56px header row, 52-72px body rows.
- `connector`: elbow or straight connector, 2px stroke, arrowhead on the target side.
- `system-frame`: a thin outer boundary or titled region around architecture, layered system, and workflow diagrams so the board feels complete rather than floating on the canvas.

## Layout

Good structures:

- left-to-right pipeline;
- layered architecture;
- swimlane process;
- hub-and-spoke system map;
- comparison matrix.

Use an 8px spacing grid. Keep at least 32px between major regions and at least 16px between a connector and nearby text.

## Avoid

- palette-only restyling without layout changes;
- long paragraphs inside cards;
- hand-drawn roughness;
- connectors that cross card titles or table headers.
