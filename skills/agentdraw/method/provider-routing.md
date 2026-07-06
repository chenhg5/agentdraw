# Provider Routing

Choose the source provider before choosing a visual style. Provider choice is a hard routing
decision, not a styling preference.

Most document配图 requests are explanatory visual requests. If the user asks to read docs/articles
and "make some illustrations/boards", choose SVG unless they explicitly ask for a standard diagram
type or the core content is a real step-by-step process with decisions.

## Route To Mermaid

Use Mermaid when the requested drawing has a mature diagram grammar. This usually means the user
explicitly requested the diagram type, or the source's primary message is a process/interaction/data
model that would be clearer as formal notation:

- flowchart or decision flow;
- sequence diagram;
- class diagram;
- state diagram;
- ER diagram;
- journey diagram;
- timeline;
- Gantt or simple requirement diagram;
- simple C4/architecture diagram when standard notation matters more than custom composition.

Why: Mermaid gives structure, node types, connection semantics, and layout constraints that are more
stable than freehand SVG for grammar-heavy diagrams.

Do not use Mermaid just because a document has headings, lists, "five points", "three layers", or a
clear argument. That is content structure, not diagram grammar.

Mermaid output expectations:

- write a `.mmd` source first;
- use the native Mermaid diagram type, not `flowchart` as a replacement for every diagram;
- keep labels concise and branch labels close to edges;
- import with `agentdraw import-mermaid`;
- repair, validate, export, inspect, and revise.

## Route To SVG

Use restricted SVG when the requested drawing is an explanatory visual:

- article/blog/document/review image;
- concept or argument visual;
- architecture or structure explanation with custom grouping;
- mechanism map;
- layered stack;
- comparison or tradeoff matrix;
- loop/flywheel;
- pipeline with supporting context;
- slide-like single-page visual;
- concept map or orbit map.

Why: SVG gives composition control: canvas ratio, hierarchy, typography, panel geometry, spacing,
and custom layout.

SVG output expectations:

- choose a layout style before writing coordinates;
- write a `.svg` source using the AgentDraw supported subset;
- import with `agentdraw import-svg`;
- repair, validate, export, inspect, and revise.

## Ambiguous Cases

If the user says "architecture diagram":

- choose Mermaid only when they ask for C4, deployment, sequence, class, or standard notation;
- choose SVG when they want a polished explainer, article image, system map, or review visual.

If the user says "文档配图", "概念", "思考", "观点", "分析文章", or "review material":

- choose SVG by default;
- use `article-visual.md` for arguments, concepts, lessons, and thinking pieces;
- use `layered-architecture.md` only when the content is truly about system structure or component
  responsibilities;
- use Mermaid only if one selected board is specifically a flowchart/sequence/class/state/ER diagram.

If the user says "PPT" or "slide":

- choose SVG only for one editable slide-like visual;
- do not build a multi-page HTML deck inside AgentDraw.

If the user says "teaching" or "whiteboard":

- do not route to freehand sketch-note work by default;
- offer a structured Mermaid diagram or SVG explanatory visual instead.

## Required Note

Before generating, write one sentence:

```text
Provider: <Mermaid/SVG> because <reason tied to diagram grammar or custom composition>.
```
