---
name: agentdraw
description: Use AgentDraw when the user wants to create a local editable diagram or visual explanation from a prompt, article, document, technical note, or review brief. Best for Mermaid-supported structured diagrams such as flowcharts/sequence/class/state diagrams, and SVG-based explanatory visuals such as article images, architecture explainers, mechanism diagrams, structure maps, and slide-like single-page visuals.
---

# AgentDraw

AgentDraw is a local workflow for helping agents create editable diagrams and explanatory visuals.
The core job is not "make any design"; it is to create one useful drawing that can be converted into
an editable board, validated, opened, adjusted, and exported.

Default bias: when the user asks for "配图", "article image", "document visual", "concept visual",
"review visual", "思考/观点/概念说明", or "给文档做一些配图画板", use the SVG explanatory visual path.
Do not route to Mermaid merely because the source document has headings, bullet lists, hierarchy, or
logical structure.

Best-fit work:

- structured diagrams with clear grammar: flowcharts, sequence diagrams, class diagrams, state
  diagrams, ER diagrams, and similar Mermaid-supported types;
- explanatory visuals: article/blog images, technical note diagrams, review visuals, mechanism maps,
  architecture explainers, structure maps, and slide-like single-page visuals.

Poor-fit work:

- full landing pages, reports, posters, marketing pages, or general HTML design;
- complete slide decks;
- decorative illustrations where editability and structure do not matter.
- freehand education boards, sketch-notes, and expressive hand-drawn brainstorming boards; these are
  not a core AgentDraw target yet.

Use Mermaid import only for explicit diagram grammar that Mermaid can express well. Use SVG import
for explanatory visuals, architecture maps, structure explanations, article images, concept maps,
argument maps, review visuals, and slide-like single page visuals.

The primary workflow is:

```text
intent/source -> type direction -> provider (Mermaid or SVG) -> scene playbook -> layout system -> design style -> source -> import -> editable .agentdraw.json -> validate/repair/export/open
```

Do not start new boards by hand-writing `.agentdraw.json`. Write a clean Mermaid flowchart or SVG
source first, inspect it, then convert it into an editable AgentDraw board.

## Routing First

Do not treat visual style as the same thing as the diagram type. Decide the provider before drawing.
AgentDraw has two core directions:

1. **Structured diagram direction -> Mermaid.**
   Use when the user explicitly asks for a diagram type with clear grammar, or the source's primary
   job is to show a real process with ordered steps and branches: flowchart, sequence diagram, class
   diagram, state diagram, ER diagram, journey, timeline, or similar. Mermaid gives stronger
   structural correctness than hand-authored SVG for these cases.
2. **Explanatory visual direction -> SVG.**
   Use when the requested output is an article image, document illustration, review visual,
   architecture explainer, mechanism map, structure explanation, comparison, matrix, concept map,
   argument map, or slide-like single visual. SVG gives more control over composition, theme,
   hierarchy, and custom layout.

Important distinction:

- "The document is structured" does not mean "use Mermaid".
- "The requested visual is a formal flow/sequence/class/state/ER/timeline diagram" means "consider Mermaid".
- If the user asks for several配图 for a document without naming a diagram type, start with
  `article-visual.md` or `layered-architecture.md`, not `technical-flowchart.md`.

After the provider decision, choose two separate visual layers:

- Layout style: how the information is arranged on the canvas.
- Design style: how the board should look and feel. Editorial layouts recommend compatible styles;
  choose from those recommendations unless the user gave a clear preference.

These layers do not conflict. The layout system decides composition, reading path, region
proportions, and information priority. The selected `design.md` decides visual language: palette,
type, stroke, component treatment, and style signature. Apply the design style to the chosen layout;
do not let a style document replace the layout decision.

Editorial layouts are reference composition systems, not rigid templates. You may adapt
proportions, region sizes, emphasis, and content density to fit the source, but preserve the
layout's core composition device, reading path, alignment discipline, and quality rules.

Always choose in this order:

```text
type direction -> provider -> scene playbook -> layout system -> design style
```

Fast layout routing:

