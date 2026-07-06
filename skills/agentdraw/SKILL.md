---
name: agentdraw
description: Use AgentDraw when the user wants to create a local editable diagram or visual explanation from a prompt, article, document, technical note, or review brief. Best for Mermaid-supported structured diagrams such as flowcharts/sequence/class/state diagrams, and SVG-based explanatory visuals such as article images, architecture explainers, mechanism diagrams, structure maps, and slide-like single-page visuals.
---

# AgentDraw

AgentDraw is a local workflow for helping agents create editable diagrams and explanatory visuals.
The core job is not "make any design"; it is to create one useful drawing that can be converted into
an editable board, validated, opened, adjusted, and exported.

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

Use Mermaid import for structured diagram types that Mermaid can express well. Use SVG import for
explanatory visuals, architecture maps, structure diagrams, article images, and slide-like single
page visuals.

The primary workflow is:

```text
intent/source -> type direction -> provider (Mermaid or SVG) -> design style -> layout style -> source -> import -> editable .agentdraw.json -> validate/repair/export/open
```

Do not start new boards by hand-writing `.agentdraw.json`. Write a clean Mermaid flowchart or SVG
source first, inspect it, then convert it into an editable AgentDraw board.

## Routing First

Do not treat visual style as the same thing as the diagram type. Decide the provider before drawing.
AgentDraw has two core directions:

1. **Structured diagram direction -> Mermaid.**
   Use when the requested output has clear diagram grammar and Mermaid supports the type: flowchart,
   sequence diagram, class diagram, state diagram, ER diagram, journey, timeline, or similar. Mermaid
   gives stronger structural correctness than hand-authored SVG for these cases.
2. **Explanatory visual direction -> SVG.**
   Use when the requested output is an article image, review visual, architecture explainer,
   mechanism map, structure explanation, comparison, matrix, or slide-like single visual. SVG gives
   more control over composition, theme, hierarchy, and custom layout.

After the provider decision, choose two separate visual layers:

- Design style: how the board should look and feel.
- Layout style: how the information is arranged on the canvas.

Always choose in this order:

```text
type direction -> provider -> design style -> layout style
```

Before generating, read `method/drawing-method.md`. Then load the closest playbook:

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
3. Decide the type direction:
   - structured diagram: Mermaid-supported flow/sequence/class/state/ER/timeline/journey diagrams;
   - explanatory visual: article image, architecture/structure explanation, mechanism map, review visual, or slide-like page.
4. Choose the provider:
   - Mermaid for structured diagram direction;
   - restricted SVG for explanatory visual direction.
5. Select and read the closest playbook. State the provider and playbook choice with a reason.
6. Run `agentdraw guide styles --json` and choose one design style by audience, density, and tone.
7. Choose one layout style from `method/drawing-method.md`, such as contrast split, center mechanism,
   layered stack, orbit map, matrix, timeline, or assertion pillars.
8. State the design style and layout style before generating. If the user did not express a visual
   preference and the choice is not obvious, run `agentdraw gallery --open --format json` and ask
   which visual direction they prefer. In headless mode, run `agentdraw gallery --no-open --format json`
   and return the generated URL or path.
9. Run `agentdraw guide style <style-id> --format text` and `agentdraw guide contract <style-id> --json`. Follow the guide and treat the contract as hard design constraints.
10. Write a short layout plan using the template in `method/drawing-method.md`.
11. Create the source:
   - Mermaid provider: create `.agentdraw/diagram.mmd`;
   - SVG provider: create `.agentdraw/board.svg`.
12. Inspect the Mermaid/SVG source or export/open it when possible. Fix alignment, text wrapping, connectors, grouping, and hierarchy while it is still source text.
13. Convert it:

```bash
agentdraw import-mermaid .agentdraw/diagram.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

or:

```bash
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

14. If `import-svg` reports unsupported tags, edit the SVG and import again.
15. Run:

```bash
agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json
agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json
```

16. For important boards, export and inspect a preview before opening:

```bash
agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json
```

17. Open the editable board:

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
- For explanatory visuals, the board has one memorable core message. It should not read like a
  generic collection of cards.
- Major sections are grouped into visible regions.
- In columns, lanes, and comparison panels, inner cards should use the available width deliberately. Avoid tiny centered cards floating inside a large column; target roughly 70-85% of the lane width unless the design intentionally needs small chips.
- Align repeated cards to a shared x, width, and rhythm. Uneven card widths inside the same lane usually read as weak layout unless they encode data.
- Equal-rank cards in the same row should usually share the same y, height, and width. Equal-rank cards in the same column should share the same x and width.
- Snap important SVG coordinates and dimensions to a consistent 4/8/16px rhythm. Random pixel drift makes generated boards look unprofessional even when content is correct.
- Architecture, layered system, and workflow boards have one outer frame, titled system boundary, or enclosing region unless the selected design guide says to keep the canvas open.
- The agent states why it selected the theme. If the user has no clear preference, the agent offers `agentdraw gallery` before committing to a style.
- The selected style changes layout, typography, spacing, components, connector treatment, and geometry, not only colors.
- Text hierarchy comes from title/heading/body sizes, weight, contrast, and spacing.
- For Chinese or multilingual boards, use body text around 16-18px, card headings around 20-24px, and titles around 34-44px unless the selected design guide says otherwise.
- Colors are constrained by the selected contract. Avoid ad hoc success green, warning orange, and danger red in restrained themes.
- Connectors attach to meaningful shapes at the shape edge or just outside it; endpoints must not sit deep inside nodes or cross labels.
- Text fits inside containers and appears vertically centered when the design intends centered labels.
- `agentdraw validate <file> --style <style-id> --format json` reports zero errors, or remaining errors are explicitly explained before delivery.
- `agentdraw quality <file> --style <style-id> --format json` returns `verdict: "pass"` or the remaining weaknesses are intentionally accepted.
- For important boards, export a PNG/SVG preview and inspect the rendered result before delivery.
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
- Choose design style and layout style separately.
- Do not turn every SVG source into a card wall. Choose a contrast split, mechanism, loop, stack,
  map, matrix, timeline, or assertion layout.
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
