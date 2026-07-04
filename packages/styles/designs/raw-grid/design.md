---
version: 1.0
name: Raw Grid
provider: agentdraw
description: >
  A sharp digital brutalist grid style with black structure, pale surfaces, and strict alignment.
colors:
  canvas: "#FFFFFF"
  ink: "#0A0A0A"
  panel: "#F8F8F8"
  accent: "#0A0A0A"
  accent2: "#F2D4CF"
  muted: "#5B5B5B"
typography:
  title:
    fontFamily: Inter, Arial, Noto Sans SC, sans-serif
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.1
  section:
    fontFamily: Inter, Arial, Noto Sans SC, sans-serif
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: Inter, Arial, Noto Sans SC, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.35
spacing:
  grid: 8px
  sectionGap: 40px
  cardGap: 16px
  cardPadding: 24px
rounded:
  card: 0px
  small: 0px
components:
  phase-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    headerBackground: "{colors.ink}"
    headerText: "{colors.canvas}"
    rounded: "{rounded.card}"
  note-card:
    backgroundColor: "{colors.accent2}"
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    rounded: "{rounded.card}"
---

# Raw Grid

## Intent

Use Raw Grid for technical specs, operating maps, issue boards, roadmap memos, and dense
explainers that should feel designed, native, and exact. This style should look like a sharp
editorial system board, not a generic flowchart.

The design should be recognizable even if all text is changed: hard black structure, strict grid,
large section bars, repeated modules, and one or two pale highlight fills.

## Palette

- `canvas`: `#FFFFFF`.
- `ink`: `#0A0A0A` for titles, borders, header bars, and connectors.
- `panel`: `#F8F8F8` for quiet cells and secondary blocks.
- `accent`: `#0A0A0A` for black title bands, axis bands, and primary structure.
- `accent2`: `#F2D4CF` for one meaningful contrast group, risk side, or negative column.
- `muted`: `#5B5B5B` for small notes only.

Use color as structure, not decoration. A strong Raw Grid board usually needs white, black,
`#F8F8F8`, and one pale fill. Do not introduce green/orange/red status colors unless the user
explicitly asks for status semantics.

## Typography

- Font family: in source SVG use `Inter, Arial, Noto Sans SC, sans-serif` or the closest available
  system sans. Keep text as real `<text>`/`<tspan>` and avoid handwritten fonts unless the user
  explicitly asks for them.
- Title: 40-54px, bold, left aligned.
- Section title: 20-28px, bold, usually white text on a black bar.
- Card heading: 16-22px, bold.
- Body: 12-16px for dense boards, 16-18px for Chinese or user-facing summaries.
- Small labels: 11-13px only inside high-contrast panels.

Use at most four type sizes. Avoid centered paragraphs; Raw Grid reads best with left-aligned
labels, numbers, and short line stacks.

## SVG Source Rules

- Generate this style as restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`, `defs`, and `marker` for editable boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for centered labels. Use `tspan` with explicit `x` and `dy` values for multiline labels.
- Put connector endpoints on the edge of shapes or just outside them. Do not start or end arrows deep inside cards.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.

## Geometry And Components

- Corners are square: `rx="0"` unless a tiny 2-4px radius is needed for browser rendering.
- Borders are visible: 2-3px black for major modules, 1-2px for internal rows.
- Hard offset shadows are allowed for emphasis: duplicate the same rectangle 8-12px down/right in
  black, then place the real card above it. Mark shadow elements as decorative if possible.
- Header bands are structural: a 42-58px black bar at the top of a panel creates hierarchy.
- Tables, phase cards, dependency strips, and boxed memos are preferred over floating small cards.
- Use arrows sparingly. Raw Grid usually looks stronger with a single axis, dependency strip, or
  table relationship than with many crossing connectors.

## Layout

Work in a logical SVG around 1500-1700px wide. Snap x/y/width/height to a 4px or 8px grid.

Strong Raw Grid compositions:

- **Report board**: title block, thick black divider, 2-column or 3-column section grid, bottom
  summary strip.
- **Phase roadmap**: 2 x 3 phase cards, each with a black header band; add a dependency strip below.
- **Tier list**: 3 equal columns with header bars and repeated full-width rows.
- **Comparison board**: left/right panels with matched row heights and one pale contrast fill.
- **System memo**: top axis band, central modules, bottom risk/decision table.

Rules that matter:

- Repeated cards in the same row should share the same y, height, and width.
- Repeated cards in the same column should share the same x and width.
- Inner cards should use the lane deliberately; avoid tiny cards floating inside wide panels.
  Target 70-95% of the lane width unless the small size encodes meaning.
- Major regions need 32-56px gaps. Internal rows need 10-18px gaps.
- Prefer one strong reading path over many arrows.
- A dense board can be tall. Do not squeeze a report-style board into a fixed 16:9 canvas.

## Self-Check

Before importing, render the SVG and inspect it:

- Does the board still look designed when zoomed out?
- Are repeated cards aligned to shared x/y positions?
- Are equal-rank cards equal width?
- Are inner cards using their columns, or are they floating with excessive side whitespace?
- Is there one clear title and two to five visible regions?
- Are all non-palette colors intentional?
- Are there any emoji, decorative icons, or prompt/meta text on the canvas?

## Avoid

- palette-only restyling of a generic diagram;
- rounded playful cards or pill buttons;
- many small disconnected cards scattered across whitespace;
- random semantic green/orange/red;
- weak gray hairline boxes without black structure;
- decorative emoji or icon bullets;
- arrows crossing titles, headers, or body text.
