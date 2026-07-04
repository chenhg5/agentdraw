import { randomUUID } from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import type { AgentDrawScene } from "./index.js";

export type SvgImportWarning = {
  code: string;
  message: string;
  node?: string;
};

export type SvgImportResult = {
  scene: AgentDrawScene;
  warnings: SvgImportWarning[];
};

type SvgImportOptions = {
  title?: string;
  styleId?: string;
};

type XmlNode = Record<string, unknown>;

type Transform = {
  x: number;
  y: number;
};

type Style = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  fontWeight?: string;
  textAnchor?: string;
  dominantBaseline?: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  allowBooleanAttributes: true,
  trimValues: false,
  parseAttributeValue: false,
  parseTagValue: false,
  preserveOrder: true,
});

const SHAPE_TAGS = new Set(["rect", "circle", "ellipse", "line", "polyline", "text", "g", "svg", "defs", "marker", "tspan"]);

let seed = 20_000;

export const importSvgToAgentDrawScene = (
  svg: string,
  options: SvgImportOptions = {},
): SvgImportResult => {
  const warnings: SvgImportWarning[] = [];
  const parsed = parser.parse(svg) as XmlNode[];
  const svgNode = findFirstElement(parsed, "svg");
  if (!svgNode) {
    throw new Error("SVG input must contain an <svg> root element.");
  }

  const svgAttrs = attrsOf(svgNode);
  const elements: unknown[] = [];
  walkChildren(childrenOf(svgNode), {
    transform: { x: 0, y: 0 },
    style: styleFrom(svgAttrs, {}),
    elements,
    warnings,
    inDefs: false,
  });

  const title = options.title ?? titleFromSvg(svgNode) ?? "Imported SVG board";
  const scene: AgentDrawScene = {
    type: "agentdraw/scene",
    version: 1,
    id: randomUUID(),
    title,
    styleId: options.styleId ?? "boardroom",
    providerId: "excalidraw",
    updatedAt: new Date().toISOString(),
    elements,
    appState: {
      viewBackgroundColor: colorValue(svgAttrs.fill) ?? "#ffffff",
      currentItemFontFamily: 2,
      currentItemRoughness: 0,
      currentItemStrokeWidth: 2,
      currentItemArrowType: "sharp",
      currentItemEndArrowhead: "arrow",
    },
    files: {},
  };

  return { scene, warnings };
};

type WalkContext = {
  transform: Transform;
  style: Style;
  elements: unknown[];
  warnings: SvgImportWarning[];
  inDefs: boolean;
};

const walkChildren = (nodes: XmlNode[], context: WalkContext) => {
  for (const node of nodes) {
    const tag = tagOf(node);
    if (!tag) {
      continue;
    }
    const inDefs = context.inDefs || tag === "defs" || tag === "marker";
    if (inDefs && tag !== "svg" && tag !== "g" && tag !== "defs" && tag !== "marker") {
      continue;
    }

    if (!SHAPE_TAGS.has(tag)) {
      context.warnings.push({
        code: "unsupported-svg-tag",
        message: `Unsupported SVG tag <${tag}> was skipped.`,
        node: tag,
      });
      continue;
    }

    const attrs = attrsOf(node);
    const nextContext: WalkContext = {
      ...context,
      transform: combineTransform(context.transform, parseTranslate(attrs.transform)),
      style: styleFrom(attrs, context.style),
      inDefs,
    };

    if (tag === "g" || tag === "svg" || tag === "defs" || tag === "marker") {
      walkChildren(childrenOf(node), nextContext);
      continue;
    }
    if (nextContext.inDefs) {
      continue;
    }

    if (tag === "rect") {
      context.elements.push(rectElement(attrs, nextContext));
    } else if (tag === "circle") {
      context.elements.push(circleElement(attrs, nextContext));
    } else if (tag === "ellipse") {
      context.elements.push(ellipseElement(attrs, nextContext));
    } else if (tag === "line") {
      context.elements.push(lineElement(attrs, nextContext));
    } else if (tag === "polyline") {
      const element = polylineElement(attrs, nextContext);
      if (element) context.elements.push(element);
    } else if (tag === "text") {
      context.elements.push(textElement(node, attrs, nextContext));
    } else if (tag === "tspan") {
      context.warnings.push({
        code: "orphan-tspan",
        message: "A <tspan> outside <text> was skipped.",
        node: tag,
      });
    }
  }
};

