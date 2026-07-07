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
agentdraw repair <file> [--style <style-id>] [--write|--dry-run] [--format json|text]
agentdraw quality <file...> [--style <style-id>] [--format json|text]
agentdraw export <file> [--format svg|png] [--out <path>] [--scale <number>]
agentdraw combine <file...> [--out <path>] [--columns <n>] [--gap <px>] [--format json|text]
agentdraw gallery [output.html] [--open|--no-open] [--out <path>]
agentdraw validate-style [style-id...] [--format json|text]
agentdraw guide [workflow|quality|styles|style|contract|scene|patterns|rules] [style-id]
agentdraw schema [command] [--json]
agentdraw doctor
```

AgentDraw opens a local Excalidraw-based editor, saves back to `.agentdraw.json`, and validates common generated-diagram issues plus style-contract drift before users inspect the board.

For generated Excalidraw scenes, run `agentdraw guide patterns --json` before writing JSON and
`agentdraw repair <file> --style <style-id> --write --json` before the second validation pass.
Repair is conservative: it normalizes fonts, contained text geometry, vertical-centering fields,
connector defaults, and formal outer frames, but skips writing if validation would get worse.

When the user has not chosen a visual direction, run `agentdraw gallery --open` to generate a local
HTML theme gallery and ask which style they prefer.

For agents, prefer `--format json` or `--json`. Non-TTY command results default to JSON.

Repository: https://github.com/agentdraw/agentdraw
