# Editorial Layout Systems

Use these layouts when the user wants an article image, document visual, review visual, strategy
one-pager, or slide-like explanatory board and the result should feel more designed than a normal
diagram.

This is the default quality bar for explanatory whiteboards, even when the user does not ask for it
explicitly: make the board good-looking, magazine-like, designed, focused, and clear about the
important message. User phrases such as "good-looking", "designed", "magazine-like",
"presentation-ready", "重点突出", "有设计感", "像杂志", or "好看的配图" are stronger signals to use this
file, but the same standard still applies by default.

These layouts are still editable whiteboards. They use only `rect`, `circle`, `line`, `polyline`,
and `text`. The goal is controlled visual drama: memorable composition without losing alignment,
text containment, or editability.

These layouts are reference composition systems, not rigid templates. They define a visual idea,
reading path, and quality constraints. Adapt them to the source instead of copying dimensions
mechanically.

## When To Use

Prefer an editorial layout for most explanatory/document visuals, especially when the task contains
words like:

- 配图, article image, blog visual, newsletter image
- 观点, 思考, concept visual, argument map
- review visual, executive one-pager, presentation-ready visual
- make it less generic, more magazine-like, more memorable

Do not use these layouts for formal flowcharts, sequence diagrams, class diagrams, ER diagrams, or
branch-heavy processes. Those belong to Mermaid.

## Design Principle

Style and layout are separate. A style controls palette, type, stroke, and mood; a layout controls
reading path, focal point, proportion, and information priority. Never treat a named style as enough
design work. Even a `boardroom`, `system-formal`, or `raw-grid` visual should still have a clear
magazine-like composition when the task is explanatory or article-facing.

Do not make a wall of equal cards. Choose one memorable composition device:

- a giant number or statement that becomes the structure;
- an asymmetric hero region plus smaller evidence notes;
- a ruled ledger with one strong artifact;
- a field-guide index with varied but aligned modules;
- a calm framed poster with large type and strong whitespace.
- a four-quadrant analysis field with a highlighted strategic move;
- a timeline that uses scale, bands, or terraces instead of identical milestone cards.

The board must still pass mechanical quality:

- no text overlap or text overflow;
- no accidental shape overlap unless the project explicitly supports an intentional-overlap marker;
- repeated modules snap to a consistent grid;
- all text is real editable text;
- decorative elements must support hierarchy or reading path.

## How To Adapt A Layout

You may change:

- canvas size and aspect ratio;
- module count within the layout's intended range;
- region proportions, as long as the main visual anchor remains dominant;
- title/subtitle placement;
- density and copy length;
- recommended style, if the user named a different style or audience tone requires it.

Do not change:

- the layout's core composition device;
- the primary reading path;
- the reason the layout fits the source;
- alignment rhythm, shared gutters, and repeated module dimensions;
- text containment, connector discipline, and editability;
- provider routing. A formal flowchart is still Mermaid even if an editorial timeline looks nicer.

Examples:

- `E07 Strategic Quadrant` may become wider, taller, or use fewer notes per quadrant, but it still
  needs meaningful axes and four clear quadrants.
- `E08 Editorial Timeline` may use a diagonal, stepped, or horizontal rail, but it still needs a
  visible time progression and one emphasized inflection point.
- `E05 Poster Ledger` may change the artifact block position, but it still needs one dominant
  poster claim and ledger-like proof rows.

If a layout no longer preserves its defining device after adaptation, choose a different layout.

## Layout Catalogue

### E01 Monochrome Big Number

Use for: three-stage arguments, refined explainers, training/process summaries, serious editorial
boards.

Recommended styles: `monochrome`, `macchiato`, `manual-cream`.

Structure:

```text
Outer editorial frame
Headline + subtitle
Three columns
Each column: giant number + short heading + one compact proof
Bottom outcome strip
```

Rules:

- giant numbers are structural anchors, not decoration;
- keep body text to 1-2 short lines per column;
- use hairline dividers between columns;
- do not add icons or multiple accent colors.

### E02 Reading Room Overlap

Use for: argument spine, concept tension, strategy essays, calm review visuals.

Recommended styles: `reading-room`, `editorial-forest`, `soft-editorial`.

Structure:

```text
Outer frame
Title claim
Left context panel, larger center thesis panel, right implication panel
Thin rule + bottom takeaway
```

Rules:

- create a staggered rhythm with different y positions, but avoid actual geometry overlap unless the
  importer/validator supports an intentional marker;
- center thesis panel is the largest and visually strongest;
- pastel blocks carry hierarchy; body text stays dark.

### E03 Swiss Statement Grid

Use for: executive visual, product principle, crisp strategy claim.

Recommended styles: `boardroom`, `system-formal`, `blueprint-formal`, `neo-grid-bold`.