const rectElement = (attrs: XmlNode, context: WalkContext) => {
  const x = num(attrs.x) + context.transform.x;
  const y = num(attrs.y) + context.transform.y;
  const width = num(attrs.width);
  const height = num(attrs.height);
  const rx = Math.max(num(attrs.rx), num(attrs.ry));
  return baseElement("rectangle", x, y, width, height, context.style, {
    ...customDataFromAttrs(attrs),
    roundness: rx > 0 ? { type: 3 } : null,
  });
};

const circleElement = (attrs: XmlNode, context: WalkContext) => {
  const r = num(attrs.r);
  return baseElement(
    "ellipse",
    num(attrs.cx) - r + context.transform.x,
    num(attrs.cy) - r + context.transform.y,
    r * 2,
    r * 2,
    context.style,
    { ...customDataFromAttrs(attrs), roundness: null },
  );
};

const ellipseElement = (attrs: XmlNode, context: WalkContext) => {
  const rx = num(attrs.rx);
  const ry = num(attrs.ry);
  return baseElement(
    "ellipse",
    num(attrs.cx) - rx + context.transform.x,
    num(attrs.cy) - ry + context.transform.y,
    rx * 2,
    ry * 2,
    context.style,
    { ...customDataFromAttrs(attrs), roundness: null },
  );
};

const lineElement = (attrs: XmlNode, context: WalkContext) => {
  const x1 = num(attrs.x1) + context.transform.x;
  const y1 = num(attrs.y1) + context.transform.y;
  const x2 = num(attrs.x2) + context.transform.x;
  const y2 = num(attrs.y2) + context.transform.y;
  return connectorElement(
    x1,
    y1,
    [
      [0, 0],
      [x2 - x1, y2 - y1],
    ],
    context.style,
    hasArrowhead(attrs),
  );
};

const polylineElement = (attrs: XmlNode, context: WalkContext) => {
  const points = parsePoints(String(attrs.points ?? ""));
  if (points.length < 2) {
    context.warnings.push({
      code: "invalid-polyline",
      message: "Polyline requires at least two points.",
      node: "polyline",
    });
    return null;
  }
  const first = points[0];
  return connectorElement(
    first[0] + context.transform.x,
    first[1] + context.transform.y,
    points.map(([x, y]) => [x - first[0], y - first[1]]),
    context.style,
    hasArrowhead(attrs),
  );
};

const textElement = (node: XmlNode, attrs: XmlNode, context: WalkContext) => {
  const lines = textLines(node);
  const fontSize = context.style.fontSize ?? 18;
  const lineHeight = 1.25;
  const measuredWidth = estimateTextWidth(lines, fontSize);
  const measuredHeight = Math.max(fontSize * lineHeight, lines.length * fontSize * lineHeight);
  const width = num(attrs.width, measuredWidth);
  const height = num(attrs.height, measuredHeight);
  const anchor = String(attrs["text-anchor"] ?? context.style.textAnchor ?? "start");
  const dominantBaseline = String(
    attrs["dominant-baseline"] ?? context.style.dominantBaseline ?? "",
  );
  const x = num(attrs.x) + context.transform.x;
  const y = num(attrs.y) + context.transform.y;
  const textAlign = anchor === "middle" ? "center" : anchor === "end" ? "right" : "left";
  const textX = textAlign === "center" ? x - width / 2 : textAlign === "right" ? x - width : x;
  const textY = baselineYToBoxY(y, height, fontSize, dominantBaseline);
  return baseElement("text", textX, textY, width, height, context.style, {
    ...customDataFromAttrs(attrs),
    strokeColor: context.style.fill ?? context.style.stroke ?? "#111827",
    backgroundColor: "transparent",
    strokeWidth: 1,
    text: lines.join("\n"),
    originalText: lines.join("\n"),
    fontSize,
    fontFamily: 2,
    textAlign,
    verticalAlign: isMiddleBaseline(dominantBaseline) ? "middle" : "top",
    autoResize: false,
    containerId: null,
    lineHeight,
    baseline: Math.round(fontSize * 0.78),
  });
};