| User intent / source shape | Provider | Start here |
| --- | --- | --- |
| Formal flowchart, sequence, class, state, ER, journey | Mermaid | `playbooks/technical-flowchart.md` |
| Cloud, Kubernetes, service mesh, network/security, data platform, agent runtime topology | SVG | `playbooks/layered-architecture.md` + `method/technical-diagram-patterns.md` |
| Data lineage, ETL/ELT, data warehouse layering, data governance before/after | SVG | `method/data-flow-whiteboard-patterns.md` |
| Architecture, layers, runtime structure, ownership map | SVG | `playbooks/layered-architecture.md` + `method/layout-styles.md` |
| Article配图, concept visual, thinking note, review visual | SVG | `playbooks/article-visual.md` + `method/editorial-layouts.md` |
| SWOT, 2x2, option scoring, stakeholder map, timeline with visual emphasis | SVG | `method/editorial-layouts.md` |
| Slide-like one-page visual or executive summary | SVG | `playbooks/ppt-visual.md` + `method/editorial-layouts.md` or `method/layout-styles.md` |

Use progressive loading. Do not load every design document up front. First read only the routing
and quality files, then load the one playbook and one layout system that match the task.

Always read these method files:

- `method/drawing-method.md`: overall workflow.
- `method/provider-routing.md`: Mermaid vs SVG routing.
- `method/quality-levels.md`: P0-P3 quality gates.

Load these only when relevant:

- `method/layout-styles.md`: formal SVG explanatory structures, architecture maps, matrices,
  pipelines, timelines, and operating models.
- `method/technical-diagram-patterns.md`: cloud architecture, service mesh, network/security,
  agent runtime, memory/tool topology, and data-flow diagrams that need technical spacing,
  semantic colors, boundaries, and connector rules.
- `method/data-flow-whiteboard-patterns.md`: data lineage, ETL/ELT, warehouse layering,
  MapReduce-like transforms, and data governance before/after boards inspired by readable
  hand-drawn whiteboard examples. Use this when the source should feel like a clear data whiteboard:
  aligned enough to trust, loose enough to feel explanatory, and visually stronger than a generic
  table of cards.
- `method/editorial-layouts.md`: magazine-like article images, review visuals, concept visuals,
  SWOT/quadrant boards, editorial timelines, roadmap terraces, scoreboards, ecosystem maps, and
  memorable single-board explanations.

Then load the closest playbook:

- `playbooks/technical-flowchart.md`: structured flows and Mermaid-supported process diagrams.
- `playbooks/article-visual.md`: explanatory article/doc/review visuals.
- `playbooks/layered-architecture.md`: architecture, system structure, and responsibility maps.
- `playbooks/ppt-visual.md`: slide-like single-page explanatory visuals.

Do not route to freehand education/sketch-note playbooks by default. If the user explicitly asks for
a hand-drawn teaching board, say AgentDraw's current reliable path is structured Mermaid or
SVG-based explanatory visuals, then offer an SVG explanation board instead.

## Runtime

If you are running inside the AgentDraw source repository, use the repo-local command so you test
the current checkout:

```bash
pnpm agentdraw --help
pnpm agentdraw guide --format text
pnpm agentdraw guide scene --format text
pnpm agentdraw guide quality --format text
pnpm agentdraw guide styles --json
pnpm agentdraw gallery --open --format json
pnpm agentdraw guide contract <style-id> --json
```

For installed usage outside the source repository, prefer the npm runtime. Use the globally
installed `agentdraw` command when present and recent; otherwise use `npx @aidraw/agentdraw@latest`.

```bash
npx @aidraw/agentdraw@latest --help
npx @aidraw/agentdraw@latest guide --format text
npx @aidraw/agentdraw@latest guide scene --format text
npx @aidraw/agentdraw@latest guide quality --format text
npx @aidraw/agentdraw@latest guide styles --json
npx @aidraw/agentdraw@latest gallery --open --format json
npx @aidraw/agentdraw@latest guide contract <style-id> --json
```

For repeated use:

```bash
npm install -g @aidraw/agentdraw
agentdraw doctor --json
```

## Workflow

1. Run `agentdraw guide` for the current workflow.
2. Read `method/drawing-method.md`.
3. Read `method/provider-routing.md` and `method/quality-levels.md`.
   For explanatory visuals, document配图, article images, review visuals, and slide-like boards,
   optimize for a polished magazine-like composition: clear visual hierarchy, one obvious focal
   point, strong whitespace, and an information structure that highlights the user's key message.
   A named theme such as `boardroom` is a visual language, not a replacement for layout design.
