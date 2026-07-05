# AgentDraw Evals

This folder defines the first evaluation surface for the AgentDraw skill.

The goal is not to prove that a generated board is perfect. The goal is to catch regressions and
make quality discussable: task fit, structure, visual design, readability, connector quality, and
validation.

## One-Command Playbook Eval

Prepare the full built-in eval suite without running an agent:

```bash
pnpm eval:design
```

Run one case with Codex:

```bash
pnpm eval:design -- --case teaching --agent codex
```

Run the full suite with Claude:

```bash
pnpm eval:design -- --case all --agent claude
```

Built-in cases:

- `technical-article`: technical article / engineering explainer
- `ppt`: executive slide visual
- `self-media`: public article illustration
- `teaching`: step-by-step teaching board
- `flow`: professional flowchart
- `architecture`: system architecture board
- `all`: every case above

Each run writes a self-contained folder under `.agentdraw/evals/<run-name>/`:

- `input/`: source articles and briefs for the agent
- `prompt.md`: the exact prompt to run manually if desired
- `rubric.md`: human scoring rubric
- `outputs/`: expected location for SVG, `.agentdraw.json`, PNG previews, and notes

Without `--agent`, the script prints ready-to-run `codex` and `claude` commands using the generated prompt. This is useful when you want to inspect or edit the prompt first.

For a custom source document:

```bash
pnpm eval:design -- --source ./path/to/article.md --agent codex
```

## How To Run A Manual Eval

1. Start from a clean working directory.
2. Install the current skill and CLI:

```bash
npm install -g @aidraw/agentdraw
npx skills add chenhg5/agentdraw --skill agentdraw -p -a codex -y
```

3. Pick one prompt from [`prompts.md`](./prompts.md).
4. Ask an agent to create the board using AgentDraw.
5. Run validation:

```bash
agentdraw validate path/to/output.agentdraw.json --style <style-id> --format json
agentdraw quality path/to/output.agentdraw.json --style <style-id> --format json
```

6. Score the output with [`rubric.md`](./rubric.md). Use `agentdraw quality` as preflight evidence,
   but still review task fit against the original prompt.

## Pass Criteria

A generated board passes this first eval if:

- `agentdraw validate` reports zero errors;
- `agentdraw quality` returns `verdict: "pass"` or every remaining weakness is explicitly accepted;
- the score is at least 20 out of 24;
- no single rubric dimension scores below 3;
- the scene remains editable `.agentdraw.json`, not a screenshot or static image.

## Evidence To Save

For each eval run, save:

- the prompt id;
- the generated `.agentdraw.json`;
- the validation JSON;
- a rendered preview or screenshot;
- the rubric scores and one short note on the biggest weakness.