const connectorElement = (
  x: number,
  y: number,
  points: number[][],
  style: Style,
  arrow: boolean,
) =>
  baseElement("arrow", x, y, pointsWidth(points), pointsHeight(points), style, {
    backgroundColor: "transparent",
    points,
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: arrow ? "arrow" : null,
    elbowed: points.length > 2,
    roundness: null,
  });

const baseElement = (
  type: string,
  x: number,
  y: number,
  width: number,
  height: number,
  style: Style,
  extra: Record<string, unknown> = {},
) => {
  seed += 1;
  const customData = extra.customData as Record<string, unknown> | undefined;
  const role = typeof customData?.role === "string" ? customData.role : null;
  const idPrefix = role === "shadow" || role === "decoration" ? `svg-${role}` : "svg";
  return {
    id: `${idPrefix}-${seed}`,
    type,
    x: finite(x),
    y: finite(y),
    width: finite(width),
    height: finite(height),
    angle: 0,
    opacity: Math.round((style.opacity ?? 1) * 100),
    groupIds: [],
    frameId: null,
    seed,
    version: 1,
    versionNonce: seed + 1,
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    strokeColor: style.stroke ?? "#111827",
    backgroundColor: normalizeFill(style.fill),
    fillStyle: "solid",
    strokeWidth: style.strokeWidth ?? 2,
    strokeStyle: "solid",
    roughness: 0,
    roundness: null,
    ...extra,
  };
};

const findFirstElement = (nodes: XmlNode[], tag: string): XmlNode | null => {
  for (const node of nodes) {
    if (tagOf(node) === tag) return node;
    const found = findFirstElement(childrenOf(node), tag);
    if (found) return found;
  }
  return null;
};

const tagOf = (node: XmlNode) => {
  const keys = Object.keys(node).filter((key) => key !== ":@" && key !== "#text");
  return keys[0] ?? null;
};

const attrsOf = (node: XmlNode): XmlNode => {
  const attrs = node[":@"];
  return attrs && typeof attrs === "object" ? (attrs as XmlNode) : {};
};

const childrenOf = (node: XmlNode): XmlNode[] => {
  const tag = tagOf(node);
  if (!tag) return [];
  const value = node[tag];
  return Array.isArray(value) ? (value as XmlNode[]) : [];
};

const titleFromSvg = (node: XmlNode) => {
  for (const child of childrenOf(node)) {
    if (tagOf(child) === "title") {
      return textContent(child).trim() || null;
    }
  }
  return null;
};

const textLines = (node: XmlNode) => {
  const lines: string[] = [];
  const rawText = directText(node).trim();
  if (rawText) lines.push(rawText);
  for (const child of childrenOf(node)) {
    if (tagOf(child) === "tspan") {
      const line = textContent(child).trim();
      if (line) lines.push(line);
    }
  }
  return lines.length > 0 ? lines : [""];
};

const textContent = (node: XmlNode): string =>
  [directText(node), ...childrenOf(node).map(textContent)].join("");

const directText = (node: XmlNode): string => {
  const tag = tagOf(node);
  if (!tag) return "";
  const value = node[tag];
  if (!Array.isArray(value)) return "";
  return value
    .filter((child): child is XmlNode => Boolean(child && typeof child === "object"))
    .map((child) => (typeof child["#text"] === "string" ? child["#text"] : ""))
    .join("");
};

