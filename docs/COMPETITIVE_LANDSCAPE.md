# Competitive Landscape

This is a working note for positioning AgentDraw and deciding what to learn from adjacent products.

## AgentDraw Position

AgentDraw is a local-first editable whiteboard workflow for coding agents. Its core bet is that
agent-generated diagrams need more than a renderer:

- a CLI that agents can discover and run;
- local structured files that can live beside code;
- browser editing for the human handoff;
- design systems written for agents;
- validation and quality scoring before the user sees the result.

## Categories

### Canvas Engines

- [Excalidraw](https://excalidraw.com/) and [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw):
  open-source whiteboard with a hand-drawn feel, JSON scenes, and SVG/PNG export. AgentDraw currently
  uses Excalidraw as its first provider.
- [tldraw](https://www.tldraw.com/) and [tldraw SDK](https://tldraw.dev/): polished infinite-canvas
  whiteboard and SDK with strong extensibility, collaboration, custom shapes, and programmatic canvas
  control.
- [draw.io / diagrams.net](https://www.drawio.com/) and [jgraph/drawio](https://github.com/jgraph/drawio):
  mature open-source formal diagramming, privacy-first storage choices, broad diagram vocabulary, and
  a heavy manual editing surface.

What to study:

- provider APIs and import/export formats;
- text measurement, binding, and connector routing;
- canvas fit-to-content behavior;
- formal diagram styling without making the editor too heavy.

### Text-To-Diagram Tools

- [Mermaid](https://mermaid.js.org/): Markdown-inspired text definitions for diagrams and charts.
- [PlantUML](https://plantuml.com/): text-based UML and system diagrams with many supported diagram
  types.
- [D2](https://d2lang.com/): declarative diagramming language that turns text into diagrams, with
  themes and layout engines.

What to study:

- compact agent-friendly syntax;
- deterministic layout and source control friendliness;
- linting or quality checks;
- possible import path from Mermaid/D2 into editable AgentDraw scenes.

### AI Diagram And Whiteboard Products

- [Miro AI diagram generator](https://miro.com/ai/diagram-ai/): cloud whiteboard that generates
  editable diagrams from prompts across common diagram types.
- [FigJam AI](https://www.figma.com/figjam/ai/): AI-assisted collaborative whiteboarding and template
  generation inside the Figma ecosystem.
- [Boardmix AI Agents](https://boardmix.com/ai-agent/): AI whiteboard positioning around many agents,
  diagrams, mind maps, documents, and workflow automation.
- [Jeda AI Whiteboard](https://www.jeda.ai/ai-whiteboard): prompt-to-editable visual canvas for
  diagrams, infographics, wireframes, and analytical boards.
- [Zoom AI Whiteboard](https://www.zoom.com/en/products/online-whiteboard/features/ai-whiteboard/):
  AI-assisted whiteboard generation for diagrams, flowcharts, and mind maps inside Zoom.
- [Eraser AI / DiagramGPT](https://www.eraser.io/diagramgpt): technical AI diagrams from plain
  English or code snippets, with diagram-as-code output and team workflows.

What to study:

- prompt-to-editable UX;
- progressive rendering and replay;
- how generated output remains editable;
- templates and domain-specific diagram types;
- collaboration, sharing, and export flows.

## Initial Differentiation

AgentDraw should not try to out-feature large whiteboard suites. The sharper position is:

- local-first and installable by an agent;
- structured editable files, not remote-only workspaces;
- design guidance that the agent can read before drawing;
- validation that catches likely visual failures;
- provider-agnostic architecture so Excalidraw, tldraw, or other renderers can be evaluated without
  replacing the skill and CLI workflow.

## Open Questions

- Should AgentDraw support a text-to-diagram import path for Mermaid, D2, or PlantUML?
- Should tldraw become a second provider, or should Excalidraw remain the only provider until quality
  gates are stronger?
- Can we add a formal-layout helper for architecture diagrams without taking on a full draw.io-style
  editor?
- How should quality scoring combine static geometry checks with screenshot-based visual inspection?
- What should the minimal collaboration story be: local handoff only, shared file, or live multiplayer?
