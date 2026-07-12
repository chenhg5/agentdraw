# Layout Styles

Layout style is separate from design style. Design style controls visual language. Layout style
controls information structure.

For SVG explanatory visuals, choose one locked layout style before drawing. Do not invent a new page
structure unless none of these fit.

This file covers formal explanatory structures. For article images, document配图, public review
visuals, thinking notes, and magazine-like boards, prefer `editorial-layouts.md` when a normal
layout would become a generic card wall.

## L01 Contrast Split

Use for old vs new, problem vs solution, weak vs strong, before vs after.

Structure:

```text
Header claim
Left panel: old/problem/weak state
Center bridge: shift, cause, or intervention
Right panel: new/solution/strong state
Bottom strip: implication or rule
```

Rules:

- left and right panels should have matching dimensions;
- bridge should be visually smaller than the panels but highly salient;
- use 2-3 bullets per side, not paragraphs;
- avoid making the bridge a vague arrow without words.

## L02 Center Mechanism

Use for "why this happens", causal mechanisms, failure modes, and operating principles.

Structure:

```text
Header claim
Center: main mechanism or engine
Around: 3-5 causes, controls, effects, or constraints
Bottom/right: takeaway
```

Rules:

- center object must be the visual anchor;
- surrounding items should align to a ring, grid, or cardinal directions;
- connectors point inward or outward consistently;
- do not create a random mind map with unequal spacing.

## L03 Layered Stack

Use for architecture, responsibility, abstraction, foundations, and capability layers.

Structure:

```text
Outer boundary
Top: entry or user-facing layer
Middle: orchestration / capability layers
Bottom: state, data, observability, external dependencies
Side notes: constraints or ownership
```

Rules:

- 3-6 layers only;
- each layer has a clear responsibility label;
- same-rank modules share width and height;
- external systems sit outside the owned boundary.

## L04 Pipeline

Use for transformation workflows and agent/runtime loops that are mostly linear.

Structure:

```text
Input -> step -> step -> step -> output
Support layer below: state, validation, observability, policy
```

Rules:

- primary rail should be obvious at thumbnail size;
- support layer should not compete with the main rail;
- use sparse connectors;
- use Mermaid instead if the task is a formal flowchart with many decisions.

## L05 Loop / Flywheel

Use for feedback loops, quality loops, compounding systems, and operating rhythms.

Structure:

```text
Circular or rounded cycle: 4-6 stages
Center: what compounds, degrades, or is optimized
Side callout: leverage point or failure mode
```

Rules:

- all stages should have similar visual weight;
- do not use more than 6 stages;
- arrows should follow one direction;
- center label must explain why it is a loop.

## L06 Matrix

Use for tradeoffs, comparisons, capability maps, and decision frames.

Structure:

```text
Title claim
2x2, 3-column, or 3-row matrix
Highlighted recommendation or insight
Bottom: decision rule
```

Rules:

- axes or columns must be meaningful, not decorative;
- repeated cells share dimensions;
- highlight only one region unless the source demands multiple categories;
- avoid dense tables; use Mermaid or a real table when exact data matters.

## L07 Timeline

Use for evolution, migration, phases, release sequence, or historical argument.

Structure:

```text
Title claim
Horizontal or vertical time rail
3-6 milestones
Side/bottom: inflection point or lesson
```

Rules:

- use Mermaid timeline when standard timeline grammar is enough;
- use SVG timeline when visual emphasis and custom grouping matter;
- milestones should have equal rhythm;
- make the inflection point visually obvious.

## L08 Orbit Map

Use for concept landscapes, ecosystems, actors, forces, or principles around one core idea.

Structure:

```text
Center: core idea
Orbit: 4-6 actors/forces/principles
Outer frame or legend: boundary and takeaway
```

Rules:

- center object must be larger or stronger than orbit items;
- orbit spacing should be deliberate;
- avoid crossing connectors;
- do not use this for sequential processes.

## L09 Assertion Pillars

Use for slide-like single-page visuals, leadership review, and argument summaries.

Structure:

```text
Assertion headline
Subhead context
2-4 pillars
Proof/detail strip
Closing implication
```

Rules:

- headline must be an assertion, not a topic label;
- 2-4 pillars only;
- all pillar cards share dimensions;
- if the content is a full deck, AgentDraw should only create one editable visual page.

## L10 Hero Evidence

Use for article hero images, review summaries, and source material with one strong claim plus
supporting proof.

Structure:

```text
Large left/top headline claim
Short supporting statement
Right/bottom evidence zone: 2-4 compact proof cards, metrics, or source facts
Final implication strip
```

Rules:

- headline region should occupy at least 30% of the canvas;
- proof cards should be subordinate to the claim;
- use one accent metric or phrase, not many competing numbers;
- avoid turning the evidence zone into a generic three-card row.

## L11 Bento Brief

Use for compact briefings where several facets matter but one hierarchy must remain obvious.

Structure:

```text
Title claim
One large anchor tile
2-5 smaller supporting tiles
Footer rule, recommendation, or next step
```

Rules:

- one tile must clearly be the anchor;
- smaller tiles align to a strict grid and share gutters;
- each tile should answer a different question;
- do not use bento when the content is a sequential process.

## L12 Decision Ladder

Use for maturity models, recommendation paths, escalation, prioritization, and "from X to Y"
strategic narratives.

Structure:

```text
Title claim
3-5 ascending steps
Side rail: criteria, risks, or unlocks
Top/end state: recommended target
```

Rules:

- each step should be visibly higher, stronger, or more complete than the previous one;
- labels should describe state changes, not generic phases;
- side rail should explain decision criteria;
- use Mermaid flowchart instead when the task is a formal branching process.

## L13 Scenario Matrix Whiteboard

Use for technical teaching visuals where one mechanism must be explained through several scenarios,
conditions, cases, failure modes, or traffic/session paths.

Structure:

```text
Title mechanism
One-line explanatory subtitle
2x2, 1x3, or 2x3 scenario panels
Each panel: numbered scenario title + mini-diagram + Result note
Bottom rule-of-thumb strip
```

Rules:

- Use this when the source naturally contains "case 1 / case 2", "if / when", "active/passive vs
  active/active", "normal vs failover", "hit vs miss", "before vs after", or "what happens when...".
- Keep scenario panels equal size and aligned to a strict grid.
- Repeat the same conceptual nodes in roughly the same panel positions so differences are visible.
- Use path color to encode behavior, not decoration. Recommended semantic mapping with
  `marker-lesson`: green active/chosen, blue normal/new flow, red failed/old/backup/problem, orange
  control/DNS/external decision.
- Every panel must include a `Result:` sentence at the bottom that explains the outcome.
- The bottom rule strip should summarize the lesson across all scenarios.
- Prefer `marker-lesson` for teaching-board visuals. Use `hatch-whiteboard` when the subject is
  specifically data lineage or data governance.
- Do not use this as a generic card matrix. Each cell needs a real mini-diagram, path, state
  transition, or topology.
- Do not use Mermaid unless the user asked for a formal flowchart. This layout is for explanation,
  not strict diagram grammar.

## Required Note

Before generating SVG, write:

```text
Layout style: <Lxx name> because <reason tied to the source structure>.
```

## Anti-Patterns

- defaulting to three cards for every source;
- mixing two layout styles without a reason;
- using a layout because it looks good rather than because it fits the source;
- changing colors while leaving the same weak layout;
- making tiny centered cards float inside wide lanes.
