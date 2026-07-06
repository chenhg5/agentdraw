# AgentDraw Drawing Method

Use this method before choosing a visual style. A design style controls how the board looks; a
playbook controls how the information is organized.

AgentDraw's reliable scope has two directions:

- **Structured diagrams:** use Mermaid when the requested diagram type has clear grammar and
  Mermaid supports it.
- **Explanatory visuals:** use restricted SVG when the output is a designed article image,
  architecture/structure explanation, mechanism map, comparison, matrix, or slide-like single-page
  visual.

Do not treat AgentDraw as a general-purpose poster, web page, slide deck, freehand sketch-note, or
hand-drawn education board generator.

## Decision Order

1. Identify the type direction: structured diagram or explanatory visual.
2. Choose the provider: Mermaid or SVG.
3. Select one scene playbook.
4. Select one design style that fits the audience and tone.
5. Select one layout style.
6. Plan the layout before writing Mermaid or SVG.
7. Generate Mermaid or restricted SVG.
8. Convert, repair, validate, export, inspect, and revise.

Never skip from prompt directly to a style. If the provider or layout style is wrong, a beautiful
theme will still produce a weak board.

## Provider Selection

### Mermaid Provider

Use Mermaid when the user asks for, or the content naturally is:

- flowchart;
- sequence diagram;
- class diagram;
- state diagram;
- ER diagram;
- journey diagram;
- timeline;
- simple C4/architecture diagram that Mermaid can express cleanly.

Mermaid is better for these because it enforces diagram grammar, connections, node types, and
structural consistency. Do not hand-author these as SVG unless the user explicitly needs a custom
designed composition.

### SVG Provider

Use restricted SVG when the output is:

- article/blog/document/review visual;
- architecture or structure explanation that needs custom composition;
- mechanism map;
- concept map;
- comparison or tradeoff matrix;
- layered stack;
- loop/flywheel;
- slide-like single-page visual.

SVG is better for these because it gives control over composition, hierarchy, visual rhythm, and
design style.

## Layout Styles

Pick one layout style before drawing SVG. For Mermaid, pick the appropriate Mermaid diagram type
instead of forcing a custom layout.

- **Contrast split:** old vs new, problem vs solution, weak vs strong, before vs after.
- **Center mechanism:** one central engine/process with causes, controls, and effects around it.
- **Layered stack:** layers, foundations, dependencies, responsibility bands.
- **Pipeline:** input -> transformation -> output, with optional support layer.
- **Loop/flywheel:** repeated cycle, quality loop, operating rhythm, feedback system.
- **Matrix:** tradeoffs, decision frame, capability comparison.
- **Timeline:** evolution, phases, release sequence, migration path.
- **Orbit map:** core idea in the center, surrounding actors/forces/principles.
- **Assertion pillars:** one claim with 2-4 supporting pillars; use for slide-like visuals.

Do not default to three equal cards. Three pillars are acceptable only when the source genuinely has
three parallel supports.

## Scene Intent Classes

- Structured flow/process/decision: use Mermaid and `technical-flowchart.md`.
- Sequence/class/state/ER/timeline/journey: use Mermaid; adapt `technical-flowchart.md` for process
  discipline and quality expectations.
- Article/doc/review visual: use SVG and `article-visual.md`.
- Architecture/structure explanation: use SVG and `layered-architecture.md`, unless Mermaid can
  express the requested architecture cleanly.
- Slide-like single visual: use SVG and `ppt-visual.md`.
- Compare choices, before/after states, or tradeoffs: use `comparison-map.md` when available; until
  then, adapt `article-visual.md`.

## Layout Planning Template

Before writing SVG, write a short plan:

```text
Scene: <playbook id>
Provider: <Mermaid / SVG> because <reason>
Audience: <engineers / executives / learners / broad readers>
Reader question: <what should the reader understand in 5 seconds?>
Main message: <one sentence>
Layout style: <contrast split / center mechanism / layered stack / pipeline / loop / matrix / timeline / orbit map / assertion pillars>
Reading path: <top-down / left-right / hub-spoke / before-after / timeline>
Regions:
- <region name>: <purpose>, <approx width/height>, <items>
- <region name>: <purpose>, <approx width/height>, <items>
Connectors: <main flows only; avoid secondary clutter>
Style: <style id> because <reason>
Risks: <likely layout failure to avoid>
```

## Universal Composition Rules

- Match provider to diagram type before styling.
- Make one idea memorable. A good explanatory visual has a point of view, not just labeled boxes.
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

## Mermaid Layout Heuristics

- Use `flowchart TD` for most professional process diagrams; use `LR` only when horizontal scanning
  is clearly better.
- Use real decision nodes for branches, not rectangle labels pretending to be decisions.
- Label branches close to the branch edge.
- Keep retry loops compact and secondary to the happy path.
- Prefer Mermaid-native sequence/class/state/ER syntax over approximating those diagrams as SVG.

## SVG Layout Heuristics

- Canvas: start around 1200x800 for article, structure, and architecture boards; 1280x720 for
  slide-like single-page visuals.
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
- Is Mermaid used for grammar-heavy structured diagrams and SVG used for custom explanatory visuals?
- Does the board reveal the source's insight, not merely list its sections?
- Does the board still look organized when zoomed out?
- Are same-rank objects aligned and similarly sized?
- Are connectors attached to shape edges and free of label collisions?
- Is any card floating in a huge container with excessive empty space?
- Does any text touch the top edge or overflow its container?
- Does the selected style affect layout, typography, geometry, and connectors, not only colors?
- Would a user want to manually edit this, or is it a static poster pretending to be a board?
