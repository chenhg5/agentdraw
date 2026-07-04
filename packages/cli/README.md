# agentdraw

Local-first editable whiteboard workspace for coding agents.

```bash
npm install -g @aidraw/agentdraw
agentdraw open board.agentdraw.json --background --open
```

Or run without installing:

```bash
npx @aidraw/agentdraw@latest open board.agentdraw.json --background --open
```

Commands:

```bash
agentdraw --help
agentdraw open [file] [--host 127.0.0.1] [--port 3927] [--open|--no-open] [--background]
agentdraw init [file]
agentdraw validate <file...> [--style <style-id>] [--format json|text]
agentdraw quality <file...> [--style <style-id>] [--format json|text]
agentdraw export <file> [--format svg|png] [--out <path>] [--scale <number>]
agentdraw validate-style [style-id...] [--format json|text]
agentdraw guide [workflow|styles|style|contract|scene|rules] [style-id]
agentdraw schema [command] [--json]
agentdraw doctor
```

AgentDraw opens a local Excalidraw-based editor, saves back to `.agentdraw.json`, and validates common generated-diagram issues plus style-contract drift before users inspect the board.

For agents, prefer `--format json` or `--json`. Non-TTY command results default to JSON.

Repository: https://github.com/chenhg5/agentdraw
