# Playbook: Technical Flowchart

Use this for Mermaid-first process logic, user journeys with decisions, engineering workflows,
validation loops, operational runbooks, and other structured diagrams when Mermaid supports the
grammar.

## Communication Job

Help the reader follow one process from start to finish and understand where decisions branch.
Prefer Mermaid for this playbook. Use SVG only when the user explicitly needs a custom explanatory
composition beyond Mermaid's diagram grammar.

## Information Model

Extract:

- Start and end states.
- Sequential actions.
- Decision points.
- Branch labels such as yes/no, pass/fail, cache hit/miss.
- Loops that retry or return to earlier steps.
- Error or fallback path.
- Final output or handoff.

## Layout Recipes

### Vertical Main Flow

Best default for professional flowcharts.

```text
(Start)
   |
[Action]
   |
<Decision?>
  yes -> [Success path] -> (End)
  no  -> [Fallback] -> [Retry or End]
```

### Split Lane Flow

Use when two actors or paths exist.

```text
User lane:    request -> input -> confirmation
System lane:  validate -> process -> response
Ops lane:     log -> alert -> review
```

### Happy Path Plus Exception Rail

Use when the happy path matters more than edge cases.

```text
Main center rail: normal flow
Right side rail: validation failures, fallback, retry
Side connectors: only from decision nodes
```

## Recommended Styles

- `system-formal`: standard technical process documentation.
- `blueprint-formal`: engineering flows, infra workflows, runbooks.
- `inkline`: precise line-driven diagrams.
- `raw-grid`: dense but readable technical explanation.
- `manual-cream`: runbook or operational procedure.

## Example Plan

```text
Scene: technical-flowchart
Provider: Mermaid because this is a structured flow with standard node and branch grammar
Audience: backend engineers
Reader question: What happens during user registration and login?
Main message: Registration and login share validation, error feedback, and a final session handoff.
Mermaid type: flowchart TD
Reading path: top-down with left registration branch and right login branch
Regions:
- Top entry: user visits auth page
- Decision: existing account?
- Left branch: registration input, validation, success
- Right branch: credential input, identity check, success
- Bottom join: create session and enter app
Connectors: real edge-to-edge arrows; loop arrows for invalid input
Style: system-formal because this is a technical product flow
Risks: do not use rectangles for start/end; avoid branch labels floating far from connectors
```

## Mini Mermaid Skeleton

Use Mermaid when the flow is conventional and does not need custom visual composition.

```mermaid
flowchart TD
  start([Start]) --> visit[User visits auth page]
  visit --> has{Existing account?}
  has -- No --> reg[Fill registration info]
  reg --> regValid{Info valid?}
  regValid -- No --> reg
  regValid -- Yes --> regOk[Registration success]
  has -- Yes --> login[Enter credentials]
  login --> loginValid{Identity valid?}
  loginValid -- No --> login
  loginValid -- Yes --> loginOk[Login success]
  regOk --> session[Create session]
  loginOk --> session
  session --> end([Enter app])
```

## SVG Notes

- Start/end should usually be ellipse or rounded capsule.
- Decisions should usually be diamonds.
- Action nodes should usually be rectangles.
- Branch labels must sit close to the branch line.
- Connector endpoints should land on shape edges, not centers.

## Anti-Patterns

- All nodes are rectangles, including decisions and start/end.
- Horizontal arrows too short to visually connect columns.
- Long branch labels floating away from their branch.
- Too many crossing lines because the layout uses a grid but the flow is not grid-like.
- Error loops are as visually prominent as the happy path.

## Quality Checklist

- There is exactly one clear start.
- End states are visually distinct.
- Every decision has labeled branches.
- Loops return to a meaningful previous step.
- The happy path is visible without tracing every fallback.
- Connectors attach to node edges and do not cross text.