Structure:

```text
Small metadata line
Hairline rule
Huge left statement
Right evidence grid with 4 compact proof points
Bottom decision strip
```

Rules:

- left statement must dominate the page;
- right grid proves the claim, it does not compete with it;
- use one accent color only;
- avoid centered title blocks and decorative cards.

### E04 Editorial Sidebar

Use for: article visual, concept explainer, public-facing board, one claim with supporting notes.

Recommended styles: `soft-editorial`, `cut-bloom`, `coral`, `reading-room`.

Structure:

```text
Large left hero card
Right vertical note rail with 3 note cards
Small nodes or rules showing reading order
Bottom takeaway strip
```

Rules:

- hero card carries the sentence readers should remember;
- sidebar notes are shorter and subordinate;
- connector/note rail must not cross text;
- use asymmetry deliberately, not random placement.

### E05 Poster Ledger

Use for: punchy argument, launch message, migration narrative, social/article hero.

Recommended styles: `bold-poster`, `riso-brut`, `raw-grid`, `neo-grid-bold`.

Structure:

```text
Large poster headline
One high-emphasis artifact block
Ruled ledger rows explaining the claim
Bottom usage/recommendation strip
```

Rules:

- one strong accent block only;
- ledger rows align to one baseline rhythm;
- the headline should be assertive, not a topic label;
- do not fill the page with many small cards.

### E06 Reading Room Index

Use for: long documents, research synthesis, multi-part article maps, one board containing several
mini-boards.

Recommended styles: `reading-room`, `monochrome`, `long-table`, `raw-grid`.

Structure:

```text
Outer frame
Title + subtitle
Large top module + 2 supporting modules
Second row of 3 modules
Footer lesson
```

Rules:

- modules may vary width, but they must share row baselines and gutters;
- each module has a number, heading, and one compact note;
- useful for long-board density, but still selective: 5-6 anchors, not 12 bullets.

### E07 Strategic Quadrant

Use for: SWOT, 2x2 decisions, positioning maps, risk/opportunity analysis, capability tradeoffs.

Recommended styles: `boardroom`, `long-table`, `monochrome`, `raw-grid`.

Structure:

```text
Top: sharp analysis question
Main: four quadrants with large quadrant labels
Center: strategic move / recommendation marker
Side or bottom: decision rule
```

Rules:

- axes must be meaningful and visible; do not make four generic boxes without axes;
- each quadrant should contain 2-3 compact points, not paragraphs;
- highlight one strategic implication, not every quadrant equally;
- use consistent quadrant sizes and strong dividers.

### E08 Editorial Timeline

Use for: product evolution, incident narrative, migration phases, historical argument, strategy over
time.

Recommended styles: `reading-room`, `macchiato`, `blueprint-formal`, `boardroom`.

Structure:

```text
Title claim
Large time rail, stepped band, or diagonal progression
4-6 milestones with varied emphasis
One inflection point / lesson callout
```

Rules:

- avoid identical milestone cards on a plain horizontal line;
- make one turning point visually larger or higher contrast;
- dates sit on the rail, explanations sit in aligned callouts;
- if the user asks for a formal Mermaid timeline, use Mermaid instead.

### E09 Roadmap Terrace

Use for: phased plans, maturity ladders, rollout strategy, "from now to target" narratives.

Recommended styles: `soft-editorial`, `boardroom`, `bold-poster`, `neo-grid-bold`.

Structure:

```text
Left: current constraint or starting point
Main: 3-5 ascending terraces / steps
Right/top: target state
Bottom: risks, gates, or investment rule
```

Rules:

- steps should visibly ascend or grow; otherwise use a normal timeline;
- each step label describes a state change, not a vague phase number;
- keep connectors minimal; the staircase shape carries the reading path;
- use one highlighted final step or target.

### E10 Decision Scoreboard

Use for: buy/build/partner, option comparison, prioritization, evaluation summaries.

Recommended styles: `long-table`, `boardroom`, `inkline`, `system-formal`.

Structure:

```text
Top: decision question
Left: options as strong rows or columns
Main: 4-5 criteria shown as scored cells, bars, or dots
Right/bottom: recommendation strip
```

Rules:

- useful when exact numeric precision is not the point; use a real table if exact data dominates;
- choose one winner or recommendation clearly;
- repeated score cells must align perfectly;
- do not overload with more than 4 options or 5 criteria.

### E11 Ecosystem Orbit

Use for: stakeholder maps, product ecosystems, platform relationships, forces around one concept.

Recommended styles: `editorial-forest`, `soft-editorial`, `reading-room`, `blueprint-formal`.

Structure:

```text
Center: core product / idea / system
Orbit: 5-7 actors, forces, or dependencies
Outer frame: boundary and non-goals
Side: key tension or leverage point
```

