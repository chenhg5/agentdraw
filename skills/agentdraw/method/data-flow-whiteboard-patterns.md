# Data Flow Whiteboard Patterns

Use this file for editable SVG whiteboards that explain data lineage, ETL/ELT pipelines, data
warehouse layering, MapReduce-like transforms, and data governance. These patterns intentionally
borrow from hand-drawn Excalidraw examples: loose enough to feel explanatory, but structured enough
to remain readable and editable.

Use Mermaid only when the user asks for a strict flowchart or a small linear pipeline. Use these SVG
patterns when the diagram needs stages, grouping boxes, many-to-one lineage, before/after structure,
or a visual story about data chaos becoming governed data architecture.

These are layout patterns, not rigid templates. Keep the named composition device, but adapt
proportions, stage count, node count, and emphasis to the source. The goal is a memorable data
explanation, not a screenshot of the example.

## Universal Rules

- Pick one dominant direction: left-to-right for transformation and lineage, top-to-bottom for
  governance maturity or responsibility layers.
- Use large dashed boundaries to mark stages, data layers, trust zones, or governance domains.
- Keep every stage label visible outside or at the edge of its dashed boundary.
- Keep node labels short. For table-like nodes, use one strong name plus one optional metadata line.
- Use connector color freely only when it improves meaning. The line must still contrast with the
  canvas and node strokes.
- Prefer 5-10 meaningful nodes over a complete dependency dump.
- Use messy/curved arrows only when explicitly showing a bad current state. The proposed or target
  state should use aligned, calmer routing.
- If using a hand-drawn style, use roughness and hatch fills for warmth, but still align stage
  boundaries and repeated nodes.
- Add one outer frame around the whole board unless the chosen design style explicitly forbids it.
- Keep hand-drawn typography readable. For `hatch-whiteboard`, conversion/repair should produce
  Excalidraw hand font (`fontFamily: 5`), with CJK characters rendered through Xiaolai fallback.
- Prefer one visual argument per board: "records become features", "raw tables become trusted
  products", "spaghetti becomes governed structure", or "ownership turns data into trust".
- Do not use the data-whiteboard patterns as plain card walls. Each board needs a visible
  composition move: lanes, ladder, before/after contrast, or swimlane trust path.

## D01 Transform Lanes

Use for MapReduce, ETL, batch jobs, data cleaning, feature generation, or any pipeline where records
split, transform, group, and reduce.

Structure:

```text
Input lane -> split/extract lane -> transform lane -> shuffle/group lane -> reduce/serve lane -> output
```

Rules:

- Draw each stage as a vertical dashed boundary with a short handwritten-style label at the top.
- Put small record/table cards inside each stage. Cards in the same stage share width.
- Many-to-one connectors are allowed, but keep their targets aligned so convergence reads clearly.
- Use distinct soft fills for record states, not random colors.
- Place final output in a clean card on the far right so the reader can see the value of the process.

Best styles: `hatch-whiteboard`, `pin-and-paper`, `soft-pop`, `manual-cream`, `raw-grid`, `system-formal`.

## D02 Warehouse Layer Ladder

Use for data warehouse layering, ODS/DWD/DIM/DM/APP, bronze/silver/gold, semantic layer, or data
product dependency maps.

Structure:

```text
Layer boundary 1: raw/source tables
Layer boundary 2: cleaned/detail tables
Layer boundary 3: model/aggregate tables
Layer boundary 4: app/consumer outputs
Optional side or bottom boundary: dimensions/reference data
```

Rules:

- Make layer boundaries the main structure. Labels such as ODS/DWD/DIM/DM/APP should be large and
  readable.
- Within a layer, repeated table cards share size and x/y rhythm.
- Show convergence from many tables to fewer curated tables, then to user-facing outputs.
- Put DIM/reference data in a side or lower auxiliary boundary when it feeds multiple layers.
- Avoid showing every table. Show representative tables that explain why layering matters.

Best styles: `hatch-whiteboard`, `pin-and-paper`, `runtime-doc`, `blueprint-formal`, `system-formal`, `infra-dark`.

## D03 Spaghetti To Structure

Use for before/after governance, platform refactors, dependency cleanup, ownership cleanup, or
current-state vs target-state narratives.

Structure:

```text
Left panel: messy network, tangled dependencies, weak boundaries
Center arrow: governance / layering / ownership / platform intervention
Right panel: layered lanes, grouped domains, calmer routes
Bottom labels: before state and governed state
```

Rules:

- The left side may intentionally use curved, crossing, or uneven routes to express chaos.
- The right side must be visibly calmer: aligned rows, clear groups, fewer crossing arrows.
- Use the same color set on both sides so the improvement comes from structure, not unrelated
  palette changes.
- The center intervention arrow should be large and labeled with the actual governance move.
- This pattern is especially useful for article images because the visual argument is obvious at a
  glance.
- The contrast must come from layout, not just color: tangled, uneven, and crossing on the left;
  repeated sizes, aligned rows, and fewer routes on the right.

Best styles: `hatch-whiteboard`, `pin-and-paper`, `manual-cream`, `riso-brut`, `boardroom`, `runtime-doc`.

## D04 Governance Swimlanes

Use for explaining how data governance separates domains, quality checks, lineage, ownership, and
consumption.

Structure:

```text
Top or left: raw signals / tables / producers
Middle stacked lanes: validation, modeling, ownership, lineage, serving
Right or bottom: trusted consumers / apps / decisions
```

Rules:

- Use stacked horizontal bands when governance stages happen in order.
- Use side badges for ownership, SLA, quality, or policy metadata.
- Make validation/policy flows visually secondary unless they are the subject.
- Do not turn governance into a wall of process boxes. The board should reveal how trust improves.

Best styles: `hatch-whiteboard`, `runtime-doc`, `boardroom`, `blueprint-formal`, `pin-and-paper`, `system-formal`.

## Required Note

Before generating SVG, write:

```text
Data whiteboard pattern: <Dxx name> because <reason tied to data structure>.
Design style: <style-id> because <reason tied to audience and tone>.
Main flow direction: <left-to-right | top-to-bottom | before-after>.
Connector strategy: <calm structured routes | intentionally messy before-state | semantic line colors>.
```
