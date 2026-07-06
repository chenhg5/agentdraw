# System Notes: Local Agent Drawing Runtime

The local agent drawing runtime converts a user's request into an editable diagram through a
repeatable pipeline.

The entry layer receives the prompt, source documents, and optional style preference. It should not
start by drawing. It first decides the type direction: structured Mermaid diagram or explanatory SVG
visual.

The planning layer chooses a scene playbook and creates a layout plan. The design layer chooses a
visual style and loads its design contract. These two decisions are independent: the same style can
support several scenarios, and the same scenario can use different visual styles.

The rendering layer writes source SVG or Mermaid. SVG is used for high-design layouts. Mermaid is
used for conventional flows. The importer converts the source into editable AgentDraw JSON.

The quality layer runs repair, validation, and quality scoring. It also exports PNG previews so the
agent or user can inspect alignment, text fit, connector endpoints, and whitespace.

The editing layer opens a local browser editor. Users can manually adjust shapes, import another
JSON file, export PNG/SVG/JSON, and reopen recently viewed boards.

State lives in project-local `.agentdraw.json` files and local browser storage for recent boards.
External dependencies include the coding agent, npm package, browser, and optional model provider.
