# Playbook: PPT Visual

Use this for SVG-based slide-like single-page visuals, executive summary pages, strategy one-pagers,
sales narrative visuals, board-update visuals, and presentation sections.

This is still a drawing provider, not a full slide-deck or HTML/PPT generator. Use it when the user
wants one editable visual page that feels presentation-ready.

## Communication Job

Make one slide-worthy point with enough structure to support spoken explanation.

## Information Model

Extract:

- Slide headline as an assertion, not a topic label.
- 2-4 supporting pillars.
- One data point, risk, or proof point per pillar.
- Optional timeline, maturity ladder, or operating model.
- Closing implication.

## Layout Recipes

### Assertion Plus Three Pillars

```text
Headline: assert the point
Subhead: frame the audience value

[Pillar 1] [Pillar 2] [Pillar 3]

Bottom: decision / implication
```

### Executive Ladder

```text
Current state -> transition -> target state
Bottom band: business impact
```

### 2x2 Decision Frame

```text
Axis labels
Four quadrants
Highlight recommended quadrant
Short implication
```

## Recommended Styles

- `boardroom`: executive deck tone.
- `long-table`: structured strategy and meeting summaries.
- `system-formal`: technical executive summaries.
- `soft-editorial`: polished narrative slides.
- `bold-poster`: keynote-like high emphasis.

## Example Plan

```text
Scene: ppt-visual
Provider: SVG because this is a designed single-page visual, not a structured Mermaid diagram
Audience: product and engineering leadership
Reader question: Why invest in editable agent-generated diagrams?
Main message: Editable diagrams close the gap between fast AI drafts and trusted team artifacts.
Layout style: assertion pillars
Reading path: assertion -> three pillars -> investment implication
Regions:
- Header: assertion headline
- Three pillars: speed, quality loop, collaboration
- Proof strip: npm install, local browser, editable export
- Bottom decision: adopt for technical docs and agent workflows
Connectors: none or minimal; slide should read by grouping
Style: boardroom because the audience is leadership
Risks: too much text; keep each pillar to one short proof line
```

## Mini SVG Skeleton

```svg
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#F8FAFC"/>
  <text x="72" y="92" font-family="Inter, Arial" font-size="38" font-weight="760" fill="#172033">Editable AI diagrams become team artifacts</text>
  <text x="74" y="130" font-family="Inter, Arial" font-size="18" fill="#64748B">Fast generation is only useful when teams can inspect, revise, and reuse the result.</text>
  <rect x="72" y="190" width="344" height="260" rx="10" fill="#FFFFFF" stroke="#172033" stroke-width="2"/>
  <text x="104" y="250" font-family="Inter, Arial" font-size="26" font-weight="700" fill="#172033">Speed</text>
  <text x="104" y="306" font-family="Inter, Arial" font-size="18" fill="#64748B">Draft from prompt and source files.</text>
  <rect x="468" y="190" width="344" height="260" rx="10" fill="#FFFFFF" stroke="#172033" stroke-width="2"/>
  <text x="500" y="250" font-family="Inter, Arial" font-size="26" font-weight="700" fill="#172033">Quality loop</text>
  <text x="500" y="306" font-family="Inter, Arial" font-size="18" fill="#64748B">Validate, preview, repair, repeat.</text>
  <rect x="864" y="190" width="344" height="260" rx="10" fill="#FFFFFF" stroke="#172033" stroke-width="2"/>
  <text x="896" y="250" font-family="Inter, Arial" font-size="26" font-weight="700" fill="#172033">Collaboration</text>
  <text x="896" y="306" font-family="Inter, Arial" font-size="18" fill="#64748B">Open in browser and edit manually.</text>
  <rect x="72" y="520" width="1136" height="82" rx="8" fill="#172033"/>
  <text x="640" y="562" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial" font-size="24" font-weight="720" fill="#FFFFFF">Use AgentDraw where AI drafts must become editable documentation.</text>
</svg>
```

## Anti-Patterns

- Slide title is a vague noun phrase such as "AgentDraw Overview".
- More than four pillars.
- Dense paragraph cards.
- Flowchart complexity on a presentation slide.
- Decorative background that competes with the message.

## Quality Checklist

- The headline is an assertion.
- The slide can be understood in 10 seconds.
- Every card supports the headline.
- There is one visual hierarchy: title, pillars, implication.
- It would fit naturally inside a slide deck.
