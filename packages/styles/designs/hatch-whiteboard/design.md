---
version: 1.0
name: Hatch Whiteboard
provider: agentdraw
description: >
  A hand-drawn data whiteboard style with black ink, pastel hatch fills, dashed stage lanes,
  and readable lineage arrows. Best for data flow, warehouse layering, and governance visuals.
---

# Hatch Whiteboard

## Intent

Use for data lineage, ETL/ELT, MapReduce-like transforms, warehouse layering, governance before/after
boards, and explainers that should feel like a clear whiteboard sketch instead of a polished
corporate architecture diagram.

This style is intentionally informal. Do not use it for executive boardroom diagrams unless the
user explicitly wants hand-drawn whiteboard energy.

## Palette

- Canvas: `#FFFFFF`.
- Ink: `#111111`.
- Panel / paper: `#FAFAF5`.
- Cyan hatch: `#E8F7FA` or stroke accent `#9EDAE5`.
- Rose hatch: `#FCE7EC` or stroke accent `#F6D7DE`.
- Yellow hatch: `#FFF3C4`.
- Green hatch: `#E9F7E6`.
- Violet hatch: `#EEE7FF`.
- Orange hatch: `#FBE6D2`.
- Muted connector / label: `#5A5A5A`.

Use pastel fill colors to distinguish data states or layers. Do not turn them into bright category
blocks; the black ink structure should remain dominant.

## Typography

- Font family: use Excalidraw's hand-drawn font after import. In source SVG, prefer
  `Virgil, Comic Sans MS, Bradley Hand, Noto Sans SC, sans-serif`; keep text editable.
  For dense CJK labels, keep words short and increase font size rather than switching to tiny text.
  After import/repair, editable text should use Excalidraw `fontFamily: 5` so Chinese/Japanese/Korean
  glyphs can render through Xiaolai fallback. Do not use legacy `fontFamily: 1` as the target hand
  font.
- Title: 36-48px.
- Lane label: 24-32px.
- Node label: 18-24px.
- Detail label: 15-18px.

Labels should look casual but remain readable. Avoid tiny annotations below 15px.

## SVG Source Rules

- Generate restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`,
  `defs`, and `marker`.
- Avoid `pattern`, `filter`, gradients, `foreignObject`, screenshots, and text outlines.
- Approximate hatching with sparse explicit diagonal `line` elements inside a card when useful.
  Keep hatch lines light and subordinate to labels.
- Use `stroke-dasharray` for stage boundaries, layer boxes, and governance domains.
- Keep all labels real editable text.

## Components

- **Stage lane:** large dashed rectangle, no fill, black or muted stroke, large label near the bottom
  or top edge.
- **Table card:** small rectangle with pastel hatch fill, black stroke, centered short table/entity
  name.
- **Record bundle:** compact card with 2-4 line items for intermediate data records.
- **Governed layer:** horizontal or vertical band grouping related nodes into a readable lane.
- **Messy state:** free-positioned circles/cards with curved or diagonal arrows, used only for
  before-state chaos.
- **Clean state:** aligned lanes, fewer crossings, repeated node sizes, and calm routes.

## Layout Affinity

Strong pairings:

- `method/data-flow-whiteboard-patterns.md` D01 Transform Lanes.
- `method/data-flow-whiteboard-patterns.md` D02 Warehouse Layer Ladder.
- `method/data-flow-whiteboard-patterns.md` D03 Spaghetti To Structure.
- `method/data-flow-whiteboard-patterns.md` D04 Governance Swimlanes.

This style can also support `method/layout-styles.md` L04 Pipeline and L07 Timeline when the content
is data-oriented.

Treat these pairings as composition systems. Adapt the lane count and card count to the source, but
preserve the visible idea: transformation lanes, warehouse ladder, chaos-to-structure contrast, or
governance swimlanes. A plain grid of pastel rectangles does not satisfy this style.

## Connector Rules

- Use black `#111111` or muted `#5A5A5A` for ordinary connectors on white canvas.
- Connector colors may vary when they explain semantic flow, but they must stay darker than the
pastel fills and clearly visible against white.
- Many-to-one convergence is allowed in data lineage, but target nodes must be aligned and given
enough inbound spacing.
- Curved or crossing routes are allowed only in the "messy before" side of a before/after board.
- Target-state or explanatory routes should be mostly straight or orthogonal.
- Connector endpoints must touch node edges, not enter the middle of cards.
- Add one outer frame around the whole board so the sketch reads as a complete artifact, not loose
  shapes on a blank page.

## Avoid

- Emoji, decorative icons, and stock database symbols.
- Tiny labels or dense schema text.
- Random pastel assignment without semantic meaning.
- Full-page roughness that destroys alignment.
- Clean target-state diagrams with spaghetti arrows.

## Self-Check

Before importing, verify:

- The dominant reading direction is clear.
- Stage/layer labels are readable at thumbnail size.
- Repeated table cards share size within the same lane.
- Hatching does not compete with text.
- Messy arrows appear only when deliberately showing a bad current state.
- The target or final state is visibly calmer than the input/current state.
