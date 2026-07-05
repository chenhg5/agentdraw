# AgentDraw Playbook Evaluation

Use this eval to test whether scene playbooks improve AgentDraw's core job: turning articles,
documents, notes, and review briefs into editable visual explanations.

## Goal

Evaluate whether a fresh agent can:

- extract the source's core message;
- choose a visual expression pattern before drawing;
- identify the right communication scenario;
- choose a scene playbook before choosing a style;
- state why the playbook and style were selected;
- produce a board with a strong information structure;
- validate, export, inspect, and revise the result.

## Quick Run

Prepare all built-in cases without running an agent:

```bash
pnpm eval:design
```

Run one case:

```bash
pnpm eval:design -- --case teaching --agent codex
pnpm eval:design -- --case flow --agent claude
```

Run all cases:

```bash
pnpm eval:design -- --case all --agent codex
```

The script writes each run to `.agentdraw/evals/<run-name>/` with source documents, the exact prompt, rubric, and an `outputs/` directory. Omit `--agent` when you only want to generate the prompt package and run it yourself.

## Eval Matrix

Run at least one task from each category before judging a playbook change.

| Category | User Intent | Expected Playbook | Example Styles | Main Risk |
| --- | --- | --- | --- | --- |
| Technical article | Create an editable article image for engineers | `article-visual`, adapting `layered-architecture` only if needed | `runtime-doc`, `raw-grid`, `system-formal` | Turns into generic boxes |
| Review visual | Create one discussion image for leadership or review | `article-visual` | `boardroom`, `long-table`, `soft-editorial` | Becomes a generic slide |
| Self-media article | Make a public explainer visual | `article-visual` | `soft-editorial`, `riso-brut`, `bold-poster` | Too dense or too technical |
| Teaching | Explain a concept step by step | `teaching-board` | `chalk-lesson`, `crayon-stack`, `manual-cream` | Looks like a generic card board |
| Technical flow | Show process logic or decisions | `technical-flowchart` | `system-formal`, `blueprint-formal`, `inkline` | Bad connectors or no decisions |
| System architecture | Explain product/platform structure | `layered-architecture` | `system-formal`, `blueprint-formal`, `runtime-doc` | Missing boundary or layer logic |

## Test Prompts

Use prompts like these with a clean agent context.

### Technical Article

```text
Read the attached technical article and create an editable AgentDraw board that helps engineers
understand the core system model. Pick the right scene playbook and style, explain your choices,
then generate, validate, export a preview, and open the board.
```

Expected behavior:

- Uses `method/drawing-method.md`.
- Chooses `layered-architecture` when the article describes a system.
- Chooses `article-visual` when the article argues a thesis.
- Avoids copying the article as many bullet cards.

### PPT Direction

```text
Create one slide-like visual for a leadership deck explaining why we should invest in editable
AI-generated diagrams. It should feel executive and presentation-ready, not like a technical spec.
```

Expected behavior:

- Uses `ppt-visual` only because the prompt explicitly asks for a slide-like leadership deck page.
- Uses an assertion headline.
- Uses 2-4 support pillars.
- Keeps text short and slide-friendly.

### Self-Media / Newsletter

```text
Create a public-facing article illustration for: "Style is not strategy: why AI diagrams need
scene playbooks." It should be memorable and readable as a blog hero image.
```

Expected behavior:

- Chooses `article-visual`.
- Uses contrast, metaphor, or before/after structure.
- Produces a strong headline and takeaway.
- Avoids dense technical architecture.

### Teaching

```text
Create a teaching board that explains why a small prompt prefix change can invalidate an LLM cache.
Assume the reader is a developer learning the concept for the first time. Prefer a Khan-style
worked lesson with examples, annotations, and a rule of thumb, not a card wall.
```

Expected behavior:

- Chooses `teaching-board`.
- Usually chooses `chalk-lesson` unless the user asked for another visual tone.
- Uses stages or a worked example.
- Highlights the one changed token.
- Ends with a rule of thumb.
- Does not turn the lesson into three equal cards or a product whiteboard.

### Technical Flow

```text
Draw a professional user registration and login flow with validation failures and retry loops.
It should be editable and use correct flowchart conventions.
```

Expected behavior:

- Chooses `technical-flowchart`.
- Uses start/end ellipses, decision diamonds, action rectangles.
- Labels branches.
- Keeps connectors attached to edges.

### System Architecture

```text
Create an editable architecture board for a local agent drawing system that converts prompts into
editable whiteboards through planning, SVG/Mermaid import, validation, preview, and manual editing.
```

Expected behavior:

- Chooses `layered-architecture`.
- Uses system boundary or layer bands.
- Separates planning, rendering, quality, and editing.
- Shows state and external tools clearly.

## Scoring Rubric

Score each board 1-5.

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Playbook fit | Wrong scene type | Mostly right but generic | Clearly matches the communication job |
| Style fit | Arbitrary style | Style loosely fits | Style supports audience and intent |
| Information structure | Scattered items | Some grouping | Strong reading path and regions |
| Visual design | Palette-only | Acceptable alignment | Deliberate hierarchy, spacing, balance |
| Technical correctness | Wrong conventions | Minor issues | Correct diagram grammar |
| Editability | Static or fragile | Mostly editable | Clean editable text/shapes/connectors |
| Validation loop | Skipped | Ran CLI only | Exported preview, inspected, revised |

Pass bar:

- average >= 4.0;
- no dimension below 3;
- no repeated failure to state playbook and style reasons.

## Failure Diagnosis

- If output looks good but communicates the wrong thing, improve the playbook routing.
- If structure is right but ugly, improve the design style or layout examples.
- If agents copy playbook examples too literally, add more scenario examples and anti-patterns.
- If connectors or text fitting fail, improve CLI validation/repair.
- If agents choose the same style repeatedly, improve style selection guidance and gallery workflow.

## Recommended Eval Output

Each run should produce:

- source prompt;
- selected playbook and reason;
- selected style and reason;
- layout plan;
- source SVG or Mermaid;
- `.agentdraw.json`;
- PNG preview;
- validate/quality JSON output;
- short self-critique.
