import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(".agentdraw/data-whiteboard-layout-candidates");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const fontStack = "Virgil, Comic Sans MS, Bradley Hand, Noto Sans SC, sans-serif";
const ink = "#111111";
const muted = "#5A5A5A";

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const text = (x, y, value, size = 18, fill = ink, weight = 600, extra = "") =>
  `<text x="${x}" y="${y}" font-family="${fontStack}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(value)}</text>`;

const center = (x, y, value, size = 20, fill = ink, weight = 700) =>
  text(x, y, value, size, fill, weight, `text-anchor="middle" dominant-baseline="middle"`);

const rect = (x, y, width, height, fill = "#FFFFFF", stroke = ink, sw = 2, rx = 4, extra = "") =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

const ellipse = (cx, cy, rx, ry, fill = "#FFFFFF", stroke = ink, sw = 2) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const poly = (points, stroke = ink, sw = 2, arrow = true, extra = "") =>
  `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${arrow ? `marker-end="url(#arrow)"` : ""} ${extra}/>`;

const boundary = (x, y, w, h, label, labelX = x + w / 2, labelY = y + h + 42) =>
  [
    poly(`${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h} ${x},${y}`, ink, 2, false, `stroke-dasharray="12,10"`),
    center(labelX, labelY, label, 32, ink, 780),
  ].join("\n");

const card = ({ x, y, w = 150, h = 64, fill = "#F2F2F2", label, size = 23 }) =>
  [rect(x, y, w, h, fill, ink, 2, 3), center(x + w / 2, y + h / 2, label, size, ink, 760)].join("\n");

const record = ({ x, y, w = 144, h, fill = "#E8F7FA", lines }) => {
  const height = h ?? (lines.length >= 4 ? 170 : 118);
  return [
    rect(x, y, w, height, fill, ink, 2, 3),
    ...lines.map((line, index) => text(x + 28, y + 32 + index * 30, line, 18, ink, 650)),
  ].join("\n");
};

