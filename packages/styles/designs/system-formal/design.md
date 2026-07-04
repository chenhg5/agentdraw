---
version: 1.0
name: System Formal
provider: agentdraw
description: >
  A clean product-diagram system for technical architecture, workflows, and operating maps.
  White canvas, square geometry, low ornament, precise connector routing, and compact sans text.
colors:
  canvas: "#FFFFFF"
  ink: "#172033"
  panel: "#F7F9FC"
  accent: "#2563EB"
  accent2: "#D8E5FF"
  muted: "#64748B"
typography:
  title:
    fontFamily: Inter, Arial, Noto Sans SC, sans-serif
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.15
  heading:
    fontFamily: Inter, Arial, Noto Sans SC, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: Inter, Arial, Noto Sans SC, sans-serif
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.35
spacing:
  grid: 8px
  sectionGap: 40px
  cardGap: 20px
  cardPadding: 24px
rounded:
  card: 4px
  small: 4px
components:
  system-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    rounded: "{rounded.card}"
  header-band:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    borderColor: "{colors.accent}"
    rounded: "{rounded.small}"
  side-note:
    backgroundColor: "{colors.accent2}"
    textColor: "{colors.ink}"
    borderColor: "{colors.accent}"
    rounded: "{rounded.card}"
---

# System Formal

Use this style when the board should feel like a serious product, architecture, workflow, or
operating-system diagram rather than a sketch. It should read like a carefully designed product
document: quiet, square, aligned, and easy to scan.

System Formal is not just blue boxes. The style depends on visible information architecture:
frames, lanes, tables, section headers, matched card sizes, and restrained connector routing.

## Palette

- `canvas`: `#FFFFFF` for the page.
- `ink`: `#172033` for body text and structural borders.
- `panel`: `#F7F9FC` for cards, tables, and grouped surfaces.
- `accent`: `#2563EB` for primary headers, active paths, and emphasis.
- `accent2`: `#D8E5FF` for secondary surfaces.
- `muted`: use cool gray text only for labels and secondary notes.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available
  system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user
  explicitly asks for them.

- Title: 34-44px, medium or bold, sentence case.
- Section heading: 20-26px, medium.
- Card title: 20-24px, medium or bold.
- Body label: 15-19px; prefer 16-18px for Chinese or multilingual boards.
- Supporting note: 13-15px only when inside a quiet panel or footer strip.
- Avoid all-caps except for tiny category labels.
- Do not introduce generic success green, warning orange, or danger red unless the user explicitly asks for status semantics.
- Use at most four type sizes. If the board feels weak, add stronger grouping and spacing before
  adding more type sizes.

## Geometry

- Corners are square or lightly rounded: 0-6px.
- Structural strokes are 2px.
- Keep roughness at 0.
- Use rectangles, tables, lanes, and elbow connectors.
- Avoid decorative stickers, torn paper effects, organic blobs, and large shadows.
- For formal cards, never use pill-like radius. If a rectangle starts looking oval, reduce the
  radius to 0-6px.
- Use subtle fills and borders to create hierarchy. Do not rely on many saturated colored cards.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Components

- `system-card`: light panel fill, 2px ink border, 20-28px internal padding.
- `header-band`: accent fill, white text, 34-48px high.
- `lane`: thin bordered region with a compact header.
- `table`: restrained grid lines, 44-56px header row, 52-72px body rows.
- `connector`: elbow or straight connector, 2px stroke, arrowhead on the target side.
- `system-frame`: a thin outer boundary or titled region around architecture, layered system, and workflow diagrams so the board feels complete rather than floating on the canvas.
- `side-note`: small muted panel for assumptions, risk, or constraints; place it at the right or
  bottom, never between primary flow nodes.
- `module-row`: repeated cards with identical width and height, used for agents, services, skills,
  layers, or responsibilities.

## Layout

Good structures:

- left-to-right pipeline;
- layered architecture;
- swimlane process;
- hub-and-spoke system map;
- comparison matrix.

Use an 8px spacing grid. Keep at least 32px between major regions and at least 16px between a connector and nearby text.

Strong System Formal compositions:

- **Architecture frame**: one outer system boundary, 2-4 internal lanes, modules inside each lane,
  and elbow connectors only between lane edges.
- **Pipeline**: 4-7 equal cards in one row, one accent rail or header band, side notes below.
- **Layered map**: stacked full-width horizontal layers with short labels, not scattered boxes.
- **Comparison**: two or three matched columns with identical row heights and a footer decision bar.
- **Operating model**: central service/module with four surrounding capability groups; connectors
  attach to card edges, not card centers.

Rules that matter:

- Repeated modules in the same group must share x/y rhythm and dimensions.
- If a lane is wide, inner modules should use the available width deliberately. Avoid tiny centered
  boxes floating in a large lane.
- Use one outer frame for architecture/workflow boards. Do not create two global frames.
- Prefer orthogonal routing. Do not cross section headers or table heads.
- Put labels inside their own panels or beside connector segments with at least 16px clearance.
- Keep body text short. If a card needs paragraphs, turn the content into a table or report board.

## Self-Check

Before importing, render the SVG and inspect it:

- Does the board have one obvious title and one obvious system boundary or section structure?
- Are equal-rank cards equal width and aligned to the same x/y rhythm?
- Are wide lanes filled intentionally, or do small boxes leave excessive blank side margins?
- Are all connectors attached to shape edges or just outside them?
- Is the palette limited to the contract colors?
- Are Chinese and English labels readable at normal zoom?
- Does the result still look professional without hand-editing?

## Avoid

- palette-only restyling without layout changes;
- long paragraphs inside cards;
- hand-drawn roughness;
- large radius cards that look like pills;
- random success/warning/danger colors;
- small cards floating in huge containers;
- connectors that cross card titles or table headers.
