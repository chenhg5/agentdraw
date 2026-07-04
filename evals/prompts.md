# AgentDraw Eval Prompts

Use these prompts as black-box tests. Do not give the agent the rubric until after it produces a
first output, unless the eval is specifically testing self-review behavior.

## AD-EVAL-001: Multi-Agent Product Loop

Create an editable AgentDraw board that explains a local multi-agent product loop. It should show a
user request entering a planner agent, splitting into research, design, coding, and review agents,
then converging into validation and a browser preview. Make the diagram useful for a developer
deciding where to insert logging and human approval. Use a formal, square style.

Expected style candidates: `system-formal`, `blueprint-formal`, `raw-grid`.

## AD-EVAL-002: Incident Command Center

Create an editable incident response board for a payment outage. Show severity intake, owner
assignment, customer impact, mitigation, rollback, comms, and postmortem outputs. It should feel
like an operating review board, not a playful brainstorm.

Expected style candidates: `boardroom`, `system-formal`, `macchiato`.

## AD-EVAL-003: Customer Journey Signals

Create an editable customer journey map for a new analytics SaaS onboarding flow. Include stages
from signup to first dashboard, signals to watch, user emotions, failure points, and agent-assisted
interventions. The output should be warm and readable for product and support teams.

Expected style candidates: `coral`, `soft-editorial`, `berry-pop`.

## AD-EVAL-004: Research Synthesis Wall

Create an editable research synthesis wall for 12 interview notes about why teams abandon internal
AI tools. Cluster insights, show tensions, mark surprising quotes as editable text, and end with
three design principles. It should look like a designed synthesis wall, not a spreadsheet.

Expected style candidates: `violet-marker`, `reading-room`, `soft-editorial`.

## AD-EVAL-005: Roadmap Tradeoff Map

Create an editable roadmap tradeoff board for an agent drawing tool. Compare three initiatives:
better layout validation, richer design systems, and collaborative browser editing. Show effort,
impact, risk, dependencies, and a recommended sequence.

Expected style candidates: `mint-brut`, `raw-grid`, `pin-and-paper`.

## AD-EVAL-006: Event Bus Architecture

Create an editable architecture diagram for an event bus that connects browser sessions, local file
storage, CLI commands, validation workers, and export workers. Show data ownership, event names,
and failure boundaries. The diagram should be precise enough for an engineer to implement.

Expected style candidates: `blueprint-formal`, `system-formal`, `raw-grid`.

## AD-EVAL-007: Executive Decision Matrix

Create an editable executive decision matrix comparing whether a startup should build, buy, or
partner for a whiteboard canvas provider. Include criteria, weighted scores, risks, and a final
recommendation. Make it boardroom-ready.

Expected style candidates: `boardroom`, `long-table`, `monochrome`.

## AD-EVAL-008: Content Launch Room

Create an editable launch room board for a creator tool release. Show narrative pillars, channels,
creative assets, launch calendar, feedback loops, and metrics. It should feel energetic but still
organized enough for weekly execution.

Expected style candidates: `riso-brut`, `bold-poster`, `burst-panel`.
