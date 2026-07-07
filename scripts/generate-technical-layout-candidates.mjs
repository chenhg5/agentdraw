import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(".agentdraw/technical-layout-candidates");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const fontStack =
  "JetBrains Mono, SF Mono, Cascadia Code, Menlo, Consolas, Noto Sans SC, monospace";

const text = (x, y, value, size = 16, fill = "#F8FAFC", weight = 500, extra = "") =>
  `<text x="${x}" y="${y}" font-family="${fontStack}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(value)}</text>`;

const center = (x, y, value, size = 16, fill = "#F8FAFC", weight = 700) =>
  text(x, y, value, size, fill, weight, `text-anchor="middle" dominant-baseline="middle"`);

const rect = (x, y, width, height, fill, stroke = "none", sw = 0, rx = 6, extra = "") =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

const poly = (points, stroke = "#64748B", sw = 2, arrow = true, extra = "") =>
  `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${arrow ? `marker-end="url(#arrow)"` : ""} ${extra}/>`;

const node = ({ x, y, w, h, stroke, title, detail, meta, fill = "#0F172A" }) =>
  [
    rect(x, y, w, h, fill, stroke, 2, 7),
    center(x + w / 2, y + 34, title, 20, "#F8FAFC", 780),
    detail ? center(x + w / 2, y + 66, detail, 15, "#CBD5E1", 560) : "",
    meta && h >= 104 ? center(x + w / 2, y + h - 22, meta, 14, stroke, 720) : "",
  ].join("\n");

const legend = (x, y, items) =>
  [
    text(x, y, "Legend", 18, "#F8FAFC", 780),
    ...items.flatMap(([label, color], index) => {
      const lx = x + index * 190;
      return [
        rect(lx, y + 26, 28, 16, "#0F172A", color, 2, 3),
        text(lx + 40, y + 42, label, 16, "#CBD5E1", 620),
      ];
    }),
  ].join("\n");

const svg = (width, height, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0,10 5,0 10" fill="#64748B"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="#020617"/>
${body}
</svg>
`;

const boards = [
  {
    id: "01-infra-architecture-reference",
    title: "Infra Architecture Reference",
    svg: svg(
      1440,
      900,
      [
        text(88, 104, "Infra Architecture Reference", 44, "#F8FAFC", 850),
        text(90, 148, "A readable dark technical map: boundary, lanes, semantic colors, and edge-connected flows", 20, "#CBD5E1", 560),

        poly("286,200 1380,200 1380,780 286,780 286,200", "#FBBF24", 2, false, `stroke-dasharray="10,6"`),
        text(312, 232, "Production Cloud Region / VPC", 18, "#FBBF24", 780),

        node({ x: 92, y: 382, w: 160, h: 112, stroke: "#64748B", title: "Users", detail: "Web / Mobile", meta: "external" }),
        node({ x: 328, y: 354, w: 220, h: 148, stroke: "#22D3EE", title: "Edge CDN", detail: "TLS termination", meta: "HTTPS :443" }),
        node({ x: 622, y: 354, w: 226, h: 148, stroke: "#FB7185", title: "API Gateway", detail: "Auth + routing", meta: "JWT / rate limit" }),

        node({ x: 920, y: 260, w: 210, h: 112, stroke: "#34D399", title: "User API", detail: "Go service", meta: ":8081" }),
        node({ x: 920, y: 432, w: 210, h: 112, stroke: "#34D399", title: "Order API", detail: "Java service", meta: ":8082" }),
        node({ x: 920, y: 636, w: 210, h: 112, stroke: "#34D399", title: "Worker", detail: "async jobs", meta: "queue consumer" }),

        node({ x: 1182, y: 260, w: 170, h: 112, stroke: "#A78BFA", title: "Postgres", detail: "primary DB", meta: "state" }),
        node({ x: 1182, y: 432, w: 170, h: 112, stroke: "#A78BFA", title: "Redis", detail: "cache", meta: "TTL 5m" }),
        rect(920, 584, 432, 34, "#111827", "#FB923C", 2, 5),
        center(1136, 601, "Event bus: domain.events", 16, "#FB923C", 780),

        poly("252,438 328,438", "#64748B", 2.5, true),
        poly("548,428 622,428", "#64748B", 2.5, true),
        poly("848,428 884,428 884,316 920,316", "#64748B", 2.5, true),
        poly("848,456 884,456 884,488 920,488", "#64748B", 2.5, true),
        poly("1130,316 1182,316", "#64748B", 2.5, true),
        poly("1130,488 1182,488", "#64748B", 2.5, true),
        poly("1025,544 1025,584", "#FB923C", 2, true, `stroke-dasharray="7,5"`),
        poly("1136,618 1136,692 1130,692", "#FB923C", 2, true, `stroke-dasharray="7,5"`),

        legend(328, 812, [
          ["edge", "#22D3EE"],
          ["security", "#FB7185"],
          ["compute", "#34D399"],
          ["data", "#A78BFA"],
          ["event", "#FB923C"],
        ]),
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
    "infra-dark",
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
    "infra-dark",
    "--write",
    "--format",
    "json",
  ]);
  run("pnpm", [
    "agentdraw",
    "validate",
    jsonPath,
    "--style",
    "infra-dark",
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
  `${JSON.stringify(boards.map(({ id, title }) => ({ id, title, style: "infra-dark" })), null, 2)}\n`,
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