const styleFrom = (attrs: XmlNode, parent: Style): Style => {
  const inline = parseStyle(attrs.style);
  return {
    ...parent,
    fill: colorValue(inline.fill) ?? colorValue(attrs.fill) ?? parent.fill,
    stroke: colorValue(inline.stroke) ?? colorValue(attrs.stroke) ?? parent.stroke,
    strokeWidth: num(inline["stroke-width"] ?? attrs["stroke-width"], parent.strokeWidth),
    opacity: num(inline.opacity ?? attrs.opacity, parent.opacity ?? 1),
    fontSize: num(inline["font-size"] ?? attrs["font-size"], parent.fontSize),
    fontWeight: stringValue(inline["font-weight"] ?? attrs["font-weight"]) ?? parent.fontWeight,
    textAnchor: stringValue(inline["text-anchor"] ?? attrs["text-anchor"]) ?? parent.textAnchor,
    dominantBaseline:
      stringValue(inline["dominant-baseline"] ?? attrs["dominant-baseline"]) ??
      parent.dominantBaseline,
  };
};

const parseStyle = (style: unknown): Record<string, string> => {
  if (typeof style !== "string") return {};
  return Object.fromEntries(
    style
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split(":");
        return [key.trim(), rest.join(":").trim()];
      }),
  );
};

const parseTranslate = (value: unknown): Transform => {
  if (typeof value !== "string") return { x: 0, y: 0 };
  const match = value.match(/translate\(([-+\d.]+)(?:[\s,]+([-+\d.]+))?\)/);
  if (!match) return { x: 0, y: 0 };
  return { x: Number(match[1]) || 0, y: Number(match[2]) || 0 };
};

const combineTransform = (left: Transform, right: Transform): Transform => ({
  x: left.x + right.x,
  y: left.y + right.y,
});

const parsePoints = (points: string) =>
  points
    .trim()
    .split(/\s+/)
    .map((point) => point.split(",").map(Number))
    .filter((point): point is [number, number] => point.length >= 2 && point.every(Number.isFinite));

const hasArrowhead = (attrs: XmlNode) =>
  typeof attrs["marker-end"] === "string" || typeof attrs["marker-start"] === "string";

const customDataFromAttrs = (attrs: XmlNode) => {
  const role = stringValue(attrs["data-agentdraw-role"]);
  if (!role || !["shadow", "decoration", "frame"].includes(role)) {
    return {};
  }
  return { customData: { role } };
};

const pointsWidth = (points: number[][]) => {
  const xs = points.map((point) => point[0]);
  return Math.max(...xs) - Math.min(...xs);
};

const pointsHeight = (points: number[][]) => {
  const ys = points.map((point) => point[1]);
  return Math.max(...ys) - Math.min(...ys);
};

const baselineYToBoxY = (
  y: number,
  height: number,
  fontSize: number,
  dominantBaseline: string,
) => {
  if (isMiddleBaseline(dominantBaseline)) {
    return y - height / 2;
  }
  if (dominantBaseline === "hanging" || dominantBaseline === "text-before-edge") {
    return y;
  }
  return y - fontSize * 0.78;
};

const isMiddleBaseline = (dominantBaseline: string) =>
  ["middle", "central", "mathematical"].includes(dominantBaseline);

const estimateTextWidth = (lines: string[], fontSize: number) =>
  Math.max(1, ...lines.map((line) => Math.ceil(estimateLineWidth(line, fontSize) + 16)));

const estimateLineWidth = (line: string, fontSize: number) => {
  let units = 0;
  for (const char of line) {
    units += char.charCodeAt(0) > 255 ? 1 : asciiCharWidth(char);
  }
  return units * fontSize;
};

const asciiCharWidth = (char: string) => {
  if (char === " ") return 0.33;
  if (/[ilI.,:;|!]/.test(char)) return 0.32;
  if (/[mwMW@#%&]/.test(char)) return 0.88;
  if (/[A-Z0-9]/.test(char)) return 0.62;
  return 0.54;
};

const normalizeFill = (value: string | undefined) =>
  !value || value === "none" ? "transparent" : value;

const colorValue = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  if (!value || value === "currentColor") return undefined;
  return value;
};

const stringValue = (value: unknown) => (typeof value === "string" ? value : undefined);

const num = (value: unknown, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const finite = (value: number) => (Number.isFinite(value) ? value : 0);
