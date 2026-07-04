import type { AgentDrawScene } from "./index.js";

export type SceneValidationSeverity = "error" | "warning";

export type SceneValidationIssue = {
  severity: SceneValidationSeverity;
  code: string;
  message: string;
  elementIds: string[];
};

export type SceneValidationResult = {
  issues: SceneValidationIssue[];
  errorCount: number;
  warningCount: number;
};

type ElementRecord = Record<string, unknown> & {
  id?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: unknown;
  isDeleted?: boolean;
  text?: string;
  fontSize?: number;
  lineHeight?: number;
};

type Bounds = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

const SHAPE_TYPES = new Set(["rectangle", "diamond", "ellipse"]);
const CONNECTOR_TYPES = new Set(["arrow", "line"]);

export const validateScene = (scene: AgentDrawScene): SceneValidationResult => {
  const elements = scene.elements.filter(isDrawableElement);
  const bounds = elements.map(toBounds).filter((bound): bound is Bounds => Boolean(bound));
  const textBounds = bounds.filter((bound) => bound.type === "text");
  const shapeBounds = bounds.filter((bound) => SHAPE_TYPES.has(bound.type));
  const textElements = elements.filter((element) => element.type === "text");
  const connectorElements = elements.filter((element) => CONNECTOR_TYPES.has(element.type ?? ""));
  const issues: SceneValidationIssue[] = [];

  issues.push(...findTextOverflowIssues(textElements, shapeBounds));
  issues.push(...findTextOverlaps(textBounds));
  issues.push(...findShapeOverlaps(shapeBounds));
  issues.push(...findVerticalCenteringIssues(shapeBounds, textBounds));
  issues.push(...findConnectorIssues(connectorElements, shapeBounds, textBounds));

  return {
    issues,
    errorCount: issues.filter((issue) => issue.severity === "error").length,
    warningCount: issues.filter((issue) => issue.severity === "warning").length,
  };
};

const findTextOverflowIssues = (
  texts: ElementRecord[],
  shapes: Bounds[],
): SceneValidationIssue[] => {
  const issues: SceneValidationIssue[] = [];

  for (const text of texts) {
    const bounds = toBounds(text);
    if (!bounds || !text.text) {
      continue;
    }
    const measured = estimateTextSize(text);
    const horizontalOverflow = measured.width - bounds.width;
    const verticalOverflow = measured.height - bounds.height;

    if (horizontalOverflow > 8 || verticalOverflow > 8) {
      issues.push({
        severity: "error",
        code: "text-box-overflow",
        message: `Text content exceeds its text box by ${Math.max(0, Math.round(horizontalOverflow))}px horizontally and ${Math.max(0, Math.round(verticalOverflow))}px vertically.`,
        elementIds: [bounds.id],
      });
    }

    const container = nearestContainingShape(bounds, shapes);
    if (!container) {
      continue;
    }

    if (container.height > 240) {
      continue;
    }

    const padding = Math.max(4, Math.min(12, container.height * 0.12));
    const available = {
      ...container,
      x: container.x + padding,
      y: container.y + padding,
      width: Math.max(0, container.width - padding * 2),
      height: Math.max(0, container.height - padding * 2),
    };
    const rendered = {
      ...bounds,
      width: Math.max(bounds.width, measured.width),
      height: Math.max(bounds.height, measured.height),
    };

    if (!contains(padded(available, 6), rendered)) {
      issues.push({
        severity: "error",
        code: "text-container-overflow",
        message: "Text content does not fit inside its containing shape.",
        elementIds: [container.id, bounds.id],
      });
    }
  }

  return issues;
};

const findTextOverlaps = (texts: Bounds[]): SceneValidationIssue[] => {
  const issues: SceneValidationIssue[] = [];
  for (let index = 0; index < texts.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < texts.length; nextIndex += 1) {
      const first = padded(texts[index], 2);
      const second = padded(texts[nextIndex], 2);
      const area = intersectionArea(first, second);
      if (area > 8) {
        issues.push({
          severity: "error",
          code: "text-overlap",
          message: `Text elements overlap by ${Math.round(area)}px².`,
          elementIds: [texts[index].id, texts[nextIndex].id],
        });
      }
    }
  }
  return issues;
};