Rules:

- orbit spacing must be intentional; avoid random mind-map placement;
- use short labels on orbit nodes and one compact side explanation;
- connectors should not cross through the center label;
- do not use for sequential processes.

### E12 Pyramid Stack

Use for: hierarchy of needs, maturity model, capability stack, priority pyramid, dependency levels.

Recommended styles: `monochrome`, `macchiato`, `system-formal`, `manual-cream`.

Structure:

```text
Top: aspirational outcome
Middle: 2-3 capability bands
Base: foundation / constraints / data / operating rhythm
Side rail: what unlocks each level
```

Rules:

- bottom level should be visually widest or strongest;
- each band should have one responsibility, not a paragraph;
- side rail explains progression or unlocks;
- use `Layered Stack` instead if the content is technical architecture rather than hierarchy.

## Selection Rules

If the source is an article or thinking note:

- old-vs-new argument -> `E03 Swiss Statement Grid` or `E05 Poster Ledger`;
- calm conceptual explanation -> `E02 Reading Room Overlap`;
- 3-stage explanation -> `E01 Monochrome Big Number`;
- long document with several anchors -> `E06 Reading Room Index`;
- public-facing article image -> `E04 Editorial Sidebar` or `E05 Poster Ledger`.
- SWOT / 2x2 / positioning analysis -> `E07 Strategic Quadrant`;
- time development / incident narrative / migration phases -> `E08 Editorial Timeline`;
- phased roadmap / maturity ladder -> `E09 Roadmap Terrace`;
- option evaluation / prioritization -> `E10 Decision Scoreboard`;
- stakeholder / ecosystem / forces map -> `E11 Ecosystem Orbit`;
- hierarchy / dependency / capability maturity -> `E12 Pyramid Stack`.

If the user asks for "more creative" or "magazine-like", do not switch to freeform drawing. Choose
one of these editorial layouts and state why.

## Layout And Style Bindings

Use these pairings as defaults. They are designed to reduce random style selection while still
leaving room for user preference.

| Layout | Default style | Alternate styles | Best tone |
| --- | --- | --- | --- |
| `E01 Monochrome Big Number` | `monochrome` | `macchiato`, `manual-cream` | serious, refined, instructional |
| `E02 Reading Room Overlap` | `reading-room` | `editorial-forest`, `soft-editorial` | calm, reflective, essay-like |
| `E03 Swiss Statement Grid` | `boardroom` | `system-formal`, `blueprint-formal`, `neo-grid-bold` | executive, precise, decisive |
| `E04 Editorial Sidebar` | `soft-editorial` | `cut-bloom`, `coral`, `reading-room` | public article, friendly explainer |
| `E05 Poster Ledger` | `bold-poster` | `riso-brut`, `raw-grid`, `neo-grid-bold` | punchy, launch, contrast |
| `E06 Reading Room Index` | `reading-room` | `monochrome`, `long-table`, `raw-grid` | long-form synthesis, field guide |
| `E07 Strategic Quadrant` | `boardroom` | `long-table`, `monochrome`, `raw-grid` | SWOT, tradeoff, positioning |
| `E08 Editorial Timeline` | `reading-room` | `macchiato`, `blueprint-formal`, `boardroom` | evolution, incident, migration |
| `E09 Roadmap Terrace` | `soft-editorial` | `boardroom`, `bold-poster`, `neo-grid-bold` | rollout, maturity, phased plan |
| `E10 Decision Scoreboard` | `long-table` | `boardroom`, `inkline`, `system-formal` | option scoring, prioritization |
| `E11 Ecosystem Orbit` | `editorial-forest` | `soft-editorial`, `reading-room`, `blueprint-formal` | platform, stakeholder, forces |
| `E12 Pyramid Stack` | `monochrome` | `macchiato`, `system-formal`, `manual-cream` | hierarchy, foundation, maturity |

If the user names a style, keep the user's style unless it conflicts with the layout's tone. If no
style is named, choose the default style for the layout and state that choice.

When using `boardroom`, include one dark ink-filled command panel, dominant statement block, target
state, or decision strip. Do not make a boardroom visual as only light cards with blue borders.

## Required Layout Plan Line

Before writing SVG, include:

```text
Editorial layout: <E01-E12 name> because <reason tied to the source>.
Design style: <style-id> because <tone/audience>.
Composition device: <giant number / asymmetric sidebar / poster ledger / field-guide index / statement grid / quadrant / timeline rail / terrace / scoreboard / orbit / pyramid>.
```

## Anti-Patterns

- equal 3-card rows for every article;
- tiny centered cards inside a wide lane;
- using a style as only a palette swap;
- adding icons or emoji to make the page feel lively;
- actual shape overlap that triggers validation errors;
- decorative dots, labels, or lines that do not clarify reading order.
