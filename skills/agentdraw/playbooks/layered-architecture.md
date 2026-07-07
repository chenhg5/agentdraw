# Playbook: Layered Architecture

Use this for systems, layers, responsibilities, capability maps, boundaries, architecture explainers,
and operating-model visuals. The output is usually restricted SVG.

## Content Job

Help the reader answer:

- what the system is;
- where work enters;
- which layers transform, route, or coordinate work;
- where state/data/memory lives;
- which dependencies sit outside the owned boundary;
- where feedback, validation, observability, or human review happens.

Extract:

- 3-6 major layers or zones;
- named responsibilities, not only technology names;
- external actors/dependencies;
- primary flow direction;
- one key architectural takeaway.

Omit:

- every internal module if it does not change the reader's understanding;
- all-to-all connector networks;
- vague boxes such as "platform" without role labels.

## Provider

Use SVG for custom architecture, boundaries, layered systems, and capability maps. Use Mermaid only
when a standard Mermaid grammar such as C4, flowchart, or sequence diagram is clearly the better
fit.

## Layout

Use `../method/technical-diagram-patterns.md` when the architecture is cloud, Kubernetes,
microservices, network/security, data platform, or agent runtime topology. Use
`../method/layout-styles.md` for broader architecture, responsibility, abstraction, capability, or
mechanism maps.

Good formal starting layouts:

- layered stack for responsibility layers;
- boundary map for owned vs external systems;
- pipeline plus support layer for transformation systems;
- matrix or bento only when modules are peers.

Good technical patterns:

- `T01 Layered Infrastructure Stack`: classic client/gateway/service/data architecture.
- `T02 Service Mesh Grid`: Kubernetes or microservice topology.
- `T03 Cloud Region Boundary`: AWS/GCP/Azure region, VPC, namespace, or cluster scope.
- `T04 Agent Runtime Topology`: LLM, tools, memory, queues, and side effects.
- `T05 Data Flow Spine`: indexing, retrieval, analytics, or observability flow.

If the architecture is for an article/review/executive explanation, also consider
`../method/editorial-layouts.md` so it remains designed and memorable instead of becoming a dry
technical inventory.

## Style

Recommended styles: `system-formal`, `blueprint-formal`, `runtime-doc`, `raw-grid`, `boardroom`,
`infra-dark`.

If the user names a style, keep it, but still choose an explicit layout. For `boardroom`, include a
dark command panel, dominant statement, target state, or decision strip.

## Quality Checklist

- The boundary is explicit.
- Layers or zones have consistent alignment and spacing.
- External dependencies are visually outside the owned system.
- Connectors show only primary relationships.
- Same-rank modules use consistent dimensions unless emphasis is intentional.
- The board has a clear takeaway, not just a map of boxes.