const findShapeOverlaps = (shapes: Bounds[]): SceneValidationIssue[] => {
  const issues: SceneValidationIssue[] = [];
  for (let index = 0; index < shapes.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < shapes.length; nextIndex += 1) {
      const first = shapes[index];
      const second = shapes[nextIndex];
      if (contains(first, second) || contains(second, first)) {
        continue;
      }
      const area = intersectionArea(first, second);
      if (area > 64) {
        issues.push({
          severity: "error",
          code: "shape-overlap",
          message: `Shape elements overlap by ${Math.round(area)}px².`,
          elementIds: [first.id, second.id],
        });
      }
    }
  }
  return issues;
};

const findVerticalCenteringIssues = (
  shapes: Bounds[],
  texts: Bounds[],
): SceneValidationIssue[] => {
  const issues: SceneValidationIssue[] = [];

  for (const shape of shapes) {
    if (shape.height > 180 || shape.width > 1450) {
      continue;
    }
    const containedTexts = texts.filter((text) => contains(padded(shape, 1), text));
    if (containedTexts.length === 0) {
      continue;
    }

    const textUnion = unionBounds(containedTexts);
    const offset = Math.abs(centerY(shape) - centerY(textUnion));
    const tolerance = Math.max(7, Math.min(18, shape.height * 0.18));

    if (offset > tolerance) {
      issues.push({
        severity: "warning",
        code: "vertical-centering",
        message: `Text group is ${Math.round(offset)}px away from the vertical center of its container.`,
        elementIds: [shape.id, ...containedTexts.map((text) => text.id)],
      });
    }
  }

  return issues;
};

const findConnectorIssues = (
  connectors: ElementRecord[],
  shapes: Bounds[],
  texts: Bounds[],
): SceneValidationIssue[] => {
  const issues: SceneValidationIssue[] = [];

  for (const connector of connectors) {
    const points = connectorPoints(connector);
    if (points.length < 2) {
      continue;
    }

    const startDistance = nearestShapeDistance(points[0], shapes);
    const endDistance = nearestShapeDistance(points[points.length - 1], shapes);
    if (startDistance > 36 || endDistance > 36) {
      issues.push({
        severity: "warning",
        code: "connector-endpoint",
        message: `Connector endpoint is far from the nearest shape: start ${Math.round(startDistance)}px, end ${Math.round(endDistance)}px.`,
        elementIds: [connector.id ?? "(unknown)"],
      });
    }

    const crossedText = texts.find((text) =>
      segments(points).some(([start, end]) => segmentIntersectsRect(start, end, padded(text, 4))),
    );
    if (crossedText) {
      issues.push({
        severity: "warning",
        code: "connector-crosses-text",
        message: "Connector crosses a text bounding box.",
        elementIds: [connector.id ?? "(unknown)", crossedText.id],
      });
    }
  }

  return issues;
};

const isDrawableElement = (element: unknown): element is ElementRecord => {
  if (!element || typeof element !== "object") {
    return false;
  }
  const record = element as ElementRecord;
  return Boolean(record.id && record.type && !record.isDeleted);
};

const toBounds = (element: ElementRecord): Bounds | null => {
  if (CONNECTOR_TYPES.has(element.type ?? "")) {
    const points = connectorPoints(element);
    if (points.length === 0) {
      return null;
    }
    return boundsFromPoints(element.id ?? "(unknown)", element.type ?? "connector", points);
  }

  if (
    typeof element.id !== "string" ||
    typeof element.type !== "string" ||
    typeof element.x !== "number" ||
    typeof element.y !== "number" ||
    typeof element.width !== "number" ||
    typeof element.height !== "number"
  ) {
    return null;
  }

  const x = Math.min(element.x, element.x + element.width);
  const y = Math.min(element.y, element.y + element.height);
  return {
    id: element.id,
    type: element.type,
    x,
    y,
    width: Math.abs(element.width),
    height: Math.abs(element.height),
  };
};

const connectorPoints = (element: ElementRecord): Point[] => {
  if (typeof element.x !== "number" || typeof element.y !== "number") {
    return [];
  }
  const baseX = element.x;
  const baseY = element.y;
  if (!Array.isArray(element.points)) {
    return [];
  }
  return element.points
    .filter((point): point is [number, number] =>
      Array.isArray(point) &&
      point.length >= 2 &&
      typeof point[0] === "number" &&
      typeof point[1] === "number",
    )
    .map(([x, y]) => ({
      x: baseX + x,
      y: baseY + y,
    }));
};

