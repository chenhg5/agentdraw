import type { SaveSceneOptions, SceneEnvelope, SceneSnapshot } from "./types";

const apiBase = import.meta.env.VITE_AGENTDRAW_API_BASE ?? "";

export const loadScene = async (filePath: string): Promise<SceneEnvelope> => {
  const response = await fetch(`${apiBase}/api/scene?file=${encodeURIComponent(filePath)}`);
  if (!response.ok) {
    throw await readApiError(response);
  }
  return response.json() as Promise<SceneEnvelope>;
};

export const saveScene = async (
  filePath: string,
  scene: SceneSnapshot,
  baseUpdatedAt?: string,
  options: SaveSceneOptions = {},
): Promise<SceneEnvelope> => {
  const response = await fetch(`${apiBase}/api/scene`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ filePath, scene, baseUpdatedAt, force: options.force === true }),
  });
  if (!response.ok) {
    throw await readApiError(response);
  }
  return response.json() as Promise<SceneEnvelope>;
};

export class SceneApiError extends Error {
  readonly status: number;
  readonly currentUpdatedAt?: string;

  constructor(message: string, status: number, currentUpdatedAt?: string) {
    super(message);
    this.name = "SceneApiError";
    this.status = status;
    this.currentUpdatedAt = currentUpdatedAt;
  }
}

const readApiError = async (response: Response) => {
  try {
    const body = (await response.json()) as { error?: string; currentUpdatedAt?: string };
    return new SceneApiError(
      body.error ?? response.statusText,
      response.status,
      body.currentUpdatedAt,
    );
  } catch {
    return new SceneApiError(response.statusText, response.status);
  }
};
