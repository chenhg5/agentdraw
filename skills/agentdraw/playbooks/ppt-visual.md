# Playbook: PPT Visual

Use this for one-page presentation visuals, executive summaries, strategy one-pagers, board-update
pages, and slide-like sections. The output is usually restricted SVG.

This is not a full slide deck. It is one editable visual page that should be presentation-ready.

## Content Job

Make one point that can support spoken explanation.

Extract:

- assertion headline;
- audience and decision context;
- 2-4 supporting pillars, proof points, risks, or options;
- one implication, recommendation, or next move.

Omit:

- dense paragraphs;
- more than four peer pillars;
- decorative sections that do not support the headline;
- flowchart detail unless the slide is explicitly about process logic.

## Provider

Use SVG. Use Mermaid only if the slide is specifically a formal Mermaid-supported diagram.

## Layout

Default to `../method/editorial-layouts.md` for stronger presentation composition. Prefer:

- `E03 Swiss Statement Grid` for executive assertions;
- `E04 Editorial Sidebar` for one big message plus supporting notes;
- `E05 Poster Ledger` for keynote-like emphasis;
- `E07 Strategic Quadrant` for 2x2 strategy;
- `E09 Roadmap Terrace` for staged adoption or maturity;
- `E10 Decision Scoreboard` for option comparison.

Use plain pillar layouts only when the content truly has equal peer pillars.

## Style

Recommended styles: `boardroom`, `long-table`, `system-formal`, `soft-editorial`, `bold-poster`.

Theme does not replace layout. A `boardroom` slide should still have a strong focal point and a
clear visual hierarchy.

## Quality Checklist

- The headline is an assertion, not a topic label.
- The page reads in 10 seconds.
- One visual element dominates.
- Supporting modules are clearly subordinate.
- The recommendation or implication is visible.
- The board feels suitable for a presentation, not like raw notes.
