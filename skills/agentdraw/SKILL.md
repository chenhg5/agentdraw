---
name: agentdraw
description: Use AgentDraw when the user wants a local editable whiteboard, diagram, system map, journey map, process chart, architecture board, research synthesis wall, roadmap, or styled visual board that an agent can draft as SVG, convert into an editable browser board, validate, manually edit, and export as JSON/SVG/PNG.
---

# AgentDraw

AgentDraw is an SVG-first local whiteboard workflow for coding agents.

The primary workflow is:

```text
prompt -> design system -> restricted SVG -> import-svg -> editable .agentdraw.json -> validate/repair/export/open
```

Do not start new boards by hand-writing `.agentdraw.json`. Write a clean SVG first, inspect it, then convert it into an editable AgentDraw board.

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
2. Run `agentdraw guide styles --json` and choose one style id by audience, density, and tone.
3. State the style choice and reason in one short sentence before generating. If the user did not express a visual preference and the choice is not obvious, run `agentdraw gallery --open --format json` and ask which visual direction they prefer. In headless mode, run `agentdraw gallery --no-open --format json` and return the generated URL or path.
4. Run `agentdraw guide style <style-id> --format text` and `agentdraw guide contract <style-id> --json`. Follow the guide and treat the contract as hard design constraints.
5. Create `.agentdraw/board.svg` as the source draft. Use the supported SVG subset below.
6. Inspect the SVG or export/open it when possible. Fix alignment, text wrapping, connectors, grouping, and hierarchy while it is still SVG.
7. Convert it:

```bash
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
```

8. If `import-svg` reports unsupported tags, edit the SVG and import again.
9. Run:

```bash
agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json
agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json
```

10. For important boards, export and inspect a preview before opening:

```bash
agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json
```

11. Open the editable board:

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
agentdraw import-svg .agentdraw/board.svg --out .agentdraw/board.agentdraw.json --style <style-id> --title "<title>" --format json
agentdraw repair .agentdraw/board.agentdraw.json --style <style-id> --write --format json
agentdraw validate .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw quality .agentdraw/board.agentdraw.json --style <style-id> --format json
agentdraw export .agentdraw/board.agentdraw.json --format png --out .agentdraw/board.preview.png --json
agentdraw open .agentdraw/board.agentdraw.json --background --open --format json
agentdraw open .agentdraw/board.agentdraw.json --background --no-open --format json
```

## Hard Rules

- Generate restricted SVG first for new boards.
- Convert SVG with `agentdraw import-svg`; do not hand-write `.agentdraw.json` as the primary generation path.
- Do not use a design style as a palette swap; load its guide and contract before generating.
- Do not silently default to the same style every time. Do not choose `system-formal` just because examples or previous runs used it. State the selected style and reason; if unsure, show the theme gallery and ask.
- Avoid emoji and decorative pictograms unless the user explicitly requests them.
- Use real editable text and generously sized containers.
- Use the font family direction required by `agentdraw guide contract <style-id> --json`; for Chinese or multilingual boards, prefer sans-serif system fonts unless the user explicitly wants hand-drawn text.
- Do not create two global outer frames.
- Do not place connector start or end points deep inside a shape.
- Do not persist viewport runtime fields such as `scrollX`, `scrollY`, `zoom`, `width`, `height`, `offsetTop`, `selectedElementIds`, or `editingTextElement`.
- Run import, repair, validate, quality, and preview/open before delivering important boards.
