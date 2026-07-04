---
version: 1.0
name: Blueprint Formal
provider: agentdraw
description: >
  A technical blueprint style for architecture, event buses, protocols, and systems.
  Blue ink, straight routing, white cards, and diagrammatic spacing.
---

# Blueprint Formal

Use this style for technical maps where the relationships matter more than decoration.

## Palette

- `canvas`: `#F8FBFF`.
- `ink`: `#163B68`.
- `panel`: `#FFFFFF`.
- `accent`: `#0B63CE` for backbone rails and active routes.
- `accent2`: `#DBEAFE` for secondary modules.
- `muted`: `#5B708A` for labels.

## Typography

- Font family: use Excalidraw sans (`fontFamily: 2`) for readable multilingual text; avoid Virgil/handwritten text unless the user explicitly asks for it.

- Title: 32-38px.
- Module title: 19-22px.
- Module body: 14-16px.
- Backbone label: 16-18px, all-caps only for short technical phrases.

## Components

- Use an outer blueprint frame or titled system boundary for architecture, layered system, and workflow diagrams.

- `module`: white rectangle, 2px blue border, centered title and two-line body.
- `backbone`: thick horizontal accent rail with white text.
- `store`: secondary rectangle below the backbone.
- `route`: vertical or elbow connector into the backbone.

## Layout

Use a central bus or rail. Producers and consumers sit above; stores and outputs sit below. Keep connector geometry orthogonal.

## Avoid

- organic shapes;
- rough hand-drawn styling;
- large saturated blocks outside the backbone;
- diagonal routes when an elbow route is clearer.
