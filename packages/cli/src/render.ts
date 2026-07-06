import { Resvg } from "@resvg/resvg-js";
import type { AgentDrawScene } from "@agentdraw/scene";
import { existsSync } from "node:fs";

export type RenderFormat = "svg" | "png";

export type RenderOptions = {
  scale?: number;
};

export const renderSceneSvg = (scene: AgentDrawScene, options: RenderOptions = {}) => {
  const elements = scene.elements.filter(isRenderableElement);
  const bounds = sceneBounds(elements);
  const margin = 36;
  const scale = clampNumber(options.scale ?? 1, 0.25, 4);
  const viewBox = {
    x: bounds.x - margin,
    y: bounds.y - margin,
    width: bounds.width + margin * 2,
    height: bounds.height + margin * 2,
  };
  const canvas = color(scene.appState?.viewBackgroundColor, "#ffffff");
  const width = Math.max(1, Math.round(viewBox.width * scale));
  const height = Math.max(1, Math.round(viewBox.height * scale));

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" role="img" aria-label="${escapeXml(scene.title)} preview">`,
    `<rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="${canvas}"/>`,
    ...elements.map(renderElement).filter(Boolean),
    "</svg>",
    "",
  ].join("\n");
};

export const renderScenePng = (scene: AgentDrawScene, options: RenderOptions = {}) => {
  const svg = renderSceneSvg(scene, options);
  return new Resvg(svg, {
    fitTo: {
      mode: "original",
    },
    font: {
      loadSystemFonts: true,
      fontDirs: systemFontDirs(),
      defaultFontFamily: "DejaVu Sans",
      sansSerifFamily: "DejaVu Sans",
    },
    languages: ["zh-CN", "en"],
  }).render().asPng();
};

const renderElement = (element: ElementRecord) => {
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
};

const renderText = (element: ElementRecord) => {
  const x = number(element.x);
  const y = number(element.y);
  const width = Math.max(1, number(element.width));
  const height = Math.max(1, number(element.height));
  const fontSize = number(element.fontSize, 16);
  const lineHeight = number(element.lineHeight, 1.25);
  const lines = String(element.text ?? "").split("\n");
  const anchor = element.textAlign === "center" ? "middle" : element.textAlign === "right" ? "end" : "start";
  const textX = element.textAlign === "center" ? x + width / 2 : element.textAlign === "right" ? x + width : x;
  const offsetY =
    element.verticalAlign === "middle"
      ? (height - lines.length * fontSize * lineHeight) / 2 + fontSize
      : fontSize;
  const family =
    element.fontFamily === 1
      ? `${CJK_FONT_STACK}, Virgil, Comic Sans MS, cursive`
      : element.fontFamily === 3
        ? `${CJK_MONO_FONT_STACK}, Menlo, Consolas, monospace`
        : `${CJK_FONT_STACK}, Inter, Arial, sans-serif`;

  return [
    `<text x="${textX}" y="${y + offsetY}" fill="${stroke(element)}" font-family="${family}" font-size="${fontSize}" font-weight="${fontWeight(element)}" text-anchor="${anchor}">`,
    ...lines.map((line, index) =>
      `<tspan x="${textX}" dy="${index === 0 ? 0 : fontSize * lineHeight}">${escapeXml(line)}</tspan>`,
    ),
    "</text>",
  ].join("");
};

const renderConnector = (element: ElementRecord) => {
  const points = connectorPoints(element);
  if (points.length < 2) {
    return "";
  }
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const color = stroke(element);
  const strokeWidth = number(element.strokeWidth, 2);
  return [
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    element.endArrowhead ? renderArrowhead(points, color, strokeWidth) : "",
  ].join("");
};

