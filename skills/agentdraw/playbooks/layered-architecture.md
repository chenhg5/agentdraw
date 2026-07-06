# Playbook: Layered Architecture

Use this for SVG-based architecture, structure, layer, capability, responsibility, and system
explanation visuals. Use Mermaid only when the user asks for a Mermaid-supported architecture or C4
diagram and a standard grammar is more important than custom composition.

## Communication Job

Help the reader answer:

- What are the main layers?
- What enters the system?
- What transforms or coordinates work?
- What stores state?
- What external dependencies exist?
- Where are the boundaries and responsibilities?

## Information Model

Extract:

- `entry`: users, agents, events, clients, triggers.
- `interface layer`: API, UI, gateway, command surface.
- `orchestration layer`: workflows, schedulers, agents, routing.
- `core services`: domain services or capabilities.
- `data/state layer`: databases, cache, queues, files, memory.
- `external systems`: third-party APIs, model providers, infra.
- `feedback loops`: validation, observability, human review.

Use 3-6 layers. More than 6 layers usually becomes unreadable.

## Layout Recipes

### Horizontal Stack

Use for technical architecture and platform maps.

```text
Title
Subtitle / system claim

[Entry / Clients]
        |
[Interface Layer]
        |
[Orchestration Layer]
        |
[Core Capability Layer: 3-5 modules]
        |
[State / Data Layer]
        |
[External Dependencies]
```

### Left-to-Right Pipeline With Support Layer

Use when the system is a transformation process.

```text
Input -> Intake -> Planner -> Executor -> Validator -> Output
          |          |          |           |
          +----------+----------+-----------+
                     Shared State / Memory
```

### Boundary Map

Use when the important idea is system boundary.

```text
Outer frame: Product / Runtime / Platform
Inside: owned components grouped by layer
Outside left: input actors
Outside right: external dependencies
Bottom: observability, data, governance
```

## Recommended Styles

- `system-formal`: serious technical docs and clear enterprise systems.
- `blueprint-formal`: infrastructure, deployment, engineering architecture.
- `runtime-doc`: agent/runtime diagrams and operations docs.
- `raw-grid`: dense technical explanation with visible structure.
- `boardroom`: executive architecture if the audience is non-technical.

## Example Plan

```text
Scene: layered-architecture
Provider: SVG because this needs custom layers, boundaries, and explanatory composition
Audience: engineering leads
Reader question: How does the local agent drawing loop work end to end?
Main message: AgentDraw turns prompt intent into validated, editable boards through a local loop.
Layout style: layered stack
Reading path: top-down layers
Regions:
- Header: title and one-line promise
- Input band: user, document, style preference
- Planning band: playbook, layout plan, style contract
- Rendering band: Mermaid/SVG source, importer, repair
- Quality band: validate, export preview, human edit
- State band: .agentdraw.json, recent files, design guides
Connectors: one central down arrow plus short side links to state
Style: runtime-doc because this is a local runtime workflow
Risks: avoid too many cross-layer arrows
```

## Mini SVG Skeleton

```svg
<svg width="1200" height="820" viewBox="0 0 1200 820" xmlns="http://www.w3.org/2000/svg">
  <rect x="64" y="64" width="1072" height="692" rx="8" fill="#FFFFFF" stroke="#172033" stroke-width="2"/>
  <text x="96" y="116" font-family="Inter, Arial" font-size="36" font-weight="700" fill="#172033">System title</text>
  <rect x="120" y="160" width="960" height="86" rx="6" fill="#F7F9FC" stroke="#172033" stroke-width="2"/>
  <text x="600" y="203" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial" font-size="22" font-weight="650" fill="#172033">Interface Layer</text>
  <rect x="120" y="286" width="960" height="120" rx="6" fill="#EEF4FF" stroke="#172033" stroke-width="2"/>
  <text x="600" y="346" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial" font-size="22" font-weight="650" fill="#172033">Orchestration Layer</text>
  <rect x="120" y="446" width="960" height="138" rx="6" fill="#F7F9FC" stroke="#172033" stroke-width="2"/>
  <text x="600" y="515" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial" font-size="22" font-weight="650" fill="#172033">Core Capabilities</text>
  <rect x="120" y="624" width="960" height="82" rx="6" fill="#EEF4FF" stroke="#172033" stroke-width="2"/>
  <text x="600" y="665" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial" font-size="22" font-weight="650" fill="#172033">State and Observability</text>
</svg>
```

## Anti-Patterns

- One giant unlabeled box containing many random cards.
- Every component connected to every other component.
- External systems inside the owned boundary.
- Tiny modules centered in wide lanes with no reason.
- Same-rank modules with different widths because text length varied.

## Quality Checklist

- The architecture has a titled boundary or explicit layers.
- Each layer name describes responsibility, not technology only.
- Horizontal alignment is consistent across bands.
- External systems are visually outside the owned system.
- Connectors show primary data/control flow only.
- The diagram still reads as a system when zoomed out.
