import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(".agentdraw/layout-candidates-v2");
fs.mkdirSync(outDir, { recursive: true });

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const text = (x, y, value, size = 22, fill = "#172033", weight = 500, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(value)}</text>`;

const center = (x, y, value, size = 22, fill = "#172033", weight = 650) =>
  text(x, y, value, size, fill, weight, `text-anchor="middle" dominant-baseline="middle"`);

const rect = (x, y, width, height, fill, stroke = "none", sw = 0, rx = 0, extra = "") =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

const circle = (cx, cy, r, fill, stroke = "none", sw = 0) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const line = (x1, y1, x2, y2, stroke, sw = 2, arrow = false) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" ${arrow ? `marker-end="url(#arrow)"` : ""}/>`;

const svg = (width, height, bg, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0 0 L10 4 L0 8 z" fill="#111"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="${bg}"/>
${body}
</svg>
`;

const boards = [
  {
    id: "01-monochrome-big-number",
    title: "Monochrome Big Number",
    style: "monochrome",
    note: "Magazine feature page: giant numbers become the layout, not decoration.",
    svg: svg(
      1320,
      860,
      "#FAFADF",
      [
        rect(56, 56, 1208, 748, "none", "#1A1A16", 2),
        text(92, 126, "HOW AN IDEA BECOMES A BOARD", 34, "#1A1A16", 820),
        text(94, 166, "Three editorial beats, each with one proof and one decision.", 18, "#5E5E54", 560),
        line(92, 210, 1228, 210, "#1A1A16", 2),
        ...[
          [92, "01", "Frame", ["Name the reader question", "before choosing a style."]],
          [454, "02", "Compose", ["Let one layout pattern", "carry the information."]],
          [816, "03", "Inspect", ["Fix rhythm, text, and", "connectors before sharing."]],
        ].flatMap(([x, n, h, body], i) => [
          text(x, 338, n, 118, "#1A1A16", 820),
          text(x + 174, 292, h, 28, "#1A1A16", 760),
          line(x, 382, x + 326, 382, "#1A1A16", 1.6),
          text(x + 4, 442, body[0], 20, "#5E5E54", 520),
          text(x + 4, 480, body[1], 20, "#5E5E54", 520),
          i < 2 ? line(x + 350, 250, x + 350, 650, "#8A8A80", 1.2) : "",
        ]),
        rect(92, 682, 1136, 72, "#1A1A16", "#1A1A16", 0),
        text(124, 728, "Strong when the content has 3 stages and needs a refined, text-first tone.", 24, "#FAFADF", 760),
      ].join("\n"),
    ),
  },
  {
    id: "02-reading-room-overlap",
    title: "Reading Room Overlap",
    style: "reading-room",
    note: "Poster-like overlap: stacked panels create depth without blur or freeform shapes.",
    svg: svg(
      1320,
      860,
      "#F6EBD8",
      [
        rect(60, 60, 1200, 740, "none", "#0B0A09", 2.5),
        text(96, 132, "THE ARGUMENT HAS A SPINE", 40, "#0B0A09", 850),
        text(98, 172, "Use overlapping editorial blocks when hierarchy matters more than sequence.", 18, "#0B0A09", 560),
        rect(110, 292, 330, 272, "#D6C7CC", "#0B0A09", 2.5),
        rect(472, 238, 386, 356, "#F1DAB1", "#0B0A09", 2.5),
        rect(890, 330, 330, 234, "#DE916A", "#0B0A09", 2.5),
        text(150, 332, "Context", 32, "#0B0A09", 780),
        text(150, 392, "What is changing?", 21, "#0B0A09", 560),
        text(150, 430, "What pressure is visible?", 21, "#0B0A09", 560),
        text(514, 324, "Central thesis", 36, "#0B0A09", 820),
        text(514, 386, "The board should reveal", 23, "#0B0A09", 600),
        text(514, 426, "one memorable structure,", 23, "#0B0A09", 600),
        text(514, 466, "not summarize everything.", 23, "#0B0A09", 600),
        text(930, 404, "Implication", 32, "#0B0A09", 780),
        text(930, 464, "What should change next?", 21, "#0B0A09", 560),
        line(236, 624, 1084, 624, "#0B0A09", 2),
        text(244, 684, "Best for: strategy essays, review notes, and calm concept explainers.", 24, "#0B0A09", 760),
      ].join("\n"),
    ),
  },
  {
    id: "03-swiss-statement-grid",
    title: "Swiss Statement Grid",
    style: "boardroom",
    note: "Swiss-like split statement: one huge claim, one disciplined evidence grid.",
    svg: svg(
      1440,
      810,
      "#FFFFFF",
      [
        text(72, 88, "BOARD SYSTEM · 03", 15, "#667085", 760),
        line(72, 118, 1368, 118, "#182230", 1.5),
        text(72, 218, "Less freedom.", 56, "#182230", 760),
        text(72, 304, "Better boards.", 56, "#4053D6", 760),
        text(76, 370, "A strong layout limits where the model can drift.", 22, "#667085", 500),
        rect(746, 178, 560, 370, "#F8FAFC", "#182230", 2),
        ...[
          [786, 236, "01", "Bounded canvas"],
          [1050, 236, "02", "Locked rhythm"],
          [786, 382, "03", "Visible hierarchy"],
          [1050, 382, "04", "Quality gate"],
        ].flatMap(([x, y, n, label]) => [
          text(x, y, n, 34, "#4053D6", 780),
          text(x, y + 52, label, 24, "#182230", 720),
          line(x, y + 78, x + 190, y + 78, "#BEC1C5", 1.2),
        ]),
        rect(72, 610, 1234, 82, "#182230", "#182230", 0),
        center(689, 651, "Use when you need a memorable executive visual, not a dense diagram.", 25, "#FFFFFF", 720),
      ].join("\n"),
    ),
  },
  {
    id: "04-editorial-sidebar",
    title: "Editorial Sidebar",
    style: "soft-editorial",
    note: "Asymmetric magazine page: big story block plus narrow annotation rail.",
    svg: svg(
      1280,
      860,
      "#ECE9DC",
      [
        rect(72, 72, 660, 560, "#C9DA4F", "none", 0, 28),
        text(112, 158, "Make the", 48, "#1C1A17", 800),
        text(112, 222, "reading path", 48, "#1C1A17", 800),
        text(112, 286, "visible.", 48, "#1C1A17", 800),
        text(116, 372, "A magazine-style board can be expressive", 24, "#1C1A17", 560),
        text(116, 418, "without losing structure.", 24, "#1C1A17", 560),
        text(116, 476, "Every decorative move should carry hierarchy.", 24, "#1C1A17", 760),
        rect(788, 102, 380, 150, "#E2A8CE", "none", 0, 24),
        rect(830, 304, 338, 150, "#E7C6AD", "none", 0, 24),
        rect(788, 506, 380, 150, "#E2A8CE", "none", 0, 24),
        text(828, 164, "Anchor", 30, "#1C1A17", 780),
        text(870, 366, "Contrast", 30, "#1C1A17", 780),
        text(828, 568, "Takeaway", 30, "#1C1A17", 780),
        circle(764, 176, 12, "#1C1A17"),
        circle(806, 378, 12, "#1C1A17"),
        circle(764, 580, 12, "#1C1A17"),
        line(767, 188, 803, 366, "#1C1A17", 2),
        line(803, 390, 767, 568, "#1C1A17", 2),
        rect(72, 704, 1096, 66, "#1C1A17", "#1C1A17", 0, 18),
        center(620, 737, "Best for article graphics where one claim needs supporting notes.", 23, "#ECE9DC", 720),
      ].join("\n"),
    ),
  },
  {
    id: "05-poster-ledger",
    title: "Poster Ledger",
    style: "bold-poster",
    note: "High-impact poster: one red artifact, ruled ledger below.",
    svg: svg(
      1320,
      860,
      "#FFFFFF",
      [
        text(86, 120, "THE QUALITY GAP IS", 38, "#1C1410", 850),
        text(86, 204, "NOT A COLOR PROBLEM", 58, "#D8000F", 900),
        line(86, 254, 1234, 254, "#1C1410", 3),
        rect(86, 320, 300, 270, "#D8000F", "#1C1410", 3),
        text(120, 400, "01", 60, "#FFFFFF", 900),
        text(120, 470, "Layout", 36, "#FFFFFF", 850),
        text(120, 520, "comes first", 28, "#FFFFFF", 760),
        ...[
          [444, 320, "Style", "supports the scene"],
          [444, 410, "Spacing", "creates trust"],
          [444, 500, "Validation", "closes the loop"],
          [444, 590, "Preview", "catches the weak spots"],
        ].flatMap(([x, y, h, b]) => [
          line(x, y, 1200, y, "#1C1410", 2),
          text(x, y + 46, h, 28, "#1C1410", 820),
          text(x + 260, y + 46, b, 24, "#1C1410", 520),
        ]),
        line(444, 680, 1200, 680, "#1C1410", 2),
        rect(86, 722, 1114, 56, "#F5F2EF", "#1C1410", 2),
        center(643, 750, "Use for punchy arguments, launch visuals, and migration narratives.", 22, "#1C1410", 760),
      ].join("\n"),
    ),
  },
  {
    id: "06-reading-room-index",
    title: "Reading Room Index",
    style: "reading-room",
    note: "Table-of-contents composition: useful for dense docs without looking like a table.",
    svg: svg(
      1320,
      980,
      "#F6EBD8",
      [
        rect(58, 58, 1204, 864, "none", "#0B0A09", 2.5),
        text(96, 136, "FIELD GUIDE TO AGENT DRAWINGS", 42, "#0B0A09", 850),
        text(98, 178, "A long-board composition for multiple small boards inside one frame.", 18, "#0B0A09", 560),
        line(96, 220, 1224, 220, "#0B0A09", 2),
        rect(96, 276, 448, 210, "#D6C7CC", "#0B0A09", 2.5),
        rect(584, 276, 286, 210, "#F1DAB1", "#0B0A09", 2.5),
        rect(910, 276, 314, 210, "#DE916A", "#0B0A09", 2.5),
        rect(96, 538, 330, 236, "#F1DAB1", "#0B0A09", 2.5),
        rect(468, 538, 330, 236, "#DE916A", "#0B0A09", 2.5),
        rect(840, 538, 384, 236, "#D6C7CC", "#0B0A09", 2.5),
        ...[
          [128, 344, "01", "Core idea"],
          [616, 344, "02", "Forces"],
          [942, 344, "03", "Evidence"],
          [128, 610, "04", "Risks"],
          [500, 610, "05", "Pattern"],
          [872, 610, "06", "Decision"],
        ].flatMap(([x, y, n, label]) => [
          text(x, y, n, 48, "#0B0A09", 850),
          text(x, y + 64, label, 28, "#0B0A09", 760),
          text(x, y + 112, "One compact note.", 18, "#0B0A09", 560),
        ]),
        text(96, 850, "Best for: long documents that need six memorable anchors, not a wall of bullets.", 23, "#0B0A09", 760),
      ].join("\n"),
    ),
  },
  {
    id: "07-strategic-quadrant",
    title: "Strategic Quadrant",
    style: "boardroom",
    note: "SWOT/2x2 analysis field with a centered strategic move.",
    svg: svg(
      1320,
      900,
      "#FFFFFF",
      [
        text(72, 92, "WHAT SHOULD WE DO NEXT?", 38, "#182230", 820),
        text(74, 132, "A quadrant board for SWOT, positioning, and tradeoff analysis.", 19, "#667085", 520),
        line(72, 176, 1248, 176, "#182230", 1.5),
        text(116, 224, "Internal", 18, "#667085", 700),
        text(1090, 224, "External", 18, "#667085", 700),
        rect(132, 244, 520, 236, "#F8FAFC", "#182230", 2, 0),
        rect(652, 244, 520, 236, "#E7EEF8", "#182230", 2, 0),
        rect(132, 480, 520, 236, "#FFFFFF", "#182230", 2, 0),
        rect(652, 480, 520, 236, "#F8FAFC", "#182230", 2, 0),
        text(168, 306, "Strengths", 31, "#182230", 780),
        text(688, 306, "Opportunities", 31, "#182230", 780),
        text(168, 542, "Weaknesses", 31, "#182230", 780),
        text(688, 542, "Threats", 31, "#182230", 780),
        ...[
          [168, 360, "What is already working"],
          [168, 398, "Assets we can compound"],
          [688, 360, "Signals worth exploiting"],
          [688, 398, "Windows before competitors"],
          [168, 596, "Friction we must remove"],
          [168, 634, "Capabilities still missing"],
          [688, 596, "External pressure"],
          [688, 634, "Risks that change timing"],
        ].map(([x, y, value]) => text(x, y, value, 20, "#667085", 520)),
        rect(132, 758, 1040, 82, "#182230", "#182230", 0, 6),
        text(172, 806, "Strategic move:", 24, "#FFFFFF", 780),
        text(398, 806, "Focus the launch story where strengths meet external demand.", 23, "#FFFFFF", 620),
      ].join("\n"),
    ),
  },
  {
    id: "08-editorial-timeline",
    title: "Editorial Timeline",
    style: "reading-room",
    note: "Timeline with one emphasized inflection point instead of identical milestone cards.",
    svg: svg(
      1400,
      820,
      "#F6EBD8",
      [
        rect(60, 60, 1280, 700, "none", "#0B0A09", 2.5),
        text(96, 130, "THE STORY CHANGES AT THE INFLECTION", 38, "#0B0A09", 850),
        text(98, 170, "Use scale and callouts to avoid a plain row of milestones.", 18, "#0B0A09", 560),
        line(128, 432, 1268, 432, "#0B0A09", 3),
        ...[
          [168, "T0", "Trigger", "Problem visible"],
          [392, "T1", "Pressure", "Pressure rises"],
          [616, "T2", "Inflection", "Choice shifts"],
          [888, "T3", "Adoption", "Behavior repeats"],
          [1112, "T4", "Standard", "Pattern default"],
        ].flatMap(([x, t, h, b], i) => [
          circle(x, 432, i === 2 ? 20 : 12, i === 2 ? "#DE916A" : "#0B0A09", "#0B0A09", i === 2 ? 2 : 0),
          text(x - 24, 382, t, 22, "#0B0A09", 850),
          rect(x - 104, i % 2 === 0 ? 246 : 500, i === 2 ? 236 : 208, 116, i === 2 ? "#DE916A" : "#F1DAB1", "#0B0A09", 2.5),
          text(x - 72, i % 2 === 0 ? 296 : 550, h, 24, "#0B0A09", 780),
          text(x - 72, i % 2 === 0 ? 334 : 588, b, 16, "#0B0A09", 560),
        ]),
        rect(96, 668, 1208, 48, "#0B0A09", "#0B0A09", 0),
        center(700, 692, "Best for product evolution, migration, incident narrative, and historical argument.", 21, "#F6EBD8", 720),
      ].join("\n"),
    ),
  },
  {
    id: "09-roadmap-terrace",
    title: "Roadmap Terrace",
    style: "soft-editorial",
    note: "Ascending terraces for phased plans and maturity stories.",
    svg: svg(
      1320,
      860,
      "#ECE9DC",
      [
        text(76, 104, "FROM LOCAL DRAFT TO TEAM SYSTEM", 38, "#1C1A17", 820),
        text(78, 144, "A roadmap should show rising capability, not just dates.", 20, "#1C1A17", 540),
        rect(84, 610, 240, 116, "#E7C6AD", "#1C1A17", 0, 18),
        rect(340, 540, 240, 186, "#E2A8CE", "#1C1A17", 0, 18),
        rect(596, 430, 240, 296, "#C9DA4F", "#1C1A17", 0, 18),
        rect(852, 300, 300, 426, "#1C1A17", "#1C1A17", 0, 18),
        text(124, 654, "01 Draft", 28, "#1C1A17", 780),
        text(380, 596, "02 Review", 28, "#1C1A17", 780),
        text(636, 496, "03 Validate", 28, "#1C1A17", 780),
        text(900, 374, "04 Standardize", 32, "#ECE9DC", 820),
        text(124, 704, "One-off output", 18, "#1C1A17", 520),
        text(380, 636, "Preview and fix", 18, "#1C1A17", 520),
        text(636, 536, "Quality gates", 18, "#1C1A17", 520),
        text(900, 426, "Reusable pattern", 22, "#ECE9DC", 560),
        line(196, 614, 196, 250, "#1C1A17", 1.6),
        line(452, 524, 452, 250, "#1C1A17", 1.6),
        line(708, 414, 708, 250, "#1C1A17", 1.6),
        line(1002, 284, 1002, 250, "#1C1A17", 1.6),
        line(196, 250, 1002, 250, "#1C1A17", 2),
        text(78, 796, "Best for phased strategy, maturity ladders, rollout plans, and target-state narratives.", 23, "#1C1A17", 720),
      ].join("\n"),
    ),
  },
  {
    id: "10-decision-scoreboard",
    title: "Decision Scoreboard",
    style: "long-table",
    note: "Boardroom comparison that feels more editorial than a spreadsheet.",
    svg: svg(
      1440,
      860,
      "#F8F5EE",
      [
        text(72, 92, "BUILD, BUY, OR PARTNER?", 38, "#24211C", 820),
        text(74, 132, "Score only enough to make the decision legible.", 19, "#6C6258", 540),
        line(72, 176, 1368, 176, "#24211C", 2),
        ...["Option", "Impact", "Speed", "Risk", "Fit", "Signal"].map((h, i) =>
          text([92, 470, 650, 830, 1010, 1190][i], 226, h, 20, "#6C6258", 720),
        ),
        ...[
          ["Build", 300, 4, 2, 3, 5, "best for core"],
          ["Buy", 410, 3, 5, 4, 2, "fastest path"],
          ["Partner", 520, 4, 4, 3, 4, "balanced bet"],
        ].flatMap(([label, y, impact, speed, risk, fit, signal]) => [
          line(72, y - 46, 1368, y - 46, "#D0C7BC", 1.5),
          text(92, y, label, 31, "#24211C", 780),
          ...[impact, speed, risk, fit].flatMap((score, index) => {
            const x = [480, 660, 840, 1020][index];
            return [
              rect(x, y - 26, 112, 20, "#E5DED2", "none", 0, 10),
              rect(x, y - 26, score * 22, 20, "#24211C", "none", 0, 10),
            ];
          }),
          text(1190, y, signal, 22, "#24211C", 620),
        ]),
        line(72, 586, 1368, 586, "#D0C7BC", 1.5),
        rect(72, 666, 1296, 78, "#24211C", "#24211C", 0, 8),
        center(720, 705, "Recommendation: choose the balanced bet when speed matters but ownership still matters.", 24, "#F8F5EE", 720),
      ].join("\n"),
    ),
  },
  {
    id: "11-ecosystem-orbit",
    title: "Ecosystem Orbit",
    style: "editorial-forest",
    note: "Orbit map for stakeholders, forces, and platform relationships.",
    svg: svg(
      1320,
      900,
      "#EEF3E8",
      [
        text(82, 108, "THE PRODUCT SITS INSIDE A SYSTEM", 38, "#183027", 820),
        text(84, 148, "Use orbit spacing for actors and forces around one center.", 20, "#496157", 520),
        rect(78, 190, 760, 590, "none", "#183027", 2, 28),
        circle(458, 485, 104, "#183027"),
        center(458, 470, "Core", 31, "#EEF3E8", 820),
        center(458, 510, "system", 22, "#EEF3E8", 620),
        ...[
          [458, 282, "Users", 458, 340, 458, 381],
          [650, 370, "Data", 600, 400, 565, 420],
          [650, 600, "Policy", 600, 570, 565, 550],
          [458, 690, "Ops", 458, 632, 458, 589],
          [266, 600, "Tools", 316, 570, 351, 550],
          [266, 370, "Teams", 316, 400, 351, 420],
        ].flatMap(([cx, cy, label, x1, y1, x2, y2]) => [
          circle(cx, cy, 58, "#CFE0C5", "#183027", 2),
          center(cx, cy, label, 19, "#183027", 720),
          line(x1, y1, x2, y2, "#8AA08F", 1.5),
        ]),
        rect(904, 244, 300, 360, "#DCE8D5", "#183027", 2, 18),
        text(944, 316, "Key tension", 30, "#183027", 780),
        text(944, 380, "Every actor wants", 21, "#496157", 520),
        text(944, 418, "a different tradeoff.", 21, "#496157", 520),
        line(944, 470, 1164, 470, "#183027", 1.5),
        text(944, 530, "Design for the", 21, "#496157", 520),
        text(944, 568, "highest-friction edge.", 21, "#496157", 520),
        rect(904, 684, 300, 66, "#183027", "#183027", 0, 14),
        center(1054, 717, "Best for ecosystem maps.", 21, "#EEF3E8", 720),
      ].join("\n"),
    ),
  },
  {
    id: "12-pyramid-stack",
    title: "Pyramid Stack",
    style: "monochrome",
    note: "Hierarchy and maturity model without pretending to be architecture.",
    svg: svg(
      1320,
      900,
      "#FAFADF",
      [
        rect(60, 60, 1200, 780, "none", "#1A1A16", 2),
        text(96, 132, "WHAT MUST BE TRUE FIRST?", 40, "#1A1A16", 850),
        text(98, 172, "Use a pyramid when the argument depends on foundation and maturity.", 19, "#5E5E54", 560),
        rect(410, 262, 500, 86, "#1A1A16", "#1A1A16", 0),
        rect(328, 374, 664, 98, "#E4E3C5", "#1A1A16", 2),
        rect(244, 498, 832, 110, "#EFEED2", "#1A1A16", 2),
        rect(160, 636, 1000, 122, "#FAFADF", "#1A1A16", 2),
        center(660, 305, "Trusted outcome", 27, "#FAFADF", 760),
        center(660, 423, "Repeatable quality loop", 26, "#1A1A16", 760),
        center(660, 553, "Provider + layout + style discipline", 25, "#1A1A16", 760),
        center(660, 697, "Clear source intent and editable primitives", 25, "#1A1A16", 760),
        line(1188, 262, 1188, 758, "#1A1A16", 2),
        text(1210, 314, "Goal", 18, "#1A1A16", 760),
        text(1210, 424, "Loop", 18, "#1A1A16", 760),
        text(1210, 556, "Method", 18, "#1A1A16", 760),
        text(1210, 700, "Base", 18, "#1A1A16", 760),
      ].join("\n"),
    ),
  },
];

for (const board of boards) {
  fs.writeFileSync(path.join(outDir, `${board.id}.svg`), board.svg);
}

fs.writeFileSync(
  path.join(outDir, "index.json"),
  `${JSON.stringify(boards.map(({ id, title, style, note }) => ({ id, title, style, note })), null, 2)}\n`,
);

console.log(JSON.stringify({ outDir, count: boards.length }, null, 2));
