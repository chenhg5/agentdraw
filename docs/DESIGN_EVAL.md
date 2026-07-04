# AgentDraw Design Evaluation

AgentDraw design changes should be tested before publishing. Do not rely on a single hand-made
example or a package release to judge quality.

## Goal

Evaluate whether a fresh agent can read the AgentDraw skill and produce editable boards that are
visually stable, aligned, readable, and faithful to a source document.

This is intentionally a human-in-the-loop eval. The CLI can catch mechanical issues, but final
visual quality still needs a reviewer.

## Run A Local Eval

Prepare an eval package without running an agent:

```bash
pnpm eval:design -- --source <source-document.md>
```

You can also provide the source through an environment variable:

```bash
AGENTDRAW_EVAL_SOURCE=<source-document.md> pnpm eval:design
```

If the source path does not exist locally, the script tries to copy it from a remote host over SSH:

```bash
pnpm eval:design -- --source <remote-source.md> --ssh-user <user> --ssh-host <host> --ssh-port <port>
```

The script writes:

- `prompt.md`: the isolated-agent task prompt;
- `rubric.md`: the human rating rubric;
- `input/<source>.md`: the copied source document;
- `outputs/`: where the generated SVG, AgentDraw JSON, PNG previews, and notes should go.

Run an isolated agent automatically:

```bash
pnpm eval:design -- --agent codex
```

or:

```bash
pnpm eval:design -- --agent claude
```

The script asks the agent to create three boards:

- `cache-economics`;
- `prefix-mechanics`;
- `engineering-discipline`.

After the agent finishes, the script post-runs `agentdraw validate`, `agentdraw quality`, and PNG
export for every generated `.agentdraw.json` it finds under `outputs/`.

## Human Rating

Open the generated PNG previews and rate each board from 1 to 5 on:

- visual structure;
- alignment and spacing;
- style fidelity;
- readability;
- content fit;
- editability.

Suggested pass bar:

- average score >= 4.0;
- no dimension below 3.

## When To Publish

Do not publish only because typecheck passes.

Publish after:

- `pnpm typecheck` passes;
- `pnpm agentdraw validate-style <changed-style> --format json` passes;
- an isolated eval run produces boards that pass CLI quality or have clearly acceptable warnings;
- human review says the generated previews are good enough to be public examples.

## What To Fix From Eval Results

If boards are aligned but ugly, improve the selected `design.md` with stronger layout language,
composition recipes, and negative examples.

If boards are structurally good but mechanically weak, improve `agentdraw quality` or `repair`.

If agents repeatedly choose the same unsuitable style, improve `skills/agentdraw/SKILL.md` and
`agentdraw guide styles`.