const boundsFromPoints = (id: string, type: string, points: Point[]): Bounds => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return {
    id,
    type,
    x,
    y,
    width: Math.max(...xs) - x,
    height: Math.max(...ys) - y,
  };
};

const segments = (points: Point[]): Array<[Point, Point]> =>
  points.slice(1).map((point, index) => [points[index], point]);

const centerY = (bounds: Bounds) => bounds.y + bounds.height / 2;

const unionBounds = (bounds: Bounds[]): Bounds => {
  const x = Math.min(...bounds.map((bound) => bound.x));
  const y = Math.min(...bounds.map((bound) => bound.y));
  const right = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const bottom = Math.max(...bounds.map((bound) => bound.y + bound.height));
  return {
    id: bounds.map((bound) => bound.id).join(","),
    type: "union",
    x,
    y,
    width: right - x,
    height: bottom - y,
  };
};

const estimateTextSize = (element: ElementRecord) => {
  const fontSize = typeof element.fontSize === "number" ? element.fontSize : 16;
  const lineHeight = typeof element.lineHeight === "number" ? element.lineHeight : 1.25;
  const lines = String(element.text ?? "").split("\n");
  const width = Math.max(...lines.map((line) => estimateLineWidth(line, fontSize)), 0);
  return {
    width,
    height: lines.length * fontSize * lineHeight,
  };
};

const estimateLineWidth = (line: string, fontSize: number) => {
  let units = 0;
  for (const char of line) {
    units += char.charCodeAt(0) > 255 ? 1 : asciiCharWidth(char);
  }
  return units * fontSize;
};

const asciiCharWidth = (char: string) => {
  if (char === " ") {
    return 0.33;
  }
  if (/[ilI.,:;|!]/.test(char)) {
    return 0.32;
  }
  if (/[mwMW@#%&]/.test(char)) {
    return 0.88;
  }
  if (/[A-Z0-9]/.test(char)) {
    return 0.62;
  }
  return 0.54;
};

const nearestContainingShape = (text: Bounds, shapes: Bounds[]) => {
  const center = {
    x: text.x + text.width / 2,
    y: text.y + text.height / 2,
  };
  const containing = shapes.filter((shape) => pointInsideRect(center, shape));
  if (containing.length === 0) {
    return null;
  }
  return containing.sort((left, right) => left.width * left.height - right.width * right.height)[0];
};

const padded = (bounds: Bounds, padding: number): Bounds => ({
  ...bounds,
  x: bounds.x - padding,
  y: bounds.y - padding,
  width: bounds.width + padding * 2,
  height: bounds.height + padding * 2,
});

const contains = (outer: Bounds, inner: Bounds) =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;

const intersectionArea = (first: Bounds, second: Bounds) => {
  const width = Math.max(
    0,
    Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x),
  );
  const height = Math.max(
    0,
    Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y),
  );
  return width * height;
};

const nearestShapeDistance = (point: Point, shapes: Bounds[]) =>
  Math.min(...shapes.map((shape) => pointToRectDistance(point, shape)));

const pointToRectDistance = (point: Point, rect: Bounds) => {
  const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.width));
  const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.height));
  return Math.hypot(dx, dy);
};

const segmentIntersectsRect = (start: Point, end: Point, rect: Bounds) => {
  if (
    Math.max(start.x, end.x) < rect.x ||
    Math.min(start.x, end.x) > rect.x + rect.width ||
    Math.max(start.y, end.y) < rect.y ||
    Math.min(start.y, end.y) > rect.y + rect.height
  ) {
    return false;
  }
  if (pointInsideRect(start, rect) || pointInsideRect(end, rect)) {
    return true;
  }
  const corners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];
  return corners.some((corner, index) =>
    segmentsIntersect(start, end, corner, corners[(index + 1) % corners.length]),
  );
};

const pointInsideRect = (point: Point, rect: Bounds) =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

const segmentsIntersect = (a: Point, b: Point, c: Point, d: Point) => {
  const ab = orientation(a, b, c) * orientation(a, b, d);
  const cd = orientation(c, d, a) * orientation(c, d, b);
  return ab <= 0 && cd <= 0;
};

const orientation = (a: Point, b: Point, c: Point) =>
  Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