const svg = (width, height, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0,12 6,0 12" fill="${ink}"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="#FFFFFF"/>
${body}
</svg>
`;

const boards = [
  {
    id: "01-transform-lanes",
    title: "D01 Transform Lanes",
    svg: svg(
      1680,
      940,
      [
        text(52, 90, "D01 Transform Lanes", 42, ink, 850),
        text(54, 146, "MapReduce-like stages: split records, map, group, reduce, output", 20, muted, 560),
        `<g transform="translate(0 80)">`,
        boundary(52, 150, 190, 520, "Input"),
        boundary(322, 150, 190, 520, "Split"),
        boundary(590, 150, 190, 520, "Map"),
        boundary(872, 150, 250, 520, "Shuffle & Sort"),
        boundary(1220, 150, 210, 520, "Reduce"),
        boundary(1510, 150, 140, 520, "Output"),
        record({ x: 82, y: 250, fill: "#E8F7FA", lines: ["B = 3", "A = 5", "C = 2"] }),
        record({ x: 82, y: 428, fill: "#E8F7FA", lines: ["B = 6", "D = 15", "A = 7"] }),
        card({ x: 352, y: 224, fill: "#FFF3C4", label: "B = 3", size: 20 }),
        card({ x: 352, y: 304, fill: "#FFF3C4", label: "A = 5", size: 20 }),
        card({ x: 352, y: 384, fill: "#FFF3C4", label: "C = 2", size: 20 }),
        card({ x: 352, y: 476, fill: "#FFF3C4", label: "B = 6", size: 20 }),
        card({ x: 352, y: 548, fill: "#FFF3C4", label: "D = 15", size: 20 }),
        record({ x: 620, y: 250, fill: "#FCE7EC", lines: ["B, 3", "A, 5", "C, 2"] }),
        record({ x: 620, y: 428, fill: "#FCE7EC", lines: ["B, 6", "D, 15", "A, 7"] }),
        card({ x: 902, y: 232, w: 180, fill: "#E9F7E6", label: "A(5, 7)", size: 20 }),
        card({ x: 902, y: 330, w: 180, fill: "#E9F7E6", label: "B(3, 6)", size: 20 }),
        card({ x: 902, y: 428, w: 180, fill: "#E9F7E6", label: "C(2)", size: 20 }),
        card({ x: 902, y: 526, w: 180, fill: "#E9F7E6", label: "D(15)", size: 20 }),
        card({ x: 1248, y: 232, w: 150, fill: "#E8F7FA", label: "A, 12", size: 20 }),
        card({ x: 1248, y: 330, w: 150, fill: "#E8F7FA", label: "B, 9", size: 20 }),
        card({ x: 1248, y: 428, w: 150, fill: "#E8F7FA", label: "C, 2", size: 20 }),
        card({ x: 1248, y: 526, w: 150, fill: "#E8F7FA", label: "D, 15", size: 20 }),
        record({ x: 1514, y: 326, w: 132, h: 170, fill: "#E8F7FA", lines: ["A = 12", "B = 9", "C = 2", "D = 15"] }),
        poly("226,294 352,256", muted, 2),
        poly("226,294 352,336", muted, 2),
        poly("226,472 352,508", muted, 2),
        poly("512,336 620,294", muted, 2),
        poly("512,508 620,472", muted, 2),
        poly("764,294 902,264", muted, 2),
        poly("764,294 902,362", muted, 2),
        poly("764,472 902,362", muted, 2),
        poly("764,472 902,558", muted, 2),
        poly("1082,264 1248,264", muted, 2),
        poly("1082,362 1248,362", muted, 2),
        poly("1082,460 1248,460", muted, 2),
        poly("1082,558 1248,558", muted, 2),
        poly("1398,264 1514,392", muted, 2),
        poly("1398,362 1514,402", muted, 2),
        poly("1398,460 1514,432", muted, 2),
        poly("1398,558 1514,454", muted, 2),
        `</g>`,
      ].join("\n"),
    ),
  },
  {
    id: "02-warehouse-layer-ladder",
    title: "D02 Warehouse Layer Ladder",
    svg: svg(
      1680,
      1190,
      [
        text(78, 90, "D02 Warehouse Layer Ladder", 42, ink, 850),
        text(80, 146, "Layered lineage: raw sources converge into curated data products", 20, muted, 560),
        `<g transform="translate(0 80)">`,
        boundary(78, 168, 300, 610, "ODS"),
        boundary(520, 168, 300, 610, "DWD"),
        boundary(962, 168, 300, 610, "DM"),
        boundary(1388, 168, 220, 610, "APP"),
        boundary(1004, 860, 260, 118, "DIM", 1134, 1028),
        card({ x: 152, y: 278, fill: "#F2F2F2", label: "orders" }),
        card({ x: 152, y: 442, fill: "#F2F2F2", label: "users" }),
        card({ x: 152, y: 606, fill: "#F2F2F2", label: "events" }),
        card({ x: 584, y: 220, fill: "#FCE7EC", label: "dwd_order" }),
        card({ x: 584, y: 370, fill: "#FCE7EC", label: "dwd_user" }),
        card({ x: 584, y: 520, fill: "#FCE7EC", label: "dwd_event" }),
        card({ x: 584, y: 670, fill: "#FCE7EC", label: "dwd_item" }),
        card({ x: 1028, y: 404, fill: "#E8F7FA", label: "dm_trade" }),
        card({ x: 1420, y: 430, fill: "#FFF3C4", label: "app_roi" }),
        card({ x: 1058, y: 898, fill: "#E9F7E6", label: "dim_date" }),
        poly("302,310 584,252", ink, 2.2),
        poly("302,474 584,402", ink, 2.2),
        poly("302,638 584,552", ink, 2.2),
        poly("302,474 584,702", ink, 2.2),
        poly("734,252 1028,436", ink, 2.2),
        poly("734,402 1028,436", ink, 2.2),
        poly("734,552 1028,436", ink, 2.2),
        poly("734,702 1028,436", ink, 2.2),
        poly("1178,436 1420,462", ink, 2.2),
        poly("1188,898 1450,494", ink, 2.2),
        `</g>`,
      ].join("\n"),
    ),
  },
  {
    id: "03-spaghetti-to-structure",
    title: "D03 Spaghetti To Structure",
    svg: svg(
      1680,
      1020,
      [
        text(90, 90, "D03 Spaghetti To Structure", 42, ink, 850),
        text(92, 146, "Use the left side to show dependency chaos, then show the governed target state", 20, muted, 560),
        `<g transform="translate(0 76)">`,
        poly("90,160 780,160 780,760 90,760 90,160", ink, 2, false),
        poly("900,160 1590,160 1590,760 900,760 900,160", ink, 2, false),
        center(435, 828, "乱", 42, ink, 820),
        center(1245, 828, "治", 42, ink, 820),
        ellipse(250, 300, 48, 48, "#F2F2F2"),
        ellipse(410, 320, 48, 48, "#FCE7EC"),
        ellipse(580, 395, 54, 54, "#FCE7EC"),
        ellipse(350, 485, 54, 54, "#E8F7FA"),
        ellipse(575, 575, 54, 54, "#E8F7FA"),
        ellipse(420, 650, 48, 48, "#FFF3C4"),
        ellipse(245, 620, 48, 48, "#E9F7E6"),
        ellipse(620, 275, 48, 48, "#EEE7FF"),
        poly("298,300 362,314", ink, 2.2),
        poly("454,345 530,382", ink, 2.2),
        poly("410,368 365,435", ink, 2.2),
        poly("350,432 410,368", ink, 2.2),
        poly("405,520 515,558", ink, 2.2),
        poly("578,450 576,521", ink, 2.2),
        poly("620,323 592,520", ink, 2.2),
        poly("293,620 371,655", ink, 2.2),
        poly("420,600 515,586", ink, 2.2),
        poly("250,252 380,220 620,240 680,295", ink, 2.2),
        poly("800,460 880,460", ink, 2.4),
        poly("920,210 1568,210 1568,360 920,360 920,210", ink, 2, false),
        poly("920,400 1568,400 1568,560 920,560 920,400", ink, 2, false),
        poly("920,600 1568,600 1568,740 920,740 920,600", ink, 2, false),
        card({ x: 980, y: 252, w: 136, h: 70, fill: "#F2F2F2", label: "ODS" }),
        card({ x: 1160, y: 252, w: 136, h: 70, fill: "#FCE7EC", label: "DWD" }),
        card({ x: 1340, y: 252, w: 136, h: 70, fill: "#EEE7FF", label: "APP" }),
        card({ x: 1020, y: 452, w: 136, h: 70, fill: "#EEE7FF", label: "DIM" }),
        card({ x: 1200, y: 452, w: 136, h: 70, fill: "#E8F7FA", label: "DM" }),
        card({ x: 1380, y: 452, w: 136, h: 70, fill: "#E8F7FA", label: "APP" }),
        card({ x: 1040, y: 646, w: 136, h: 70, fill: "#E9F7E6", label: "Policy" }),
        card({ x: 1220, y: 646, w: 136, h: 70, fill: "#FFF3C4", label: "Quality" }),
        poly("1116,287 1160,287", ink, 2.2),
        poly("1296,287 1340,287", ink, 2.2),
        poly("1156,487 1200,487", ink, 2.2),
        poly("1336,487 1380,487", ink, 2.2),
        poly("1290,522 1290,646", ink, 2.2),
        `</g>`,
      ].join("\n"),
    ),
  },
  {
    id: "04-governance-swimlanes",
    title: "D04 Governance Swimlanes",
    svg: svg(
      1680,
      1020,
      [
        text(130, 90, "D04 Governance Swimlanes", 42, ink, 850),
        text(132, 146, "Governance as trust-building lanes: ingest, validate, model, own, serve", 20, muted, 560),
        `<g transform="translate(0 76)">`,
        poly("130,180 1540,180 1540,300 130,300 130,180", ink, 2, false),
        poly("130,340 1540,340 1540,460 130,460 130,340", ink, 2, false),
        poly("130,500 1540,500 1540,620 130,620 130,500", ink, 2, false),
        poly("130,660 1540,660 1540,780 130,780 130,660", ink, 2, false),
        text(156, 254, "Producers", 30, ink, 780),
        text(156, 414, "Validation", 30, ink, 780),
        text(156, 574, "Modeling", 30, ink, 780),
        text(156, 734, "Serving", 30, ink, 780),
        card({ x: 410, y: 208, w: 150, h: 64, fill: "#F2F2F2", label: "Events" }),
        card({ x: 700, y: 208, w: 150, h: 64, fill: "#F2F2F2", label: "Orders" }),
        card({ x: 990, y: 208, w: 150, h: 64, fill: "#F2F2F2", label: "Users" }),
        card({ x: 520, y: 368, w: 170, h: 64, fill: "#FFF3C4", label: "Schema" }),
        card({ x: 840, y: 368, w: 170, h: 64, fill: "#FFF3C4", label: "Quality" }),
        card({ x: 1160, y: 368, w: 170, h: 64, fill: "#FFF3C4", label: "Lineage" }),
        card({ x: 520, y: 528, w: 170, h: 64, fill: "#FCE7EC", label: "DWD" }),
        card({ x: 840, y: 528, w: 170, h: 64, fill: "#E8F7FA", label: "DM" }),
        card({ x: 1160, y: 528, w: 170, h: 64, fill: "#EEE7FF", label: "Owner" }),
        card({ x: 620, y: 688, w: 190, h: 64, fill: "#E9F7E6", label: "Trusted API" }),
        card({ x: 990, y: 688, w: 190, h: 64, fill: "#E9F7E6", label: "Dashboard" }),
        poly("485,272 605,368", muted, 2),
        poly("775,272 925,368", muted, 2),
        poly("1065,272 1245,368", muted, 2),
        poly("605,432 605,528", ink, 2.2),
        poly("925,432 925,528", ink, 2.2),
        poly("1245,432 1245,528", ink, 2.2),
        poly("690,560 840,560", ink, 2.2),
        poly("1010,560 1160,560", ink, 2.2),
        poly("925,592 715,688", ink, 2.2),
        poly("1245,592 1085,688", ink, 2.2),
        rect(1340, 674, 130, 92, "#FAFAF5", ink, 2, 4),
        text(1364, 708, "SLA", 20, ink, 760),
        text(1364, 738, "owner", 18, muted, 600),
        `</g>`,
      ].join("\n"),
    ),
  },
];

for (const board of boards) {
  const svgPath = path.join(outDir, `${board.id}.svg`);
  const jsonPath = path.join(outDir, `${board.id}.agentdraw.json`);
  const pngPath = path.join(outDir, `${board.id}.preview.png`);
  fs.writeFileSync(svgPath, board.svg);
  run("pnpm", [
    "agentdraw",
    "import-svg",
    svgPath,
    "--out",
    jsonPath,
    "--style",
    "hatch-whiteboard",
    "--title",
    board.title,
    "--format",
    "json",
  ]);
  run("pnpm", [
    "agentdraw",
    "repair",
    jsonPath,
    "--style",
    "hatch-whiteboard",
    "--write",
    "--format",
    "json",
  ]);
  run("pnpm", [
    "agentdraw",
    "validate",
    jsonPath,
    "--style",
    "hatch-whiteboard",
    "--format",
    "json",
  ]);
  run("pnpm", [
    "agentdraw",
    "export",
    jsonPath,
    "--format",
    "png",
    "--out",
    pngPath,
    "--json",
  ]);
}

fs.writeFileSync(
  path.join(outDir, "index.json"),
  `${JSON.stringify(boards.map(({ id, title }) => ({ id, title, style: "hatch-whiteboard" })), null, 2)}\n`,
);

console.log(JSON.stringify({ outDir, count: boards.length }, null, 2));

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: path.resolve("."),
    stdio: "inherit",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