const renderArrowhead = (points: Array<{ x: number; y: number }>, color: string, strokeWidth: number) => {
  const end = points.at(-1);
  const previous = [...points].reverse().find((point) => {
    if (!end) return false;
    return Math.hypot(end.x - point.x, end.y - point.y) > 0.1;
  });
  if (!end || !previous) {
    return "";
  }

  const dx = end.x - previous.x;
  const dy = end.y - previous.y;
  const length = Math.hypot(dx, dy);
  if (length <= 0.1) {
    return "";
  }

  const unitX = dx / length;
  const unitY = dy / length;
  const perpX = -unitY;
  const perpY = unitX;
  const size = clampNumber(strokeWidth * 2.4 + 5, 8, 16);
  const halfBase = size * 0.45;
  const baseX = end.x - unitX * size;
  const baseY = end.y - unitY * size;
  const triangle = [
    [end.x, end.y],
    [baseX + perpX * halfBase, baseY + perpY * halfBase],
    [baseX - perpX * halfBase, baseY - perpY * halfBase],
  ]
    .map((point) => point.join(","))
    .join(" ");

  return `<polygon points="${triangle}" fill="${color}" stroke="${color}" stroke-width="1"/>`;
};

type ElementRecord = Record<string, unknown> & {
  type?: string;
  isDeleted?: boolean;
  textAlign?: string;
  verticalAlign?: string;
  endArrowhead?: unknown;
};

const isRenderableElement = (element: unknown): element is ElementRecord =>
  Boolean(element && typeof element === "object" && !(element as ElementRecord).isDeleted);

const sceneBounds = (elements: ElementRecord[]) => {
  const boxes = elements.map(elementBounds).filter((box): box is Bounds => Boolean(box));
  if (boxes.length === 0) {
    return { x: 0, y: 0, width: 640, height: 360 };
  }
  const x = Math.min(...boxes.map((box) => box.x));
  const y = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x, y, width: right - x, height: bottom - y };
};

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const elementBounds = (element: ElementRecord): Bounds | null => {
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
};

const normalizedRect = (element: ElementRecord) => {
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
};

const connectorPoints = (element: ElementRecord) => {
  if (!Array.isArray(element.points)) {
    return [];
  }
  const x = number(element.x);
  const y = number(element.y);
  return element.points
    .filter((point): point is [unknown, unknown] => Array.isArray(point) && point.length >= 2)
    .map((point) => ({ x: x + number(point[0]), y: y + number(point[1]) }));
};

const fill = (element: ElementRecord) => {
  const value = color(element.backgroundColor, "transparent");
  return value === "transparent" ? "none" : value;
};

const stroke = (element: ElementRecord) => color(element.strokeColor, "#111111");

const color = (value: unknown, fallback: string) => (typeof value === "string" ? value : fallback);

const radius = (element: ElementRecord) => {
  if (!element.roundness) {
    return 0;
  }
  return Math.min(
    12,
    Math.max(4, Math.min(Math.abs(number(element.width)), Math.abs(number(element.height))) * 0.08),
  );
};

const fontWeight = (element: ElementRecord) => (number(element.fontSize, 16) >= 24 ? 700 : 500);

const CJK_FONT_STACK = [
  "Inter",
  "Arial",
  "Helvetica",
  "DejaVu Sans",
  "Liberation Sans",
  "Noto Sans CJK SC",
  "Noto Sans SC",
  "Source Han Sans SC",
  "PingFang SC",
  "Hiragino Sans GB",
  "Microsoft YaHei",
  "SimSun",
  "WenQuanYi Micro Hei",
  "Arial Unicode MS",
].join(", ");

const CJK_MONO_FONT_STACK = [
  "Menlo",
  "Consolas",
  "DejaVu Sans Mono",
  "Liberation Mono",
  "Noto Sans Mono CJK SC",
  "Noto Sans CJK SC",
  "Source Han Sans SC",
  "Microsoft YaHei",
  "SimSun",
  "WenQuanYi Micro Hei",
].join(", ");

const systemFontDirs = () =>
  [
    "/usr/share/fonts",
    "/usr/local/share/fonts",
    "/System/Library/Fonts",
    "/Library/Fonts",
    `${process.env.HOME ?? ""}/Library/Fonts`,
    `${process.env.HOME ?? ""}/.local/share/fonts`,
  ].filter((dir) => dir && existsSync(dir));

const number = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const escapeXml = (value: unknown) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
