---
version: 1.0
name: Marker Lesson
provider: agentdraw
description: >
  A hand-drawn technical teaching-board style with marker typography, scenario panels,
  network/process mini-diagrams, semantic arrows, and short result notes.
---

# Marker Lesson

## Intent

Use for technical teaching visuals where a reader needs to compare several scenarios, failure modes,
traffic paths, routing choices, caching outcomes, security paths, or system behaviors.

This style should feel like a careful engineer explaining a mechanism on a whiteboard: loose enough
to be approachable, structured enough that every path and scenario can be trusted.

Best uses:

- network/security traffic-flow examples;
- cache hit/miss/failover scenarios;
- active/passive vs active/active behavior;
- queue retry, backpressure, and timeout examples;
- "what happens when..." technical article images;
- side-by-side protocol or runtime behavior cases.

## Palette

- Canvas: `#FFFFFF`.
- Ink: `#20242C` or `#111111`.
- Panel fill: `#F7FAFC`.
- Title marker: `#0F7C80`.
- Quiet panel tint: `#EAF8F7`.
- Muted annotations: `#6B7280`.
- Normal/new flow blue: `#1874B8`.
- Active/chosen path green: `#1F8A4C`.
- Failed/problem/backup red: `#D33F49`.
- DNS/control/external orange: `#D97706`.
- Soft fills: `#EEF6FF`, `#EAF8EC`, `#FFF7E6`, `#FFF0F0`, `#DCEEF0`, `#D8ECFF`, `#FFE3B0`, `#DDF4E4`, `#F9D7D9`.

Use color semantically. Do not assign blue, green, red, and orange randomly:

- green means active, selected, healthy, chosen, or forward path;
- blue means normal client traffic, new session, or secondary valid path;
- red means failed, old state, blocked, passive, backup-only, or risk;
- orange means DNS, control plane, external routing, policy choice, or operator decision.

## Typography

- Use Excalidraw hand font after import. In source SVG, prefer
  `Virgil, Xiaolai, Comic Sans MS, Bradley Hand, Noto Sans SC, sans-serif`.
- After import/repair, editable text should use Excalidraw `fontFamily: 5`.
- Title: 36-48px, teal marker color.
- Subtitle: 18-23px, dark ink, one or two lines.
- Scenario heading: 24-32px.
- Node label: 17-23px.
- Arrow annotation: 14-18px.
- Result note: 16-20px.

Use short, conversational labels. A node can have two lines, but avoid paragraphs inside nodes.
Move explanation into a `Result:` line at the bottom of the scenario panel.

## SVG Source Rules

- Generate restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `text`,
  `tspan`, `defs`, and `marker`.
- Keep all labels real editable text.
- Use large rounded scenario panels with dark marker strokes.
- Use semantic arrow colors with arrowheads. Dashed red arrows are allowed for backup, failed, old,
  or unavailable paths.
- Add small arrow annotations near the path, offset from the line. Do not place labels directly on
  top of arrows.
- Avoid gradients, filters, screenshots, icons, and emoji.

## Components

- **Scenario panel:** rounded white or very light panel with dark hand-drawn stroke. It contains one
  numbered heading, one mini-diagram, and one result note.
- **Endpoint node:** small rounded rectangle or ellipse with short label and optional IP, role, or
  state line.
- **Core component:** neutral gray rounded rectangle for routers, gateways, cores, queues, or
  services.
- **External circle:** light blue or white ellipse for Internet, client, third-party, or outside
  actor.
- **State node:** green for active/selected, blue for alternate active, red for failed/passive, and
  orange for control/external choice.
- **Result note:** a bottom text block beginning with `Result:` and explaining the scenario in one
  or two short sentences.
- **Rule strip:** a bottom board-level note summarizing the rule of thumb across scenarios.

## Layout

Strong pairings:

- `method/layout-styles.md` L13 Scenario Matrix Whiteboard.
- `method/technical-diagram-patterns.md` T06 Network / Security Topology when the subject is network
  or traffic routing.
- `method/technical-diagram-patterns.md` T05 Data Flow Spine when the subject is data/cache/session
  behavior.

For a scenario matrix:

- Use 2x2 for four cases, 1x3 for three cases, or 2x3 for five to six cases.
- Keep repeated nodes in roughly the same position across panels so the reader sees what changed.
- Keep panel sizes equal.
- Put result notes in the same vertical position in every panel.
- Put the rule-of-thumb strip outside the panels at the bottom.
- Each panel should contain fewer than 8 nodes and fewer than 8 arrows.

## Connector Rules

- Arrows must touch node edges or sit just outside them; do not start or end in the middle of a node.
- Use curved or diagonal arrows only when they clarify traffic direction inside a scenario panel.
- Use dashed red for failed, old, backup-only, or unavailable paths.
- Keep arrow labels 6-12px away from the path.
- Never cross a scenario heading or result note with arrows.
- If two return paths overlap, stagger them by at least 10px and label only the important one.

## Avoid

- Generic card grids without mini-diagrams.
- Treating colors as decoration instead of semantic path encoding.
- Dense paragraphs inside nodes.
- Tiny annotation text under 14px.
- Perfect corporate geometry; this style should keep a marker-board feel.
- Loose scribbles that break alignment between repeated scenarios.
- Emoji or decorative icons.

## Self-Check

Before importing, verify:

- The title states the mechanism, not just the topic.
- Every scenario panel has a numbered heading and `Result:` note.
- The same conceptual node appears in roughly the same place across panels.
- Green, blue, red, and orange have consistent meanings.
- The bottom rule strip summarizes what the examples prove.
- The board is readable as a thumbnail.
