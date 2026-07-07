# Review Asset Flow Volume

Goal: explain where review-article visuals spend time and where quality leaks happen.

Sources:

- 100 source paragraphs enter the pipeline.
- 60 paragraphs are useful evidence.
- 25 paragraphs become candidate visual claims.
- 8 claims are strong enough for a board.
- 3 boards are exported for review.

Stages:

1. Source scanning: removes duplicated background and unrelated context.
2. Claim compression: turns long prose into visual assertions.
3. Layout selection: picks a board layout and style.
4. Render and inspect: converts SVG to editable board and exports PNG for visual inspection.
5. Revision: fixes alignment, text overflow, connector issues, and weak hierarchy.

Leakage:

- biggest loss: vague paragraphs that cannot support a visual claim;
- second loss: claims that are true but not visually distinct;
- quality risk: layouts become equal-card walls when the main message is weak.

Leverage point:

- improving the claim compression stage saves more time than adding more themes.
- a short review checklist catches most mechanical issues before the user sees the board.

Desired visual:

- show relative flow volume from left to right;
- highlight the leakage around claim compression;
- show final 3 reviewed boards as the outcome.
