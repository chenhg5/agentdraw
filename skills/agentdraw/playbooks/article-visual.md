# Playbook: Article Visual

Use this for article, document, technical note, review brief, newsletter, blog post, concept, and
argument visuals. The output is usually restricted SVG.

## Content Job

Make one editable visual that helps a reader understand and remember the source's core idea.

Extract:

- one headline insight, phrased as a claim;
- the main tension, shift, mechanism, or tradeoff;
- 2-4 supporting ideas;
- one takeaway or implication;
- the minimum context needed to make the visual self-contained.

Omit:

- section-by-section summaries;
- every bullet from the source;
- decorative ideas that do not clarify the claim;
- generic "Step 1 / Step 2" labels when reader-facing labels are possible.

## Provider

Use SVG unless the user explicitly asks for a Mermaid-supported formal diagram. A conceptual article
with numbered sections is still an article visual, not automatically a flowchart.

## Layout

Default to `../method/editorial-layouts.md`. The board should be good-looking, magazine-like,
designed, focused, and clear even when the user does not request those qualities.

Good starting layouts:

- `E03 Swiss Statement Grid`: sharp claim plus proof grid.
- `E04 Editorial Sidebar`: one large claim with supporting notes.
- `E05 Poster Ledger`: punchy public/article visual.
- `E06 Reading Room Index`: long document with several memorable anchors.
- `E08 Editorial Timeline`: evolution, migration, or incident narrative.
- `E11 Ecosystem Orbit`: stakeholder or force-map article.

Use `../method/layout-styles.md` only when the article truly needs a formal mechanism map, matrix,
pipeline, or architecture-like structure.

## Style

Choose style after layout. Recommended styles include `soft-editorial`, `editorial-forest`,
`riso-brut`, `bold-poster`, `cut-bloom`, and `archive-shelf`. If the user names another style, keep
it, but still use a strong layout.

## Quality Checklist

- The headline says something, not just names the topic.
- The visual has one focal point before the reader reads details.
- Supporting ideas are selective and visibly subordinate.
- The takeaway is visible.
- The board would still make sense as an article image or review-room visual.
- It does not collapse into a palette-swapped card wall.
