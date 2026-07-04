import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const outputDir = "examples";
const sourceDir = "examples/source";

await mkdir(outputDir, { recursive: true });
await mkdir(sourceDir, { recursive: true });

const examples = [
  {
    id: "capability-flowchart",
    title: "Agent Runtime Flowchart",
    styleId: "blueprint-formal",
    svg: flowchartSvg(),
  },
  {
    id: "capability-sequence",
    title: "SVG Import Sequence",
    styleId: "boardroom",
    svg: sequenceSvg(),
  },
  {
    id: "capability-class-map",
    title: "AgentDraw Module Map",
    styleId: "raw-grid",
    svg: classMapSvg(),
  },
];

for (const example of examples) {
  const svgPath = `${sourceDir}/${example.id}.svg`;
  const scenePath = `${outputDir}/${example.id}.agentdraw.json`;
  await writeFile(svgPath, `${example.svg}\n`, "utf8");
  run("node", [
    "packages/cli/dist/index.js",
    "import-svg",
    svgPath,
    "--out",
    scenePath,
    "--style",
    example.styleId,
    "--title",
    example.title,
    "--format",
    "json",
  ]);
  run("node", [
    "packages/cli/dist/index.js",
    "repair",
    scenePath,
    "--style",
    example.styleId,
    "--write",
    "--format",
    "json",
  ]);
  const scene = JSON.parse(await readFile(scenePath, "utf8"));
  scene.id = example.id;
  scene.updatedAt = "2026-07-04T00:00:00.000Z";
  scene.appState = {
    ...scene.appState,
    viewBackgroundColor: palette(example.styleId).canvas,
  };
  await writeFile(scenePath, `${JSON.stringify(scene, null, 2)}\n`, "utf8");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function flowchartSvg() {
  const p = palette("blueprint-formal");
  const steps = [
    [96, 206, "User prompt", "intent + constraints"],
    [336, 206, "Choose style", "design.md + contract"],
    [576, 206, "Draft SVG", "layout is source"],
    [816, 206, "Import board", "editable objects"],
    [576, 430, "Validate", "repair warnings"],
    [816, 430, "Open editor", "human refinement"],
  ];
  return svg(1180, 720, p, [
    grid(p),
    frame(52, 52, 1076, 600, p.canvas, p.ink, 2, 0),
    text(86, 116, "Agent Runtime Flowchart", 38, 760, p.ink),
    text(88, 154, "A Mermaid-like flowchart with editable imported nodes", 16, 500, p.muted),
    marker(p.accent),
    ...steps.flatMap(([x, y, title, body]) => [
      rect(x, y, 186, 106, p.panel, p.accent, 2, 0),
      rect(x, y, 186, 30, p.accent2, p.accent, 2, 0),
      centerText(x + 93, y + 16, title, 17, 750, p.ink),
      multiText(x + 93, y + 70, [body, "agent-safe"], 15, 500, p.muted),
    ]),
    arrow(282, 259, 336, 259, p.accent),
    arrow(522, 259, 576, 259, p.accent),
    arrow(762, 259, 816, 259, p.accent),
    polyline("909,312 909,370 669,370 669,430", p.accent),
    arrow(762, 483, 816, 483, p.accent),
    rect(96, 430, 456, 106, "#DBEAFE", p.ink, 2, 0),
    text(124, 468, "Decision gate", 22, 760, p.ink),
    text(124, 504, "If preview looks weak, revise SVG and re-import.", 16, 500, p.muted),
    polyline("576,483 552,483", p.accent),
  ]);
}

function sequenceSvg() {
  const p = palette("boardroom");
  const actors = [
    [120, "Agent"],
    [360, "SVG source"],
    [600, "AgentDraw CLI"],
    [840, "Browser editor"],
    [1040, "User"],
  ];
  const rows = [
    [286, 120, 360, "write restricted SVG"],
    [354, 360, 600, "import-svg"],
    [422, 600, 840, "open editable board"],
    [490, 840, 1040, "manual refinements"],
    [558, 840, 600, "autosave snapshot"],
  ];
  return svg(1180, 720, p, [
    frame(52, 52, 1076, 600, p.canvas, p.ink, 2, 6),
    text(84, 112, "SVG Import Sequence", 36, 760, p.ink),
    text(86, 148, "Sequence diagram showing the local generation and editing loop", 16, 500, p.muted),
    marker(p.accent),
    ...actors.flatMap(([x, label]) => [
      rect(x - 74, 190, 148, 48, p.panel, p.line, 2, 4),
      centerText(x, 214, label, 17, 750, p.ink),
      line(x, 238, x, 590, p.line, 1),
    ]),
    ...rows.flatMap(([y, x1, x2, label]) => [
      arrow(x1 + Math.sign(x2 - x1) * 74, y, x2 - Math.sign(x2 - x1) * 74, y, p.accent),
      text(Math.min(x1, x2) + 92, y - 18, label, 15, 650, p.ink),
    ]),
    rect(84, 610, 1010, 34, p.accent2, p.line, 1, 4),
    centerText(589, 627, "All messages stay local; final board remains editable.", 15, 700, p.ink),
  ]);
}

function classMapSvg() {
  const p = palette("raw-grid");
  const modules = [
    [86, 198, "AgentDrawScene", ["elements: Element[]", "appState: object", "files: object"]],
    [396, 198, "SvgImporter", ["parse(svg)", "toScene()", "warnings[]"]],
    [706, 198, "Validator", ["text overflow", "connector edges", "style drift"]],
    [396, 430, "LocalServer", ["GET /api/scene", "POST /api/scene", "stale-save guard"]],
    [706, 430, "WebEditor", ["Excalidraw provider", "import/export", "manual edits"]],
  ];
  return svg(1180, 720, p, [
    frame(52, 52, 1076, 600, p.canvas, p.ink, 2, 0),
    text(84, 112, "AgentDraw Module Map", 38, 800, p.ink),
    text(86, 150, "Class-diagram style overview of the editable diagram runtime", 16, 500, p.muted),
    marker(p.ink),
    ...modules.flatMap(([x, y, title, lines]) => [
      rect(x, y, 246, 150, p.panel, p.ink, 2, 0),
      rect(x, y, 246, 38, p.ink, p.ink, 2, 0),
      centerText(x + 123, y + 20, title, 18, 800, p.canvas),
      ...lines.map((line, index) => text(x + 18, y + 72 + index * 28, line, 15, 600, p.ink)),
    ]),
    arrow(332, 273, 396, 273, p.ink),
    arrow(642, 273, 706, 273, p.ink),
    polyline("519,348 519,430", p.ink),
    polyline("829,348 829,430", p.ink),
    arrow(642, 505, 706, 505, p.ink),
    rect(86, 430, 246, 150, "#F2D4CF", p.ink, 2, 0),
    text(104, 472, "DesignContract", 18, 800, p.ink),
    text(104, 510, "palette + type", 15, 600, p.ink),
    text(104, 538, "geometry + rules", 15, 600, p.ink),
    arrow(332, 505, 396, 505, p.ink),
  ]);
}

function palette(styleId) {
  const palettes = {
    "blueprint-formal": {
      canvas: "#F8FBFF",
      ink: "#163B68",
      panel: "#FFFFFF",
      accent: "#0B63CE",
      accent2: "#DBEAFE",
      muted: "#5B708A",
      line: "#B9C5D5",
    },
    boardroom: {
      canvas: "#FFFFFF",
      ink: "#182230",
      panel: "#F8FAFC",
      accent: "#4053D6",
      accent2: "#E7EEF8",
      muted: "#667085",
      line: "#BEC1C5",
    },
    "raw-grid": {
      canvas: "#FFFFFF",
      ink: "#0A0A0A",
      panel: "#F8F8F8",
      accent: "#0A0A0A",
      accent2: "#F2D4CF",
      muted: "#5B5B5B",
      line: "#0A0A0A",
    },
  };
  return palettes[styleId];
}

function svg(width, height, p, children) {
  return [
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`,
    `<rect width="${width}" height="${height}" fill="${p.canvas}" />`,
    ...children,
    "</svg>",
  ].join("\n");
}

function grid(p) {
  const lines = [];
  for (let x = 60; x <= 1120; x += 80) {
    lines.push(`<line x1="${x}" y1="60" x2="${x}" y2="650" stroke="${p.line}" stroke-width="1" opacity="0.3" />`);
  }
  for (let y = 70; y <= 630; y += 80) {
    lines.push(`<line x1="60" y1="${y}" x2="1120" y2="${y}" stroke="${p.line}" stroke-width="1" opacity="0.3" />`);
  }
  return lines.join("\n");
}

function marker(color) {
  return [
    "<defs>",
    `<marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">`,
    `<path d="M 0 0 L 10 5 L 0 10 z" fill="${color}" />`,
    "</marker>",
    "</defs>",
  ].join("");
}

function frame(x, y, width, height, fill, stroke, strokeWidth, rx) {
  return rect(x, y, width, height, fill, stroke, strokeWidth, rx, "frame");
}

function rect(x, y, width, height, fill, stroke, strokeWidth, rx, role) {
  const roleAttr = role ? ` data-agentdraw-role="${role}"` : "";
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${roleAttr} />`;
}

function text(x, y, value, size, weight, fill) {
  return `<text x="${x}" y="${y}" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(value)}</text>`;
}

function centerText(x, y, value, size, weight, fill) {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(value)}</text>`;
}

function multiText(x, y, lines, size, weight, fill) {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, Noto Sans SC, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? "-0.6em" : "1.2em"}">${escapeXml(line)}</tspan>`).join("")}</text>`;
}

function line(x1, y1, x2, y2, stroke, strokeWidth) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

function arrow(x1, y1, x2, y2, stroke, strokeWidth = 2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" marker-end="url(#arrow)" />`;
}

function polyline(points, stroke, strokeWidth = 2) {
  return `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" marker-end="url(#arrow)" />`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
