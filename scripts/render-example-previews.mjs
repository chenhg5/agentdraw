import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const themeFiles = (await readdir("examples"))
  .filter(
    (file) =>
      (file.startsWith("theme-") || file.startsWith("capability-")) &&
      file.endsWith(".agentdraw.json"),
  )
  .sort();
const examples = [
  ["complex-agentdraw-workbench", "examples/complex-agentdraw-workbench.agentdraw.json"],
  ...themeFiles.map((file) => [file.replace(".agentdraw.json", ""), path.join("examples", file)]),
];

await mkdir("assets/examples", { recursive: true });

for (const [name, filePath] of examples) {
  const scene = JSON.parse(await readFile(filePath, "utf8"));
  const svg = renderScene(scene);
  await writeFile(path.join("assets/examples", `${name}.svg`), svg, "utf8");
}

function renderScene(scene) {
  const elements = scene.elements.filter((element) => element && !element.isDeleted);
  const bounds = sceneBounds(elements);
  const margin = 36;
  const viewBox = {
    x: bounds.x - margin,
    y: bounds.y - margin,
    width: bounds.width + margin * 2,
    height: bounds.height + margin * 2,
  };
  const canvas = scene.appState?.viewBackgroundColor ?? "#ffffff";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(viewBox.width)}" height="${Math.round(viewBox.height)}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" role="img" aria-label="${escapeXml(scene.title)} preview">`,
    "<defs>",
    '<marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="strokeWidth">',
    '<path d="M0,0 L10,4 L0,8 Z" fill="context-stroke"/>',
    "</marker>",
    "</defs>",
    `<rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="${canvas}"/>`,
    ...elements.map(renderElement).filter(Boolean),
    "</svg>",
    "",
  ].join("\n");
}

function renderElement(element) {
  if (element.type === "rectangle") {
    const { x, y, width, height } = normalizedRect(element);
    const strokeWidth = number(element.strokeWidth, 1);
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius(element)}" fill="${fill(element)}" stroke="${stroke(element)}" stroke-width="${strokeWidth}"/>`;
  }

  if (element.type === "ellipse") {
    const { x, y, width, height } = normalizedRect(element);
    return `<ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${fill(element)}" stroke="${stroke(element)}" stroke-width="${number(element.strokeWidth, 1)}"/>`;
  }

  if (element.type === "diamond") {
    const { x, y, width, height } = normalizedRect(element);
    const points = [
      [x + width / 2, y],
      [x + width, y + height / 2],
      [x + width / 2, y + height],
      [x, y + height / 2],
    ]
      .map((point) => point.join(","))
      .join(" ");
    return `<polygon points="${points}" fill="${fill(element)}" stroke="${stroke(element)}" stroke-width="${number(element.strokeWidth, 1)}"/>`;
  }

  if (element.type === "text") {
    return renderText(element);
  }

  if (element.type === "arrow" || element.type === "line") {
    return renderConnector(element);
  }

  return "";
}

function renderText(element) {
  const x = number(element.x);
  const y = number(element.y);
  const width = Math.max(1, number(element.width));
  const height = Math.max(1, number(element.height));
  const fontSize = number(element.fontSize, 16);
  const lineHeight = number(element.lineHeight, 1.25);
  const lines = String(element.text ?? "").split("\n");
  const anchor = element.textAlign === "center" ? "middle" : element.textAlign === "right" ? "end" : "start";
  const textX = element.textAlign === "center" ? x + width / 2 : element.textAlign === "right" ? x + width : x;
  const offsetY = element.verticalAlign === "middle"
    ? (height - lines.length * fontSize * lineHeight) / 2 + fontSize
    : fontSize;
  const family = element.fontFamily === 1
    ? "Virgil, Comic Sans MS, cursive"
    : element.fontFamily === 3
      ? "Menlo, Consolas, monospace"
      : "Inter, Arial, sans-serif";

  return [
    `<text x="${textX}" y="${y + offsetY}" fill="${stroke(element)}" font-family="${family}" font-size="${fontSize}" font-weight="${fontWeight(element)}" text-anchor="${anchor}">`,
    ...lines.map((line, index) =>
      `<tspan x="${textX}" dy="${index === 0 ? 0 : fontSize * lineHeight}">${escapeXml(line)}</tspan>`,
    ),
    "</text>",
  ].join("");
}

function renderConnector(element) {
  const points = connectorPoints(element);
  if (points.length < 2) {
    return "";
  }
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const marker = element.endArrowhead ? ' marker-end="url(#arrowhead)"' : "";
  return `<path d="${d}" fill="none" stroke="${stroke(element)}" stroke-width="${number(element.strokeWidth, 2)}" stroke-linecap="round" stroke-linejoin="round"${marker}/>`;
}

function sceneBounds(elements) {
  const boxes = elements.map(elementBounds).filter(Boolean);
  const x = Math.min(...boxes.map((box) => box.x));
  const y = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x, y, width: right - x, height: bottom - y };
}

function elementBounds(element) {
  if (element.type === "arrow" || element.type === "line") {
    const points = connectorPoints(element);
    if (points.length === 0) {
      return null;
    }
    const x = Math.min(...points.map((point) => point.x));
    const y = Math.min(...points.map((point) => point.y));
    const right = Math.max(...points.map((point) => point.x));
    const bottom = Math.max(...points.map((point) => point.y));
    return { x, y, width: right - x, height: bottom - y };
  }
  return normalizedRect(element);
}

function normalizedRect(element) {
  const x = number(element.x);
  const y = number(element.y);
  const width = number(element.width);
  const height = number(element.height);
  return {
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height),
  };
}

function connectorPoints(element) {
  if (!Array.isArray(element.points)) {
    return [];
  }
  const x = number(element.x);
  const y = number(element.y);
  return element.points
    .filter((point) => Array.isArray(point) && point.length >= 2)
    .map((point) => ({ x: x + number(point[0]), y: y + number(point[1]) }));
}

function fill(element) {
  const color = element.backgroundColor ?? "transparent";
  return color === "transparent" ? "none" : color;
}

function stroke(element) {
  return element.strokeColor ?? "#111111";
}

function radius(element) {
  if (!element.roundness) {
    return 0;
  }
  return Math.min(12, Math.max(4, Math.min(Math.abs(number(element.width)), Math.abs(number(element.height))) * 0.08));
}

function fontWeight(element) {
  return number(element.fontSize, 16) >= 24 ? 700 : 500;
}

function number(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
