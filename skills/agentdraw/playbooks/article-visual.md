# Playbook: Article Visual

Use this for SVG-based article, document, technical note, review brief, newsletter, blog post,
explainer, and concept visuals. The goal is not to document every detail; the goal is to make the
source's core idea memorable in one editable visual.

## Communication Job

Help a reader quickly grasp the article's core insight, remember the structure, and discuss the idea
in review or sharing contexts.

Use Mermaid instead when the source is asking for a standard flowchart, sequence diagram, class
diagram, state diagram, ER diagram, journey, or timeline. Use this playbook when the source needs a
designed explanatory composition.

If the source is a thinking piece, strategy note, concept explanation, or product/agent analysis,
do not turn it into Mermaid just because the document has sections, numbered ideas, or an implied
logical order. Extract the claim, tension, mechanism, and takeaway, then design an SVG visual.

## Information Model

Extract:

- One headline insight: what should the reader remember after 5 seconds?
- The article's tension: old model vs new model, problem vs solution, hidden mechanism, or tradeoff.
- 2-4 supporting ideas that prove or explain the insight.
- A locked layout style from `../method/layout-styles.md`, usually `L01 Contrast Split`,
  `L02 Center Mechanism`, `L05 Loop / Flywheel`, `L06 Matrix`, `L08 Orbit Map`,
  `L10 Hero Evidence`, `L11 Bento Brief`, or `L12 Decision Ladder`.
- A memorable metaphor only if the source naturally supports it.
- One takeaway or implication.

Do not include every section from the article. A strong visual image is selective.

## Layout Recipes

### Contrast Split

```text
Left: old / weak / painful state
Center: key shift, mechanism, or bridge
Right: new / strong / desired state
Bottom: why the shift matters
```

Use when the article argues that readers should change how they think.

### Center Mechanism

```text
Top: sharp article claim
Center: one mechanism, loop, or engine
Around it: 3-4 causes, effects, controls, or failure modes
Bottom: practical takeaway
```

Use when the article explains why something happens.

### Before / After

```text
Left: old mental model
Center: shift / mechanism
Right: new mental model
Bottom: why it matters
```

### Loop Or Flywheel

```text
Stage 1 -> Stage 2 -> Stage 3 -> Stage 4 -> back to Stage 1
Center: what compounds or breaks the loop
Side: one warning or leverage point
```

Use when the article describes a quality loop, operating cycle, growth loop, or feedback system.

### Map Or Stack

```text
Top: headline claim
Main: landscape zones, layers, or responsibility bands
Side: reader orientation notes
Bottom: takeaway / next action
```

## Recommended Styles

- `soft-editorial`: polished long-form article visuals.
- `editorial-forest`: thoughtful analysis and knowledge work.
- `riso-brut`: energetic public explainers.
- `bold-poster`: strong social graphic with a clear claim.
- `cut-bloom`: friendly product/agent articles.
- `archive-shelf`: research synthesis and reading-room tone.

## Example Plan

```text
Scene: article-visual
Provider: SVG because this is an explanatory article image, not a Mermaid grammar diagram
Audience: technical newsletter readers
Reader question: Why do agent diagrams still look weak?
Main message: Output quality depends on expression strategy, not just visual style.
Layout style: L01 Contrast Split because the source argues weak theme-only output versus stronger
playbook-led output.
Reading path: headline -> contrast -> 3-part loop -> takeaway
Regions:
- Header: "Style is not strategy"
- Left panel: weak approach, "theme-only"
- Right panel: strong approach, "playbook + style + validation"
- Middle bridge: arrow labeled "expression strategy"
- Bottom: three reusable practices
Connectors: one central contrast arrow, no dense network
Style: soft-editorial because the board supports an article argument
Risks: avoid making it look like a technical architecture diagram
```

## Mini SVG Skeleton

```svg
<svg width="1280" height="760" viewBox="0 0 1280 760" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="760" fill="#FFFDF8"/>
  <text x="80" y="104" font-family="Inter, Arial" font-size="44" font-weight="750" fill="#1F2937">Style is not strategy</text>
  <text x="82" y="145" font-family="Inter, Arial" font-size="19" fill="#5B6472">Better diagrams start with expression patterns, then visual design.</text>
  <rect x="80" y="210" width="500" height="300" rx="12" fill="#F5F1E8" stroke="#1F2937" stroke-width="2"/>
  <text x="120" y="270" font-family="Inter, Arial" font-size="28" font-weight="700" fill="#1F2937">Theme-only output</text>
  <text x="120" y="324" font-family="Inter, Arial" font-size="18" fill="#5B6472">Same boxes, new colors</text>
  <text x="120" y="360" font-family="Inter, Arial" font-size="18" fill="#5B6472">No reading path</text>
  <text x="120" y="396" font-family="Inter, Arial" font-size="18" fill="#5B6472">Weak alignment discipline</text>
  <rect x="700" y="210" width="500" height="300" rx="12" fill="#EAF2FF" stroke="#1F2937" stroke-width="2"/>
  <text x="740" y="270" font-family="Inter, Arial" font-size="28" font-weight="700" fill="#1F2937">Playbook-led output</text>
  <text x="740" y="324" font-family="Inter, Arial" font-size="18" fill="#5B6472">Scene structure first</text>
  <text x="740" y="360" font-family="Inter, Arial" font-size="18" fill="#5B6472">Style supports intent</text>
  <text x="740" y="396" font-family="Inter, Arial" font-size="18" fill="#5B6472">Validation closes the loop</text>
  <rect x="80" y="588" width="1120" height="76" rx="10" fill="#1F2937"/>
  <text x="640" y="626" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial" font-size="22" font-weight="700" fill="#FFFFFF">Choose the scene playbook before choosing the style.</text>
</svg>
```

## Anti-Patterns

- Trying to include every paragraph from the source.
- Starting with a style or theme before extracting the article's core message.
- Making a three-card row by default.
- Dense tables unless the article is explicitly data-heavy.
- Decorative icons that do not carry meaning.
- Vague labels such as "Step 1" and "Step 2" instead of reader-facing ideas.
- A generic architecture layout for an opinion or explanatory article.
- A slide-like executive layout unless the user explicitly asked for a slide.
- A Mermaid-style flowchart for a conceptual or argumentative document.

## Quality Checklist

- The board has one sharp headline or central claim.
- It has one clear layout style.
- It contains 2-4 supporting ideas, not 12.
- It is legible as a thumbnail.
- The visual metaphor or contrast supports the article argument.
- The takeaway is visible without reading every card.
- A reader can explain why this visual belongs to this article specifically.
