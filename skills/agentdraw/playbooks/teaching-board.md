# Playbook: Teaching Board

Use this for real-time explanation, tutoring, conceptual walkthroughs, classroom-like diagrams, and
step-by-step reasoning.

## Communication Job

Help the reader learn by following a staged explanation, not by seeing a finished dense system map.
Teaching boards should feel like a lesson being worked through on a board, not like another
structured product whiteboard. Prefer concrete examples, formulas, token sequences, annotated
mistakes, and short instructor notes over equal card grids.

## Information Model

Extract:

- The misconception or starting intuition.
- The concept being taught.
- 3-5 progressive steps.
- One worked example or analogy.
- A final rule of thumb.

## Layout Recipes

### Worked Example Board

```text
Top-left: learning question
Center: concrete worked example, formula, token sequence, or mini problem
Annotations: short notes close to the exact term they explain
Bottom-left: practice checklist or "try this"
Bottom-right: final rule of thumb
```

Use this as the default for "teach me", "explain why", tutorial, or concept-learning prompts.

### Progressive Board Writing

```text
Left/top: starting intuition or misconception
Middle: reveal the key change with an example
Right/bottom: corrected mental model
Footer: rule of thumb
```

### Chalkboard Blocks

```text
Top: question
Left column: simple example
Right column: generalized rule
Bottom: common mistake
```

### Annotated Mechanism

```text
Center: main mechanism drawing
Callouts: short explanations around it
Bottom: "remember this" strip
```

## Recommended Styles

- `chalk-lesson`: default for Khan-style tutoring, worked examples, formulas, debugging lessons,
  and conceptual walkthroughs.
- `crayon-stack`: playful teaching when the user wants colorful workshop energy.
- `manual-cream`: structured tutorial, runbook, or procedural lesson.
- `riso-brut`: energetic educational explainer for public articles.
- `soft-pop`: friendly non-technical education.

Avoid `pin-and-paper` for teaching unless the user asks for workshop notes. It tends to produce
card walls, which are weaker for lessons.

## Example Plan

```text
Scene: teaching-board
Audience: developers learning cache invalidation
Reader question: Why does prefix caching fail after a small change?
Main message: A tiny early-token change invalidates every downstream cached token.
Reading path: left-to-right staged example
Regions:
- Left: "what you expect" stable prefix
- Middle: one changed token highlighted
- Right: downstream cache miss cascade
- Bottom: rule of thumb
Connectors: simple arrows between stages, callout arrow to changed token
Style: crayon-stack because this is a teaching explainer
Risks: do not over-formalize into an architecture diagram
```

## Mini SVG Skeleton

```svg
<svg width="1200" height="760" viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="760" fill="#101820"/>
  <text x="72" y="86" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="42" font-weight="800" fill="#F7F3E8">Why does one tiny prompt change break cache reuse?</text>
  <line x1="72" y1="106" x2="620" y2="106" stroke="#F4D35E" stroke-width="4"/>

  <text x="96" y="178" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" font-weight="760" fill="#7FDBCA">Worked example</text>
  <text x="96" y="242" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" fill="#F7F3E8">stable:</text>
  <text x="210" y="242" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" fill="#F7F3E8">system  |  context  |  task</text>
  <text x="96" y="312" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" fill="#F7F3E8">changed:</text>
  <text x="230" y="312" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" fill="#F7F3E8">system  |</text>
  <rect x="350" y="280" width="96" height="48" rx="6" fill="transparent" stroke="#F4D35E" stroke-width="3"/>
  <text x="366" y="312" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" fill="#F4D35E">time id</text>
  <text x="466" y="312" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" fill="#F7F3E8">|  context  |  task</text>
  <polyline points="398,334 398,390 650,390" fill="none" stroke="#F4D35E" stroke-width="3"/>
  <text x="666" y="398" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="22" fill="#F4D35E">first mismatch</text>

  <text x="96" y="470" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="26" font-weight="760" fill="#F7F3E8">So what gets reused?</text>
  <text x="128" y="528" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="22" fill="#A8B3C1">1. Match from the first token</text>
  <text x="128" y="576" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="22" fill="#A8B3C1">2. Stop at the first difference</text>
  <text x="128" y="624" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="22" fill="#A8B3C1">3. Recompute everything after it</text>

  <rect x="760" y="176" width="330" height="250" rx="8" fill="#182631" stroke="#7FDBCA" stroke-width="2"/>
  <text x="792" y="230" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="24" font-weight="760" fill="#7FDBCA">Instructor note</text>
  <text x="792" y="286" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="20" fill="#F7F3E8">The human sees familiar words,</text>
  <text x="792" y="324" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="20" fill="#F7F3E8">but the cache sees a new prefix.</text>

  <rect x="720" y="560" width="410" height="88" rx="8" fill="transparent" stroke="#F4D35E" stroke-width="3"/>
  <text x="744" y="610" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="23" font-weight="760" fill="#F7F3E8">Rule: stable shared prompt first, variables last.</text>
</svg>
```

## Anti-Patterns

- Full production architecture when the user asked for an explanation.
- Too many steps on one board.
- Three equal cards or sticky notes when a worked example would teach better.
- Small technical labels that make the board feel like a spec.
- Polished executive style when the goal is live learning.
- Hiding the misconception; good teaching often starts with the wrong intuition.

## Quality Checklist

- The board has a clear learning question.
- Steps are numbered or staged.
- There is a concrete worked example, formula, token sequence, or mini problem.
- The most important change is visually highlighted.
- The final rule of thumb is obvious.
- The board feels teachable, not merely decorative.
