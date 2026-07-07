---
version: 1.0
name: Infra Dark
provider: agentdraw
description: >
  A dark infrastructure and cloud-architecture design system with a slate grid canvas,
  mono-like technical labels, semantic component color buckets, crisp region boundaries,
  and disciplined edge-to-edge routing.
---

# Infra Dark

## Intent

Use for cloud architecture, Kubernetes/service mesh maps, network topology, security architecture,
data platform diagrams, and agent/tool runtime maps where technical components and flows must be
readable at a glance.

This is not an incident report theme. Use `incident-dark` for RCA/postmortems and `infra-dark` for
live architecture, deployment, infrastructure, and topology explanations.

## Palette

- Canvas: `#020617` deep slate.
- Grid/rule: `#1E293B`.
- Panel: `#0F172A`.
- Raised panel: `#111827`.
- Text: `#F8FAFC`.
- Muted text: `#94A3B8`.
- Frontend/edge: `#22D3EE` cyan.
- Backend/compute: `#34D399` emerald.
- Data/storage: `#A78BFA` violet.
- Cloud/region: `#FBBF24` amber.
- Security/auth: `#FB7185` rose.
- Message/event bus: `#FB923C` orange.
- External/generic: `#64748B` slate.

Use semantic colors by component role. Do not assign colors randomly just to create variety.

## Typography

- Font family: in SVG use `JetBrains Mono, SF Mono, Cascadia Code, Menlo, Consolas, Noto Sans SC, monospace` when available. If CJK text becomes cramped, use `Inter, Arial, Noto Sans SC, sans-serif` for body labels.
- Title: 38-48px, weight 750-850.
- Region label: 16-18px, weight 700.
- Component name: 18-22px, weight 700.
- Component detail: 14-16px.
- Port/protocol/metadata and legend labels: 13-15px, semantic color.

Keep labels concise. Use 2-4 lines per component: name, implementation/detail, and optional
protocol/port. Avoid long prose inside small infrastructure cards.
Never use 9-11px text for core information; tiny labels become unreadable after whiteboard import.

## SVG Source Rules

- Generate restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`, `defs`, and `marker`.
- Do not use `pattern`, `filter`, gradients, `foreignObject`, `image`, `clipPath`, `mask`, arbitrary `path` geometry, or text converted to outlines.
- Draw grid backgrounds as sparse explicit `line` elements if needed, not SVG `<pattern>`.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` for short centered labels. Use explicit `tspan` rows for details.
- Draw arrows before component cards when possible, then draw cards and text on top.
- Connector endpoints must touch the edge midpoint of a node or sit 2-6px outside the edge. Do not connect to corners or deep inside cards.

## Components

- **Canvas grid:** dark canvas with sparse `#1E293B` 1px grid lines or no grid if density is high.
- **Region boundary:** large rounded rectangle, transparent or very dark fill, dashed semantic stroke, 8-12px radius, label at top-left.
- **Component card:** dark base fill `#0F172A`, 1.5-2px semantic stroke, 6px radius, centered name and detail lines.
- **Security group:** rose dashed boundary or rose-stroked gateway/auth card.
- **Message bus:** thin orange rounded strip placed in the vertical/horizontal gap between services, not overlapping them.
- **Data store:** violet card; cylinder-like visuals are optional, but simple editable rectangles are preferred.
- **External actor:** slate card outside the owned region boundary.
- **Legend:** compact row or column outside all region boundaries; include only semantic colors used on the board.

## Layout Affinity

This style works best after choosing a technical layout pattern from
`method/technical-diagram-patterns.md`.

Strong pairings:

- `T01 Layered Infrastructure Stack` for cloud architecture and classic web stacks.
- `T02 Service Mesh Grid` for Kubernetes, microservices, event buses, and internal services.
- `T03 Cloud Region Boundary` for AWS/GCP/Azure region or VPC views.
- `T04 Agent Runtime Topology` for LLM, tools, memory, queues, and side effects.
- `T05 Data Flow Spine` for ETL, retrieval, indexing, and analytics pipelines.

Style application rules:

- Keep major components aligned to a grid; use consistent card widths inside each lane.
- Use semantic color as a border and small metadata text, not as full bright fills across the page.
- Place region boundaries behind components and keep at least 24px padding from boundary edges.
- Place legends below or to the side of boundaries, never inside a cluster where it competes with nodes.
- Use one main flow direction per board. Secondary flows can be dashed or muted.

## Connector Rules

- Prefer orthogonal `polyline` routes for multi-hop connections.
- Use straight `line` routes only when components share a row or column.
- Default to `#CBD5E1` for ordinary connector arrows on the dark canvas.
- Connector color does not have to be fixed. Use cyan `#22D3EE`, emerald `#34D399`, violet `#A78BFA`, amber `#FBBF24`, rose `#FB7185`, or orange `#FB923C` when the color explains the flow role.
- Keep connector/background contrast high. `#64748B` and darker gray are too low-contrast for primary flow on this canvas.
- Keep arrow paths at least 32px away from unrelated component interiors.
- Stagger multiple arrows by 12-20px.
- Offset arrow labels 6-10px from the line. If a label needs a background, use `#020617` or `#0F172A`.
- Use orange dashed lines for event/message flows and rose dashed lines for auth/security flows.
- Use plain lines with no arrowheads for grid lines, region borders, bus separators, and measurement guides.

## Best For

Kubernetes clusters, microservices, API gateways, serverless diagrams, network/security topology,
data platform flows, AI runtime infrastructure, queues, caches, object storage, and gateway/service
maps.

## Avoid

- Emoji and decorative cloud icons.
- Random rainbow color assignment.
- Glow effects, blur, gradients, or opacity-heavy glass effects.
- Legends inside cluster boundaries.
- Tiny 7-8px labels as core information.
- Diagonal arrows crossing through services.
- Message bus strips overlapping service cards.

## Self-Check

Before importing, verify:

- Every colored component uses the semantic bucket that matches its role.
- The owned system/region/cluster boundary is visible.
- The legend sits outside the largest boundary.
- Cards in the same lane share width, height, and x/y rhythm.
- Arrows connect at edge midpoints and do not enter node interiors except at the endpoint.
- The board remains readable when zoomed out: regions, lanes, and main flow direction are obvious.
