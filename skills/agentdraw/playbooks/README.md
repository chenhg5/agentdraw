# AgentDraw Scene Playbooks

Scene playbooks describe how to organize information. Design styles describe how the board looks.
AgentDraw's primary use case is turning articles, documents, technical notes, review briefs, and
ideas into editable visual explanations. Choose the visual explanation strategy before choosing a
style.

## Available Playbooks

- `article-visual.md`: default for articles, documents, review briefs, newsletters, and public idea visuals.
- `layered-architecture.md`: supporting playbook when the source's core idea is system structure.
- `technical-flowchart.md`: supporting playbook when the source's core idea is process logic or decisions.
- `teaching-board.md`: supporting playbook when the source's core idea is best taught through a worked example.
- `ppt-visual.md`: secondary playbook for explicit slide-like visuals only.

## Routing Rules

- If the user gives an article, document, technical note, or review brief and asks for a good image,
  illustration, diagram, or visual, start with `article-visual.md`.
- If the source's main point is "how this system is structured", adapt `layered-architecture.md`.
- If the source's main point is "what process or decision path happens", adapt `technical-flowchart.md`.
- If the source's main point is "teach this concept to a learner", adapt `teaching-board.md`.
- If the user explicitly asks for a slide, deck page, or leadership slide visual, use `ppt-visual.md`.

If two playbooks fit, choose the one that best helps the article image communicate one memorable
message. For example, "explain cache invalidation in a technical blog" usually starts as
`article-visual.md` with a mechanism pattern, while "teach cache invalidation to junior engineers"
should use `teaching-board.md`.

## Provider Bias

- Prefer restricted SVG for article visuals, architecture explainers, mechanism maps, and custom
  editable layouts.
- Prefer Mermaid for standard flowcharts, sequence diagrams, or state diagrams.
- Avoid HTML/page design unless the user explicitly says the output does not need to be editable as
  a drawing.
