# Local Agent Drawing Runtime Milestones

Goal: tell the product story of AgentDraw as a version/milestone ribbon.

Timeline:

- v0.1: Excalidraw JSON editor. Local webpage opens generated boards for manual editing.
- v0.2: Style contracts. Agents can select visual themes instead of raw colors.
- v0.3: SVG import path. Agents create designed SVG first, then convert to editable boards.
- v0.4: Quality checks. Validator catches overlap, tiny text, connector mistakes, and bad fit.
- v0.5: Editorial layouts. Magazine-like boards become the default for article visuals.
- v0.6: Mermaid bridge. Formal diagrams can start from Mermaid when grammar matters.

Turning point:

- v0.3 changed the project from "generate Excalidraw JSON" to "design first, then convert".

Current lesson:

- editable boards are most valuable when the visual is already close enough for a human to adjust,
  not when the user must redesign everything from scratch.

Next direction:

- faster eval loops and stronger layout guidance for repeatable quality.
