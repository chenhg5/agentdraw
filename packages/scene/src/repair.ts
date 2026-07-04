import type { AgentDrawScene } from "./index.js";

export type SceneRepairOptions = {
  fontFamily?: number;
  connectorColor?: string;
  connectorStrokeWidth?: number;
  containerPadding?: number;
  addOuterFrame?: boolean;
  frameColor?: string;
  maxCornerRadiusPx?: number;
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
  customData?: Record<string, unknown>;
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
  const frameColor = options.frameColor ?? connectorColor ?? "#CBD5E1";
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
    if (isFrameLikeElement(element)) {
      repairFrameElement(element, frameColor, changes);
    } else if (shouldRepairSharpRectangle(element, options.maxCornerRadiusPx)) {
      repairSharpRectangle(element, options.maxCornerRadiusPx ?? 0, changes);
    }
  }

  if (options.addOuterFrame) {
    addOuterFrame(elements, frameColor, changes);
    removeRedundantSystemFrames(elements, changes);
  }

  touchChangedElements(elements, changes);

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

const touchChangedElements = (
  elements: unknown[],
  changes: SceneRepairChange[],
) => {
  const changedIds = new Set(
    changes
      .map((change) => change.elementId)
      .filter((id) => id && id !== "(unknown)"),
  );
  if (changedIds.size === 0) {
    return;
  }
  const updated = Date.now();
  for (const element of elements.filter(isElementRecord)) {
    if (!element.id || !changedIds.has(element.id)) {
      continue;
    }
    element.version = typeof element.version === "number" ? element.version + 1 : 1;
    element.versionNonce = Math.floor(Math.random() * 2 ** 31);
    element.updated = updated;
  }
};

const repairFrameElement = (
  element: ElementRecord,
  frameColor: string,
  changes: SceneRepairChange[],
) => {
  const id = element.id ?? "(unknown)";
  if (element.roundness !== null) {
    element.roundness = null;
    changes.push({
      elementId: id,
      code: "frame-square-corners",
      message: "Set outer frame roundness to null for square formal framing.",
    });
  }
  if (element.backgroundColor !== "transparent") {
    element.backgroundColor = "transparent";
    changes.push({
      elementId: id,
      code: "frame-transparent-fill",
      message: "Set outer frame backgroundColor to transparent.",
    });
  }
  if (element.strokeColor !== frameColor && typeof element.strokeColor !== "string") {
    element.strokeColor = frameColor;
    changes.push({
      elementId: id,
      code: "frame-stroke-color",
      message: `Set outer frame strokeColor to ${frameColor}.`,
    });
  }
};

const shouldRepairSharpRectangle = (
  element: ElementRecord,
  maxCornerRadiusPx: number | undefined,
) =>
  element.type === "rectangle" &&
  typeof maxCornerRadiusPx === "number" &&
  maxCornerRadiusPx <= 6 &&
  element.roundness !== null;

