# AgentDraw Quality Rubric

Score each dimension from 1 to 4.

| Score | Meaning |
| --- | --- |
| 4 | Strong. Ready to show with only minor optional polish. |
| 3 | Acceptable. Usable, but one visible weakness remains. |
| 2 | Weak. Needs meaningful repair before delivery. |
| 1 | Failed. Does not satisfy the dimension. |

## 1. Task Fit

- 4: The board clearly answers the requested diagram type and includes the important domain details.
- 3: The requested structure is recognizable, with minor omissions.
- 2: The board is generic or misses several important concepts.
- 1: The output does not match the user request.

## 2. Structure

- 4: Title, regions, groups, hierarchy, and reading path are clear.
- 3: Mostly clear, but one section or path needs interpretation.
- 2: Some grouping exists, but the viewer must work to understand it.
- 1: Layout is scattered or lacks meaningful organization.

## 3. Visual Design

- 4: The selected style is visible through layout, typography, spacing, geometry, and components.
- 3: Style is visible but relies too much on color.
- 2: Mostly a palette swap.
- 1: No intentional design system is visible.

## 4. Readability

- 4: Text is legible, editable, centered when intended, and contained.
- 3: One or two labels are cramped but readable.
- 2: Multiple labels overflow, overlap, or feel too small.
- 1: Text problems block understanding.

## 5. Connector Quality

- 4: Connectors clarify relationships and avoid labels, headers, and tangles.
- 3: Minor routing issues, but relationships are understandable.
- 2: Connectors are confusing or cross important text.
- 1: Connectors are missing, misleading, or visually chaotic.

## 6. Validation And Editability

- 4: `agentdraw validate` has zero errors, and the board is fully editable.
- 3: Only warnings remain, and they are intentional or low risk.
- 2: Validation errors remain, but the board is still mostly editable.
- 1: Output is not editable or has serious validation failures.
