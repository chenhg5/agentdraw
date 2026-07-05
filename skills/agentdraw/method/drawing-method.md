# AgentDraw Drawing Method

Use this method before choosing a visual style. A design style controls how the board looks; a
playbook controls how the information is organized.

AgentDraw's primary job is to turn text into an editable visual explanation. Do not treat it as a
general-purpose poster, web page, slide deck, or arbitrary design generator.

## Decision Order

1. Extract the source's core message: what should the reader remember?
2. Identify the communication job and audience.
3. Choose a visual expression pattern.
4. Select one scene playbook.
5. Select one design style that fits the audience and tone.
6. Plan the layout before writing SVG or Mermaid.
7. Generate restricted SVG or Mermaid.
8. Convert, repair, validate, export, inspect, and revise.

Never skip from prompt directly to a style. If the core message or expression pattern is wrong, a
beautiful style will still produce a weak board.

## Primary Mission

For article, document, technical-note, or review-brief inputs, the default mission is:

```text
source text -> one core message -> one visual expression pattern -> one editable visual explanation
```

The final board should help a reader understand or discuss the source. It should not summarize every
paragraph, create a generic card wall, or behave like a full slide deck.

## Visual Expression Patterns

Pick one pattern before drawing:

- **Contrast:** old vs new, problem vs solution, weak vs strong, before vs after.
- **Mechanism:** center mechanism with causes, effects, and annotations.
- **Loop:** flywheel, feedback loop, quality loop, operating cycle.
- **Ladder:** maturity, progression, escalation, levels of abstraction.
- **Stack:** layers, foundations, dependencies, responsibility bands.
- **Map:** landscape, zones, actors, forces, boundaries.
- **Matrix:** tradeoffs, decision frame, capability comparison.
- **Timeline:** evolution, phases, release sequence, migration path.
- **Worked example:** concrete mini case, formula, token sequence, or lesson.

If no pattern fits, use `article-visual.md` to invent a simple contrast or mechanism. Avoid defaulting
to three equal cards.

## Scene Intent Classes

- Article/doc/review visual: start with `article-visual.md`.
- Explain a system structure inside the article: adapt `layered-architecture.md`.
- Explain a sequence or process inside the article: adapt `technical-flowchart.md`.
- Teach a concept through a concrete example: adapt `teaching-board.md`.
- Explicit slide/deck request only: use `ppt-visual.md`.
- Compare choices, before/after states, or tradeoffs: use `comparison-map.md` when available; until
  then, adapt `article-visual.md`.

## Layout Planning Template

Before writing SVG, write a short plan:

```text
Scene: <playbook id>
Audience: <engineers / executives / learners / broad readers>
Reader question: <what should the reader understand in 5 seconds?>
Main message: <one sentence>
Expression pattern: <contrast / mechanism / loop / ladder / stack / map / matrix / timeline / worked example>
Reading path: <top-down / left-right / hub-spoke / before-after / timeline>
Regions:
- <region name>: <purpose>, <approx width/height>, <items>
- <region name>: <purpose>, <approx width/height>, <items>
Connectors: <main flows only; avoid secondary clutter>
Style: <style id> because <reason>
Risks: <likely layout failure to avoid>
```

## Universal Composition Rules

- Make one idea memorable. A good article visual has a point of view, not just labeled boxes.
- Use one primary reading path. A board with multiple competing paths feels scattered.
- Use visible regions for groups: lanes, bands, columns, panels, or a system boundary.
- Keep equal-rank objects equal in size unless size encodes importance.
- Align cards to shared x/y coordinates and repeat spacing rhythm.
- Use whitespace as structure. Related items sit closer together; unrelated items need stronger
  separation.
- Choose one visual emphasis: color, size, weight, or enclosure. Do not use all four on the same
  idea.
- Keep connector lines sparse. A reader should understand the diagram before tracing every arrow.
- Prefer direct labels over icons. Avoid emoji unless the user explicitly asks for a playful board.
- Use 4/8/16px coordinate rhythm for SVG. Random drift is visible.
- Write text as edit-friendly labels. Avoid long paragraphs inside cards.
- Do not make every output a three-card row. Three cards are acceptable only when the article's
  argument is genuinely three parallel pillars.

## SVG Layout Heuristics

- Canvas: start around 1200x800 for article and architecture boards; 1280x720 for slide-like boards;
  1000x1000 for dense teaching boards.
- Outer margins: 48-80px.
- Section gaps: 28-48px.
- Card padding: 16-24px.
- Card text: headings 18-24px, body 14-18px, title 34-44px.
- Chinese or multilingual boards usually need larger body text and wider cards than English boards.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` only for short labels. Use left-aligned
  multiline text for explanatory cards.

## Revision Checklist

Ask these questions after exporting a PNG:

- Can the reader state the main message in 5 seconds?
- Does the board reveal the article's insight, not merely list its sections?
- Does the board still look organized when zoomed out?
- Are same-rank objects aligned and similarly sized?
- Are connectors attached to shape edges and free of label collisions?
- Is any card floating in a huge container with excessive empty space?
- Does any text touch the top edge or overflow its container?
- Does the selected style affect layout, typography, geometry, and connectors, not only colors?
- Would a user want to manually edit this, or is it a static poster pretending to be a board?
