import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export { repairScene, type SceneRepairChange, type SceneRepairOptions } from "./repair.js";
export {
  importSvgToAgentDrawScene,
  type SvgImportResult,
  type SvgImportWarning,
} from "./svg-import.js";
export { validateScene, type SceneValidationIssue, type SceneValidationResult } from "./validate.js";

export type AgentDrawScene = {
  type: "agentdraw/scene";
  version: 1;
  id: string;
  title: string;
  styleId?: string;
  providerId?: string;
  updatedAt: string;
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type SceneSnapshot = Pick<
  AgentDrawScene,
  "elements" | "appState" | "files"
> & {
  styleId?: string;
  providerId?: string;
};

export const createEmptyScene = (title = "Untitled board"): AgentDrawScene => ({
  type: "agentdraw/scene",
  version: 1,
  id: randomUUID(),
  title,
  styleId: "cut-bloom",
  providerId: "excalidraw",
  updatedAt: new Date().toISOString(),
  elements: [],
  appState: {
    viewBackgroundColor: "#ffffff",
    currentItemFontFamily: 2,
  },
  files: {},
});

export const normalizeScenePath = (inputPath: string, cwd = process.cwd()) => {
  const trimmed = inputPath.trim();
  if (!trimmed) {
    throw new Error("Scene file path is required.");
  }
  return path.resolve(cwd, trimmed);
};

export const readSceneFile = async (filePath: string): Promise<AgentDrawScene> => {
  const raw = await readFile(filePath, "utf8");
  const parsed = parseSceneJson(raw) as Partial<AgentDrawScene>;
  return coerceScene(parsed, path.basename(filePath, path.extname(filePath)));
};

export const writeSceneFile = async (
  filePath: string,
  scene: AgentDrawScene,
): Promise<AgentDrawScene> => {
  const nextScene: AgentDrawScene = {
    ...scene,
    updatedAt: new Date().toISOString(),
  };
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(nextScene, null, 2)}\n`, "utf8");
  await rename(tempPath, filePath);
  return nextScene;
};

export const readOrCreateSceneFile = async (
  filePath: string,
): Promise<AgentDrawScene> => {
  try {
    return await readSceneFile(filePath);
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw error;
    }
    const scene = createEmptyScene(path.basename(filePath, path.extname(filePath)));
    return writeSceneFile(filePath, scene);
  }
};

export const mergeSceneSnapshot = (
  current: AgentDrawScene,
  snapshot: SceneSnapshot,
): AgentDrawScene => ({
  ...current,
  styleId: typeof snapshot.styleId === "string" ? snapshot.styleId : current.styleId,
  providerId:
    typeof snapshot.providerId === "string" ? snapshot.providerId : current.providerId,
  elements: Array.isArray(snapshot.elements) ? snapshot.elements : [],
  appState: snapshot.appState && typeof snapshot.appState === "object" ? snapshot.appState : {},
  files: snapshot.files && typeof snapshot.files === "object" ? snapshot.files : {},
  updatedAt: new Date().toISOString(),
});

const coerceScene = (
  input: Partial<AgentDrawScene>,
  fallbackTitle: string,
): AgentDrawScene => {
  const nestedScene =
    "scene" in input && input.scene && typeof input.scene === "object"
      ? (input.scene as Partial<AgentDrawScene>)
      : {};
  return {
    type: "agentdraw/scene",
    version: 1,
    id: typeof input.id === "string" ? input.id : randomUUID(),
    title: typeof input.title === "string" ? input.title : fallbackTitle,
    styleId:
      typeof input.styleId === "string"
        ? input.styleId
        : typeof nestedScene.styleId === "string"
          ? nestedScene.styleId
          : "cut-bloom",
    providerId:
      typeof input.providerId === "string"
        ? input.providerId
        : typeof nestedScene.providerId === "string"
          ? nestedScene.providerId
          : "excalidraw",
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date().toISOString(),
    elements: Array.isArray(input.elements)
      ? input.elements
      : Array.isArray(nestedScene.elements)
        ? nestedScene.elements
        : [],
    appState:
      input.appState && typeof input.appState === "object"
        ? input.appState
        : nestedScene.appState && typeof nestedScene.appState === "object"
          ? nestedScene.appState
          : {},
    files:
      input.files && typeof input.files === "object"
        ? input.files
        : nestedScene.files && typeof nestedScene.files === "object"
          ? nestedScene.files
          : {},
  };
};

const isMissingFileError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "ENOENT";

const parseSceneJson = (raw: string) => {
  try {
    return JSON.parse(raw);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    const prefix = findFirstJsonValue(raw);
    if (!prefix) {
      throw error;
    }
    return JSON.parse(prefix);
  }
};

const findFirstJsonValue = (raw: string) => {
  let depth = 0;
  let inString = false;
  let escaped = false;
  let started = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];

    if (!started) {
      if (/\s/.test(char)) {
        continue;
      }
      if (char !== "{") {
        return null;
      }
      started = true;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
      continue;
    }
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(0, index + 1);
      }
    }
  }

  return null;
};
