# agentdraw

Local-first editable whiteboard workspace for coding agents.

```bash
npm install -g @aidraw/agentdraw
agentdraw open board.agentdraw.json
```

Or run without installing:

```bash
npx @aidraw/agentdraw open board.agentdraw.json
```

Commands:

```bash
agentdraw open [file] [--port 3927] [--no-open]
agentdraw validate <file>
```

AgentDraw opens a local Excalidraw-based editor, saves back to `.agentdraw.json`, and validates common generated-diagram issues before users inspect the board.

Repository: https://github.com/chenhg5/agentdraw
