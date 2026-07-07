# Technical Diagram Patterns

Use this file for SVG-based technical diagrams where the result should be editable but still obey
technical-diagram grammar. These patterns sit between formal Mermaid diagrams and free-form
editorial visuals.

Use Mermaid instead when the user explicitly asks for a standard flowchart, sequence diagram, class
diagram, state diagram, ER diagram, or Mermaid-supported timeline and the standard notation is more
important than custom visual composition.

Use these patterns when the user asks for:

- cloud architecture, Kubernetes, service mesh, microservices, network topology;
- security/auth topology;
- AI agent runtime, tool/memory architecture, queue/cache/storage maps;
- data flow, retrieval/indexing pipelines, observability maps;
- technical diagrams that need semantic colors, clusters, boundaries, and custom layout.

## Universal Rules

- Choose one dominant flow direction: left-to-right for request/data flow, top-to-bottom for layered
  ownership or lifecycle.
- Keep component edge-to-edge spacing at least 64px. Use 80px when arrows or labels pass between
  components.
- Keep region boundary padding at least 24px.
- Keep arrow paths at least 32px from unrelated component interiors.
- Connect arrows to edge midpoints or a clear side offset, never to corners.
- Use orthogonal routes for multi-step flows. Avoid long diagonals through component fields.
- Put arrows behind component cards when the route is structural; draw labels above lines.
- Offset arrow labels 6-10px from the path. Use a small background only when offset is insufficient.
- Stagger parallel arrows by 12-20px.
- Put legends outside the largest boundary region.
- Use real editable text. Do not use icons or screenshots when a labeled shape is enough.

## Semantic Color Buckets

When the chosen style supports semantic infrastructure colors, keep the mapping stable:

| Role | Meaning |
| --- | --- |
| Frontend / Edge | client, browser, CDN, edge entry |
| Gateway / Security | API gateway, auth, policy, firewall, identity |
| Backend / Compute | services, workers, functions, orchestration |
| Data / Storage | database, cache, vector store, object storage, files |
| Message / Event Bus | queue, topic, event bus, pub/sub, broker |
| Cloud / Region | VPC, region, cluster, account, namespace |
| External / Generic | third-party, user, partner, unknown system |

If the selected design style does not define these exact colors, preserve the semantic mapping using
the nearest approved colors from its contract.

## T01 Layered Infrastructure Stack

Use for classic web/cloud architecture: clients, gateway, services, and data/storage.

Structure:

```text
Title + short subtitle
External actors outside the owned boundary
Owned region boundary
Layer 1: edge/gateway
Layer 2: backend/compute services
Layer 3: data/storage/cache
Legend outside the boundary
```

Rules:

- Make each layer visually distinct through region labels or shared y positions.
- Cards in the same layer share height and usually share width.
- Use one primary request path. Secondary paths should be dashed or muted.
- Put external actors outside the boundary and connect inward.
- Use `infra-dark`, `blueprint-formal`, `system-formal`, or `runtime-doc`.

## T02 Service Mesh Grid

Use for Kubernetes, microservices, event buses, and service-to-service topology.

Structure:

```text
Left: clients and edge gateways
Center: service grid inside cluster boundary
Between service rows or columns: event/message bus strips
Right: data stores and external dependencies
Bottom/right: legend outside cluster
```

Rules:

- Service cards in the mesh should share width/height and align to columns.
- Event bus strips sit in the gap between services, never overlapping service cards.
- Use dashed or orange routes for async events and solid routes for request/response.
- Do not draw every possible service-to-service dependency. Show the few paths that explain the system.
- Use `infra-dark`, `blueprint-formal`, `neon-grid`, or `raw-grid`.

## T03 Cloud Region Boundary

Use for AWS/GCP/Azure regions, VPCs, accounts, namespaces, security groups, and deployment scopes.

Structure:

```text
Cloud/provider region boundary
Nested VPC/subnet/security boundaries when needed
Entry component on one side
Compute/service layer
Managed data/services layer
Legend below or outside the boundary
```

Rules:

- Boundaries must have visible labels and enough internal padding.
- Avoid more than two nested boundary levels in one board.
- Region boundaries are not content cards. They should sit behind components.
- Security boundaries use dashed strokes and should not hide node text.
- Use `infra-dark`, `blueprint-formal`, `runtime-doc`, or `system-formal`.

## T04 Agent Runtime Topology

Use for LLM agent systems, tool execution, memory, retrieval, queues, and side effects.

Structure:

```text
Input / trigger
Agent core or planner
Tool execution lane
Memory lane: working, short-term, long-term, external store
Output / side effects
Observability or policy strip
```

Rules:

- Separate read and write paths visually. Use solid for read/retrieve and dashed for write/store.
- Memory tiers should be aligned as a lane or stack, not scattered around the agent.
- Tool calls should leave the agent core, pass through a tool boundary, then return or emit a side effect.
- If showing a loop, keep the loop outside text-heavy cards.
- Use `infra-dark`, `runtime-doc`, `blueprint-formal`, `neon-grid`, or `system-formal`.

## T05 Data Flow Spine

Use for ETL, retrieval, indexing, analytics, observability, and data product flows.

Structure:

```text
Left: sources
Center spine: ingest -> transform -> index/serve
Top/bottom lanes: control, validation, observability, policy
Right: consumers or outputs
```

Rules:

- Label arrows with data type or operation, not vague verbs.
- Use thicker or brighter stroke only for the primary data path.
- Keep control/trigger flows dashed and visually secondary.
- Do not cross labels with data arrows; move labels above/below the spine.
- Use `infra-dark`, `blueprint-formal`, `runtime-doc`, `raw-grid`, or `neon-grid`.

## T06 Network / Security Topology

Use for firewall, VPN, DMZ, private subnet, identity, and perimeter diagrams.

Structure:

```text
Internet / users
Edge / WAF / firewall
DMZ or public subnet
Private services
Data/private subnet
Security/auth/observability side lane
```

Rules:

- Use boundaries for trust zones, not decorative boxes.
- Auth/security flows should be rose/dashed or otherwise visually distinct.
- Avoid placing security labels directly on top of traffic arrows.
- Keep network device labels short; details can live in small metadata lines.
- Use `infra-dark`, `blueprint-formal`, `incident-dark`, or `system-formal`.

## Style Fit Matrix

| Pattern | Strong styles | Avoid / caution |
| --- | --- | --- |
| T01 Layered Infrastructure Stack | `infra-dark`, `blueprint-formal`, `system-formal`, `runtime-doc` | playful styles with loose geometry |
| T02 Service Mesh Grid | `infra-dark`, `blueprint-formal`, `neon-grid`, `raw-grid` | soft editorial themes if many arrows are needed |
| T03 Cloud Region Boundary | `infra-dark`, `blueprint-formal`, `runtime-doc`, `system-formal` | high ornament themes |
| T04 Agent Runtime Topology | `infra-dark`, `runtime-doc`, `blueprint-formal`, `neon-grid` | pure Mermaid unless the user needs a formal flowchart |
| T05 Data Flow Spine | `infra-dark`, `blueprint-formal`, `runtime-doc`, `raw-grid`, `neon-grid` | styles with weak connector contrast |
| T06 Network / Security Topology | `infra-dark`, `blueprint-formal`, `incident-dark`, `system-formal` | glass/soft styles with low line precision |

## Required Note

Before generating SVG, write:

```text
Technical pattern: <Txx name> because <reason tied to the system structure>.
Design style: <style-id> because <reason tied to audience and tone>.
Main flow direction: <left-to-right | top-to-bottom | radial>.
Semantic colors: <roles used and their meaning>.
```