const repairSharpRectangle = (
  element: ElementRecord,
  maxCornerRadiusPx: number,
  changes: SceneRepairChange[],
) => {
  const id = element.id ?? "(unknown)";
  element.roundness = null;
  changes.push({
    elementId: id,
    code: "rectangle-square-corners",
    message: `Set rectangle roundness to null to match the formal corner radius contract 0-${maxCornerRadiusPx}px.`,
  });
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

const addOuterFrame = (
  elements: unknown[],
  frameColor: string,
  changes: SceneRepairChange[],
) => {
  const drawableBounds = elements
    .filter(isElementRecord)
    .filter((element) => !CONNECTOR_TYPES.has(element.type ?? ""))
    .filter((element) => !isExplicitFrameElement(element))
    .map(toBounds)
    .filter((bounds): bounds is Bounds => Boolean(bounds));
  if (drawableBounds.length < 4 || hasOuterFrame(elements, drawableBounds)) {
    return;
  }

  const x = Math.min(...drawableBounds.map((bounds) => bounds.x));
  const y = Math.min(...drawableBounds.map((bounds) => bounds.y));
  const right = Math.max(...drawableBounds.map((bounds) => bounds.x + bounds.width));
  const bottom = Math.max(...drawableBounds.map((bounds) => bounds.y + bounds.height));
  const padding = 32;
  const frame = {
    id: "agentdraw-system-frame",
    type: "rectangle",
    x: x - padding,
    y: y - padding,
    width: right - x + padding * 2,
    height: bottom - y + padding * 2,
    angle: 0,
    strokeColor: frameColor,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    roughness: 0,
    opacity: 100,
    groupIds: [],
    boundElements: null,
    roundness: null,
    seed: 1,
    version: 1,
    versionNonce: 1,
    isDeleted: false,
    updated: Date.now(),
    link: null,
    locked: false,
    customData: { role: "frame" },
  };
  elements.unshift(frame);
  changes.push({
    elementId: frame.id,
    code: "outer-frame",
    message: "Added a low-contrast outer frame for the formal diagram.",
  });
};

const hasOuterFrame = (elements: unknown[], drawableBounds: Bounds[]) => {
  const x = Math.min(...drawableBounds.map((bounds) => bounds.x));
  const y = Math.min(...drawableBounds.map((bounds) => bounds.y));
  const right = Math.max(...drawableBounds.map((bounds) => bounds.x + bounds.width));
  const bottom = Math.max(...drawableBounds.map((bounds) => bounds.y + bounds.height));
  return elements
    .filter(isElementRecord)
    .filter((element) => SHAPE_TYPES.has(element.type ?? ""))
    .some((element) => {
      const bounds = toBounds(element);
      return Boolean(
        bounds &&
          bounds.x <= x - 12 &&
          bounds.y <= y - 12 &&
          bounds.x + bounds.width >= right + 12 &&
          bounds.y + bounds.height >= bottom + 12,
      );
    });
};

const removeRedundantSystemFrames = (
  elements: unknown[],
  changes: SceneRepairChange[],
) => {
  const records = elements.filter(isElementRecord);
  const contentBounds = records
    .filter((element) => !CONNECTOR_TYPES.has(element.type ?? ""))
    .filter((element) => !isExplicitFrameElement(element))
    .map(toBounds)
    .filter((bounds): bounds is Bounds => Boolean(bounds));
  if (contentBounds.length < 4) {
    return;
  }
  const userFrameExists = records
    .filter((element) => element.id !== "agentdraw-system-frame")
    .filter(isExplicitFrameElement)
    .some((element) => coversBounds(element, contentBounds, 8));
  if (!userFrameExists) {
    return;
  }
  for (const element of records) {
    if (element.id !== "agentdraw-system-frame" || element.isDeleted === true) {
      continue;
    }
    element.isDeleted = true;
    changes.push({
      elementId: element.id,
      code: "redundant-system-frame",
      message: "Removed redundant system outer frame because the scene already has an explicit outer frame.",
    });
  }
};

const coversBounds = (element: ElementRecord, boundsList: Bounds[], padding: number) => {
  const bounds = toBounds(element);
  if (!bounds) {
    return false;
  }
  const x = Math.min(...boundsList.map((item) => item.x));
  const y = Math.min(...boundsList.map((item) => item.y));
  const right = Math.max(...boundsList.map((item) => item.x + item.width));
  const bottom = Math.max(...boundsList.map((item) => item.y + item.height));
  return (
    bounds.x <= x - padding &&
    bounds.y <= y - padding &&
    bounds.x + bounds.width >= right + padding &&
    bounds.y + bounds.height >= bottom + padding
  );
};

const isExplicitFrameElement = (element: ElementRecord) => {
  if (element.customData?.role === "frame") {
    return true;
  }
  const id = String(element.id ?? "").toLowerCase();
  return id.includes("frame") || id.includes("boundary");
};

const isFrameLikeElement = (element: ElementRecord) => {
  if (element.type !== "rectangle") {
    return false;
  }
  if (isExplicitFrameElement(element)) {
    return true;
  }
  const width = typeof element.width === "number" ? Math.abs(element.width) : 0;
  const height = typeof element.height === "number" ? Math.abs(element.height) : 0;
  return width >= 700 && height >= 350 && element.backgroundColor === "transparent";
};

const isElementRecord = (element: unknown): element is ElementRecord =>
  Boolean(element && typeof element === "object" && !(element as { isDeleted?: unknown }).isDeleted);
