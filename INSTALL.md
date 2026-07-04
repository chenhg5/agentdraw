# Install AgentDraw

AgentDraw has two parts:

- the npm CLI: `@aidraw/agentdraw`
- the agent skill: `agentdraw`

## Recommended: Ask Your Agent To Install It

Paste this into Codex, Claude Code, Cursor, or another coding agent:

```text
Install AgentDraw for this machine. Prefer:
npm install -g @aidraw/agentdraw
npx skills add chenhg5/agentdraw --skill agentdraw -g -y
Then verify with:
agentdraw doctor --json
agentdraw guide styles --json
```

Or give the agent the install document directly:

```text
Read and follow:
https://raw.githubusercontent.com/chenhg5/agentdraw/main/INSTALL.md
```

Direct skill file:

```bash
curl -fsSL https://raw.githubusercontent.com/chenhg5/agentdraw/main/skills/agentdraw/SKILL.md
```

## One-Line Shell Install

```bash
npm install -g @aidraw/agentdraw && npx skills add chenhg5/agentdraw --skill agentdraw -g -y
```

## Install Only The Skill

The skill can use `npx @aidraw/agentdraw@latest`, so a global CLI install is optional:

```bash
npx skills add chenhg5/agentdraw --skill agentdraw -g -y
```

Target one agent explicitly:

```bash
npx skills add chenhg5/agentdraw --skill agentdraw -g -a codex -y
npx skills add chenhg5/agentdraw --skill agentdraw -g -a claude-code -y
npx skills add chenhg5/agentdraw --skill agentdraw -g -a cursor -y
```

## Human CLI Install

```bash
npm install -g @aidraw/agentdraw
agentdraw --help
agentdraw guide
```

Run without installing:

```bash
npx @aidraw/agentdraw@latest import-svg board.svg --out board.agentdraw.json --style boardroom --json
npx @aidraw/agentdraw@latest open board.agentdraw.json --no-open
```
