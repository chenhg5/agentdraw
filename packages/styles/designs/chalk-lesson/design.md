---
version: 1.0
name: Chalk Lesson
provider: agentdraw
description: >
  A Khan-style teaching board with dark slate background, chalk-colored annotation,
  worked examples, underlines, circled key terms, and step-by-step derivation.
---

# Chalk Lesson

## Intent

Use for tutoring, classroom explanation, live concept walkthroughs, worked examples, formulas,
debugging lessons, and "teach me why this happens" prompts.

This is not a card-board style. The board should feel like an instructor is explaining on a digital
blackboard: a question, a concrete example, a progressive derivation, and a final rule.

## Palette

- Canvas: `#101820`.
- Ink: `#F7F3E8`.
- Panel: `#182631` for subtle grouped regions only.
- Highlight yellow: `#F4D35E`.
- Chalk teal: `#7FDBCA`.
- Muted chalk: `#A8B3C1`.
- White and transparent are allowed for editable text and open regions.

## Typography

- Font family: `Inter, Arial, Noto Sans SC, sans-serif`.
- Do not use handwritten fonts for Chinese or mixed-language boards. Create the board feeling with
  chalk marks, not fragile script fonts.
- Title: 34-46px, weight 760-850.
- Step heading: 22-28px, weight 720-820.
- Body and annotations: 17-21px, weight 500-680.
- Formula/code/example tokens: 18-24px, use clear spacing and real text.

## SVG Source Rules

- Generate restricted SVG first, then convert with `agentdraw import-svg`.
- Use only `svg`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`,
  `tspan`, `defs`, and `marker` for editable boards.
- Use real text, not outlined text or screenshots.
- Use `line` and `polyline` for chalk underlines, brackets, arrows, and circled emphasis.
- Use `text-anchor="middle"` and `dominant-baseline="middle"` only for compact labels. Most
  teaching text should be left-aligned like board writing.
- Avoid `foreignObject`, `image`, `clipPath`, `mask`, `filter`, gradients, arbitrary `path`
  geometry, and rasterized formulas.

## Components

- **Lesson question:** large top-left title, usually phrased as a question.
- **Worked example strip:** a sequence of real tokens, formula terms, or miniature states with one
  changed part highlighted.
- **Instructor annotation:** small chalk text near the example, connected with a short line or
  bracket.
- **Derivation steps:** 3-5 numbered lines or loose regions, not equal card tiles.
- **Chalk underline:** 2-4px yellow or teal line under the key phrase.
- **Circle emphasis:** ellipse around one token or term, never around every item.
- **Rule box:** one restrained final takeaway region, often bottom-right or bottom band.

## Layout

- Prefer an open board over boxed cards. Use at most 1-2 subtle panels for grouping.
- Create a natural teaching path: question -> example -> reveal the surprising change -> general
  rule -> practice checklist.
- Put the concrete example near the center. Make it the visual anchor.
- Leave enough air around annotations so it feels like live explanation, not a dashboard.
- Use asymmetry intentionally: a large example on one side and smaller notes around it can be better
  than three equal columns.
- Major gaps 32-56px. Align key baselines and example tokens, but allow annotation blocks to feel
  conversational.

## Connector Rules

- Use short chalk arrows and brackets. Do not build a heavy process flow unless the lesson is
  explicitly about flowchart logic.
- Connectors should point to terms, tokens, equations, or small example regions.
- Avoid long arrows across the whole board. If a connection is long, add a nearby label or break it
  into two short teaching moves.

## Avoid

- Three equal cards across the middle unless the user explicitly asks for a card comparison.
- Kanban boards, sticky-note walls, dashboards, or production architecture diagrams.
- Large rounded cards that make the lesson look like a generic whiteboard.
- Tiny text inside big boxes.
- Dense bullet lists.
- Emoji and pictogram decorations.
- Random red/green status colors.

## Example Layout

```text
Top-left: "Why does one tiny prompt change break cache reuse?"
Center: worked token example
  stable:  system | context | task
  changed: system | time id | context | task
                  ^ first mismatch
Right: small instructor notes explaining the mismatch cascade
Bottom-left: "Try it" mini checklist
Bottom-right: final rule of thumb
```

## Self-Check

- Does it look like a lesson, not a dashboard?
- Is there a concrete worked example, formula, token sequence, or mini problem?
- Is the surprising change highlighted exactly once?
- Are annotations near the thing they explain?
- Can a learner understand the concept by following the board in 30 seconds?