4. Decide the type direction:
   - structured diagram: explicit Mermaid-supported flow/sequence/class/state/ER/timeline/journey diagrams;
   - explanatory visual: article image, concept/argument visual, architecture/structure explanation, mechanism map, review visual, or slide-like page.
5. Choose the provider:
   - Mermaid only for structured diagram grammar;
   - restricted SVG for explanatory visual direction and document配图.
6. Select and read the closest playbook. State the provider and playbook choice with a reason.
7. Choose one layout system:
   - for data lineage, data warehouse layering, ETL/ELT, MapReduce-like transforms, and data
     governance before/after visuals, choose from `method/data-flow-whiteboard-patterns.md`; read
     that file only for this path;
   - for cloud architecture, service mesh, network/security topology, data-flow systems, or
     agent/tool/memory runtime maps, choose from `method/technical-diagram-patterns.md`; read that
     file only for this path;
   - for architecture, mechanism, matrix, pipeline, timeline, and formal structure maps, choose from
     `method/layout-styles.md`; read that file only for this path;
   - for article配图, concept visuals, thinking notes, executive one-pagers, public-facing review
     visuals, and most explanatory/document visuals where the goal is reader understanding, choose
     from `method/editorial-layouts.md`, such as `E01 Monochrome Big Number`,
     `E02 Reading Room Overlap`, `E03 Swiss Statement Grid`, `E04 Editorial Sidebar`,
     `E05 Poster Ledger`, `E06 Reading Room Index`, `E07 Strategic Quadrant`,
     `E08 Editorial Timeline`, `E09 Roadmap Terrace`, `E10 Decision Scoreboard`,
     `E11 Ecosystem Orbit`, or `E12 Pyramid Stack`; read that file only for this path.
   Treat editorial layouts as adaptable references. Do not copy them mechanically when the source
   needs different proportions, but do not remove the layout's defining composition device.
8. Run `agentdraw guide styles --json` and choose one design style by audience, density, tone, and
   the recommended styles for the chosen layout.
   Style and layout are separate decisions. Even when the user names a style, still choose a strong
   layout system and make the board feel intentional, designed, and focused rather than like a
   generic card wall.
   If choosing `boardroom`, the board must include a visible dark command panel, dominant statement
   block, or decision strip. A light-only blue card grid is not enough to satisfy the style.
   If drawing cloud, Kubernetes, network, service mesh, data platform, or AI runtime infrastructure,
   consider `infra-dark`, `blueprint-formal`, `runtime-doc`, `system-formal`, or `neon-grid` before
   using a generic editorial theme.
   If drawing data lineage, warehouse layering, ETL/ELT, or governance before/after visuals,
   consider `hatch-whiteboard`, `pin-and-paper`, `runtime-doc`, or `blueprint-formal` before using a
   generic card-grid theme.
   If choosing `hatch-whiteboard`, preserve the whiteboard feel deliberately: use one complete outer
   frame, dashed lanes or boundaries, pastel hatch fills, readable hand-drawn typography, and short
   labels. The imported board should use Excalidraw's hand font (`fontFamily: 5`) so CJK text can
   fall back to Xiaolai; do not manually force old Virgil-style `fontFamily: 1` in generated JSON.
9. State the layout system and design style before generating. If the user did not express a visual
   preference and the choice is not obvious, run `agentdraw gallery --open --format json` and ask
   which visual direction they prefer. In headless mode, run `agentdraw gallery --no-open --format json`
   and return the generated URL or path.
10. Run `agentdraw guide style <style-id> --format text` and `agentdraw guide contract <style-id> --json`. Follow the guide and treat the contract as hard design constraints.
11. Write a short layout plan using the template in `method/drawing-method.md`. If using an
    editorial layout, include the required `Editorial layout`, `Design style`, and
    `Composition device` lines from `method/editorial-layouts.md`.
12. Create the source:
   - Mermaid provider: create `.agentdraw/diagram.mmd`;
   - SVG provider: create `.agentdraw/board.svg`.
13. Inspect the Mermaid/SVG source or export/open it when possible. Fix alignment, text wrapping, connectors, grouping, and hierarchy while it is still source text.
14. Convert it:

```bash
agentdraw import-mermaid .agentdraw/diagram.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

or:

```bash
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

15. If `import-svg` reports unsupported tags, edit the SVG and import again.
16. Run:

```bash
agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json
agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json
```

17. For important boards, export and inspect a preview before opening:

```bash
agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json
```

18. Apply `method/quality-levels.md`: fix all P0 and P1 issues before delivery.
19. Open the editable board:

```bash
agentdraw open .agentdraw/board.agentdraw.json --background --open --format json
```

On a remote or headless host:

```bash
agentdraw open .agentdraw/board.agentdraw.json --background --no-open --format json
```

Return the printed URL to the user.

## SVG Contract

Use only this SVG subset for editable imports:

- Tags: `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`, `defs`, `marker`.
- Transforms: `translate(x y)` and `translate(x,y)` on `g`.
- Arrows: use `line` or `polyline` with `marker-end="url(#arrow)"`.
- Plain rules, dividers, timeline rails, measurement guides, and decorative connector strips must not use `marker-end`; they import as editable lines, not arrows.
- Text: use real `text` and `tspan`, not paths.
- Multiline labels: use `tspan x="..." dy="..."` lines.
- Formal cards: use small `rx`/`ry` values. Avoid pill-shaped rounded rectangles unless the selected design explicitly calls for them.
- For centered labels, always set both `text-anchor="middle"` and `dominant-baseline="middle"`.
- Use only colors from `agentdraw guide contract <style-id> --json`. Do not add generic green, orange, or red status colors unless the selected palette includes them or the user explicitly asks for status semantics.

Avoid:

- `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path` geometry, and text converted to outlines.
- Emoji as icons, bullets, status markers, or decoration unless the user explicitly requests them.
- Screenshots when the user expects an editable board.
- Connector endpoints deep inside shapes. Place arrow endpoints on shape edges or just outside them.
- Arrowheads on divider lines, underlines, timeline rails, or decorative rules.

## SVG Patterns

Centered single-line label:

```svg
<rect x="120" y="120" width="260" height="88" rx="6" fill="#F7F9FC" stroke="#172033" stroke-width="2" />
<text x="250" y="164" text-anchor="middle" dominant-baseline="middle"
  font-family="Inter, Arial, sans-serif" font-size="18" font-weight="650" fill="#172033">Centered label</text>
```

Centered multiline label:

```svg
<rect x="120" y="120" width="300" height="116" rx="6" fill="#F7F9FC" stroke="#172033" stroke-width="2" />
<text x="270" y="178" text-anchor="middle" dominant-baseline="middle"
  font-family="Inter, Arial, sans-serif" font-size="17" fill="#172033">
  <tspan x="270" dy="-0.6em">Primary label</tspan>
  <tspan x="270" dy="1.2em">Secondary detail</tspan>
</text>
```

Arrow marker:

```svg
<defs>
  <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748B" />
  </marker>
</defs>
<line x1="380" y1="164" x2="520" y2="164" stroke="#64748B" stroke-width="2" marker-end="url(#arrow)" />
```

## Quality Bar

A successful board is editable, structured, readable, visually intentional, and validated.

Before delivering:

- The board has a clear title and reading path.
- The provider matches the type direction: Mermaid for structured diagram grammar, SVG for custom
  explanatory visuals.
- The SVG layout style is one of the locked layout styles from `method/layout-styles.md` or one of
  the editorial layouts from `method/editorial-layouts.md`; the notes state why that layout fits the
  source.
- For explanatory visuals, the board has one memorable core message. It should not read like a
  generic collection of cards.
- For article images, concept visuals, and slide-like review visuals, prefer an editorial layout
  when a normal card grid would look generic. The board should have one visible composition device:
  giant number, asymmetric sidebar, poster ledger, field-guide index, statement grid, quadrant,
  timeline rail, roadmap terrace, scoreboard, orbit, or pyramid.
