---
name: agentdraw
description: Use AgentDraw when the user wants to turn an article, document, technical note, review brief, or idea into a local editable visual explanation: article images, concept diagrams, architecture explainers, mechanism diagrams, flowcharts, or teaching boards that can be validated, opened, edited, and exported.
---

# AgentDraw

AgentDraw is a local workflow for helping agents turn writing into editable visual explanations.
The core job is not "make any design" or "make a slide deck"; it is to create one useful drawing
that captures the meaning of an article, document, technical note, review brief, or idea.

Best-fit work:

- article and blog images that explain the core idea;
- technical article diagrams, mechanism maps, and architecture explainers;
- review visuals that make a proposal easier to discuss;
- flowcharts when the article needs process logic;
- teaching boards when the article needs a worked example.

Poor-fit work:

- full landing pages, reports, posters, marketing pages, or general HTML design;
- complete slide decks;
- decorative illustrations where editability and structure do not matter.

Use Mermaid import for standard flowcharts and decision flows. Use SVG import for high-design
editable visual explanations, architecture maps, mechanism diagrams, and custom layouts.

The primary workflow is:

```text
source text -> core message -> visual expression pattern -> scene playbook -> design system -> Mermaid or restricted SVG -> import -> editable .agentdraw.json -> validate/repair/export/open
```

Do not start new boards by hand-writing `.agentdraw.json`. Write a clean Mermaid flowchart or SVG
source first, inspect it, then convert it into an editable AgentDraw board.

## Expression Strategy First

Do not treat visual style as the same thing as the diagram type. For AgentDraw, the most important
decision is the visual explanation strategy: what idea should the reader remember, and what visual
structure makes that idea obvious?

AgentDraw has three independent dimensions:

- Visual expression pattern: the article's argument shape, such as contrast, mechanism, loop,
  ladder, stack, map, matrix, or timeline.
- Scene playbook: how the information should be organized so the reader understands it.
- Design style: how the board should look and feel.

Always extract the message first, then choose the expression pattern and playbook, then choose a
style.

Before generating, read `method/drawing-method.md`. Then load the closest playbook:

- `playbooks/article-visual.md`: default for articles, docs, review briefs, newsletters, and idea visuals.
- `playbooks/layered-architecture.md`: use only when the core article idea is system structure.
- `playbooks/technical-flowchart.md`: use only when the core article idea is process logic or decisions.
- `playbooks/teaching-board.md`: use only when the core article idea is best taught through a worked example.
- `playbooks/ppt-visual.md`: secondary; use only when the user explicitly asks for a slide-like visual.

If the user gives an article, document, or long-form source and does not explicitly ask for a
standard chart type, start from `article-visual.md`. Adapt the supporting playbooks only when they
make the article's core idea clearer. A style guide may recommend suitable scenarios, but no style is
locked to one scenario.

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
3. Extract the article's core message in one sentence. If there is no source text, write the user's idea as the core message.
4. Choose a visual expression pattern: contrast, mechanism, loop, ladder, stack, map, matrix, timeline, or teaching example.
5. Select and read one scene playbook. Default to `article-visual.md` for article/doc/review visuals unless a supporting playbook clearly fits better. State the playbook choice and reason in one short sentence.
6. Run `agentdraw guide styles --json` and choose one style id by audience, density, and tone.
7. State the style choice and reason in one short sentence before generating. If the user did not express a visual preference and the choice is not obvious, run `agentdraw gallery --open --format json` and ask which visual direction they prefer. In headless mode, run `agentdraw gallery --no-open --format json` and return the generated URL or path.
8. Run `agentdraw guide style <style-id> --format text` and `agentdraw guide contract <style-id> --json`. Follow the guide and treat the contract as hard design constraints.
9. Write a short layout plan using the template in `method/drawing-method.md`.
10. Choose the source path. For conventional process diagrams, create `.agentdraw/flow.mmd` with `flowchart TD`, `flowchart TB`, or `flowchart LR`. For high-design article visuals and explanation boards, create `.agentdraw/board.svg` with the supported SVG subset below.
11. Inspect the Mermaid/SVG source or export/open it when possible. Fix alignment, text wrapping, connectors, grouping, and hierarchy while it is still source text.
12. Convert it:

```bash
agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

or:

```bash
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

13. If `import-svg` reports unsupported tags, edit the SVG and import again.
14. Run:

```bash
agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json
agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json
```

15. For important boards, export and inspect a preview before opening:

```bash
agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json
```

16. Open the editable board:

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
- For article/doc/review visuals, the board has one memorable core message. It should not read like
  a generic collection of cards.
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
agentdraw import-mermaid .agentdraw/flow.mmd --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
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
- For article, document, or review-brief inputs, extract the core message and visual expression pattern before drawing.
- Do not turn every source into a card wall. Choose a contrast, mechanism, loop, ladder, map, matrix, timeline, or worked-example structure.
- Do not use `ppt-visual.md` unless the user explicitly asks for a slide-like visual. A review visual is usually an article visual, not a slide.
- Do not use a design style as a palette swap; load its guide and contract before generating.
- Do not silently default to the same style every time. Do not choose `system-formal` just because examples or previous runs used it. State the selected style and reason; if unsure, show the theme gallery and ask.
- Avoid emoji and decorative pictograms unless the user explicitly requests them.
- Use real editable text and generously sized containers.
- Use the font family direction required by `agentdraw guide contract <style-id> --json`; for Chinese or multilingual boards, prefer sans-serif system fonts unless the user explicitly wants hand-drawn text.
- Do not create two global outer frames.
- Do not place connector start or end points deep inside a shape.
- Do not persist viewport runtime fields such as `scrollX`, `scrollY`, `zoom`, `width`, `height`, `offsetTop`, `selectedElementIds`, or `editingTextElement`.
- Run import, repair, validate, quality, and preview/open before delivering important boards.
