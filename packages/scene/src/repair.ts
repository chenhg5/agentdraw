import type { AgentDrawScene } from "./index.js";

export type SceneRepairOptions = {
  fontFamily?: number;
  connectorColor?: string;
  connectorStrokeWidth?: number;
  containerPadding?: number;
};

export type SceneRepairChange = {
  elementId: string;
  code: string;
  message: string;
};

type ElementRecord = Record<string, unknown> & {
  id?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  autoResize?: boolean;
  containerId?: string | null;
  boundElements?: unknown;
  strokeColor?: string;
  strokeWidth?: number;
  points?: unknown;
};

type Bounds = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const SHAPE_TYPES = new Set(["rectangle", "diamond", "ellipse"]);
const CONNECTOR_TYPES = new Set(["arrow", "line"]);

export const repairScene = (
  scene: AgentDrawScene,
  options: SceneRepairOptions = {},
): { scene: AgentDrawScene; changes: SceneRepairChange[] } => {
  const changes: SceneRepairChange[] = [];
  const fontFamily = options.fontFamily ?? 2;
  const connectorColor = options.connectorColor;
  const connectorStrokeWidth = options.connectorStrokeWidth ?? 2;
  const elements = scene.elements.map((element) =>
    isElementRecord(element) ? { ...element } : element,
  );
  const elementById = new Map(
    elements
      .filter(isElementRecord)
      .filter((element) => typeof element.id === "string")
      .map((element) => [element.id!, element]),
  );

  for (const element of elements.filter(isElementRecord)) {
    if (element.type === "text") {
      repairTextElement(element, elementById, fontFamily, options.containerPadding, changes);
    }
    if (CONNECTOR_TYPES.has(element.type ?? "")) {
      repairConnectorElement(element, connectorColor, connectorStrokeWidth, changes);
    }
  }

  return {
    scene: {
      ...scene,
      appState: {
        ...scene.appState,
        currentItemFontFamily: fontFamily,
      },
      elements,
    },
    changes,
  };
};

const repairTextElement = (
  element: ElementRecord,
  elementById: Map<string, ElementRecord>,
  fontFamily: number,
  containerPadding: number | undefined,
  changes: SceneRepairChange[],
) => {
  const id = element.id ?? "(unknown)";
  if (element.fontFamily !== fontFamily) {
    element.fontFamily = fontFamily;
    changes.push({
      elementId: id,
      code: "text-font-family",
      message: `Set text fontFamily to ${fontFamily}.`,
    });
  }

  if (typeof element.text === "string" && element.originalText !== element.text) {
    element.originalText = element.text;
    changes.push({
      elementId: id,
      code: "text-original-text",
      message: "Set originalText to match text.",
    });
  }

  if (typeof element.lineHeight !== "number" || element.lineHeight < 1.15) {
    element.lineHeight = 1.25;
    changes.push({
      elementId: id,
      code: "text-line-height",
      message: "Set lineHeight to 1.25.",
    });
  }

  const container = textContainer(element, elementById);
  if (!container) {
    return;
  }

  const padding = containerPadding ?? defaultContainerPadding(container);
  const next = {
    x: container.x + padding,
    y: container.y + padding,
    width: Math.max(1, container.width - padding * 2),
    height: Math.max(1, container.height - padding * 2),
  };
  let moved = false;
  for (const key of ["x", "y", "width", "height"] as const) {
    if (typeof element[key] !== "number" || Math.abs(element[key]! - next[key]) > 0.5) {
      element[key] = next[key];
      moved = true;
    }
  }
  if (moved) {
    changes.push({
      elementId: id,
      code: "text-container-padding",
      message: `Inset text box inside container by ${padding}px.`,
    });
  }

  if (element.textAlign !== "center") {
    element.textAlign = "center";
    changes.push({
      elementId: id,
      code: "text-align-center",
      message: "Set textAlign to center for contained label.",
    });
  }
  if (element.verticalAlign !== "middle") {
    element.verticalAlign = "middle";
    changes.push({
      elementId: id,
      code: "text-vertical-middle",
      message: "Set verticalAlign to middle for contained label.",
    });
  }
  if (element.autoResize !== false) {
    element.autoResize = false;
    changes.push({
      elementId: id,
      code: "text-fixed-box",
      message: "Set autoResize to false so vertical centering uses the container-sized text box.",
    });
  }

  const baseline = centeredBaseline(element);
  if (baseline !== null && element.baseline !== baseline) {
    element.baseline = baseline;
    changes.push({
      elementId: id,
      code: "text-baseline",
      message: `Set baseline to ${baseline}.`,
    });
  }
};

const repairConnectorElement = (
  element: ElementRecord,
  connectorColor: string | undefined,
  connectorStrokeWidth: number,
  changes: SceneRepairChange[],
) => {
  const id = element.id ?? "(unknown)";
  if (connectorColor && element.strokeColor !== connectorColor) {
    element.strokeColor = connectorColor;
    changes.push({
      elementId: id,
      code: "connector-color",
      message: `Set connector strokeColor to ${connectorColor}.`,
    });
  }
  if (typeof element.strokeWidth !== "number" || element.strokeWidth < connectorStrokeWidth) {
    element.strokeWidth = connectorStrokeWidth;
    changes.push({
      elementId: id,
      code: "connector-stroke-width",
      message: `Set connector strokeWidth to ${connectorStrokeWidth}.`,
    });
  }
  if (element.type === "arrow" && !element.endArrowhead) {
    element.endArrowhead = "arrow";
    changes.push({
      elementId: id,
      code: "connector-arrowhead",
      message: "Set arrow endArrowhead to arrow.",
    });
  }
};

const textContainer = (
  text: ElementRecord,
  elementById: Map<string, ElementRecord>,
) => {
  if (typeof text.containerId === "string") {
    const container = toBounds(elementById.get(text.containerId));
    if (container) {
      return container;
    }
  }
  for (const element of elementById.values()) {
    if (!SHAPE_TYPES.has(element.type ?? "") || !Array.isArray(element.boundElements)) {
      continue;
    }
    const hasBoundText = element.boundElements.some((bound) =>
      Boolean(
        bound &&
          typeof bound === "object" &&
          (bound as { id?: unknown; type?: unknown }).id === text.id &&
          (bound as { type?: unknown }).type === "text",
      ),
    );
    if (hasBoundText) {
      return toBounds(element);
    }
  }
  return null;
};

const defaultContainerPadding = (container: Bounds) =>
  Math.max(8, Math.min(20, Math.round(Math.min(container.width, container.height) * 0.16)));

const centeredBaseline = (element: ElementRecord) => {
  if (
    typeof element.height !== "number" ||
    typeof element.fontSize !== "number" ||
    typeof element.text !== "string"
  ) {
    return null;
  }
  const lineHeight = typeof element.lineHeight === "number" ? element.lineHeight : 1.25;
  const lineCount = element.text.split("\n").length;
  return Math.round((element.height - lineCount * element.fontSize * lineHeight) / 2 + element.fontSize);
};

const toBounds = (element: ElementRecord | undefined): Bounds | null => {
  if (
    !element ||
    typeof element.id !== "string" ||
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
    x,
    y,
    width: Math.abs(element.width),
    height: Math.abs(element.height),
  };
};

const isElementRecord = (element: unknown): element is ElementRecord =>
  Boolean(element && typeof element === "object" && !(element as { isDeleted?: unknown }).isDeleted);