- Major sections are grouped into visible regions.
- In columns, lanes, and comparison panels, inner cards should use the available width deliberately. Avoid tiny centered cards floating inside a large column; target roughly 70-85% of the lane width unless the design intentionally needs small chips.
- Align repeated cards to a shared x, width, and rhythm. Uneven card widths inside the same lane usually read as weak layout unless they encode data.
- Equal-rank cards in the same row should usually share the same y, height, and width. Equal-rank cards in the same column should share the same x and width.
- Snap important SVG coordinates and dimensions to a consistent 4/8/16px rhythm. Random pixel drift makes generated boards look unprofessional even when content is correct.
- Architecture, layered system, and workflow boards have one outer frame, titled system boundary, or enclosing region unless the selected design guide says to keep the canvas open.
- The agent states why it selected the theme. If the user has no clear preference, the agent offers `agentdraw gallery` before committing to a style.
- The selected design style is visibly applied to the chosen layout through typography, spacing,
  components, connector treatment, geometry, and signature motifs, not only colors.
- Text hierarchy comes from title/heading/body sizes, weight, contrast, and spacing.
- For Chinese or multilingual boards, use body text around 16-18px, card headings around 20-24px, and titles around 34-44px unless the selected design guide says otherwise.
- Colors are constrained by the selected contract. Avoid ad hoc success green, warning orange, and danger red in restrained themes.
- Connectors attach to meaningful shapes at the shape edge or just outside it; endpoints must not sit deep inside nodes or cross labels.
- Text fits inside containers and appears vertically centered when the design intends centered labels.
- `agentdraw validate <file> --style <style-id> --format json` reports zero errors, or remaining errors are explicitly explained before delivery.
- `agentdraw quality <file> --style <style-id> --format json` returns `verdict: "pass"` or the remaining weaknesses are intentionally accepted.
- For important boards, export a PNG/SVG preview and inspect the rendered result before delivery.
- P0/P1 quality issues from `method/quality-levels.md` are fixed, not accepted silently.
- When inspecting the preview, zoom out first: the board should still show a deliberate structure, not scattered boxes. Then zoom in for text fit, connector endpoints, and whitespace.

If the result looks generic or weak, revise the source SVG. Do not try to save a weak layout by changing only colors.

## Useful Commands

```bash
agentdraw guide
agentdraw guide scene
agentdraw guide quality
agentdraw guide styles --json
agentdraw gallery --open --format json
agentdraw guide style <style-id> --format text
agentdraw guide contract <style-id> --json
agentdraw import-mermaid .agentdraw/diagram.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json
agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json
agentdraw open .agentdraw/board.agentdraw.json --background --open --format json
agentdraw open .agentdraw/board.agentdraw.json --background --no-open --format json
```

## Hard Rules

- Generate Mermaid or restricted SVG first for new boards.
- Convert Mermaid with `agentdraw import-mermaid` or SVG with `agentdraw import-svg`; do not hand-write `.agentdraw.json` as the primary generation path.
- Decide provider first: Mermaid for Mermaid-supported structured diagram types; SVG for explanatory
  visuals, architecture, structure, and slide-like single visuals.
- Choose layout system and design style separately, but respect recommended style bindings in
  `method/editorial-layouts.md`.
- Read `method/provider-routing.md` and `method/quality-levels.md` before generating important
  boards. Then read either `method/layout-styles.md` or `method/editorial-layouts.md`, depending on
  the selected layout system.
- Do not turn every SVG source into a card wall. Choose a contrast split, mechanism, loop, stack,
  map, matrix, timeline, assertion layout, or editorial layout. If the result feels generic, switch
  to `method/editorial-layouts.md` before changing colors.
- Do not route into hand-drawn education/sketch-note boards as a default capability.
- Do not use a design style as a palette swap; load its guide and contract before generating.
- Do not silently default to the same style every time. Do not choose `system-formal` just because examples or previous runs used it. State the selected style and reason; if unsure, show the theme gallery and ask.
- Avoid emoji and decorative pictograms unless the user explicitly requests them.
- Use real editable text and generously sized containers.
- Use the font family direction required by `agentdraw guide contract <style-id> --json`; for Chinese or multilingual boards, prefer sans-serif system fonts unless the user explicitly wants hand-drawn text.
- Do not create two global outer frames.
- Do not place connector start or end points deep inside a shape.
- Do not persist viewport runtime fields such as `scrollX`, `scrollY`, `zoom`, `width`, `height`, `offsetTop`, `selectedElementIds`, or `editingTextElement`.
- Run import, repair, validate, quality, and preview/open before delivering important boards.
