import type { SceneEnvelope, SceneSnapshot } from "./types";

const apiBase = import.meta.env.VITE_AGENTDRAW_API_BASE ?? "";

export const loadScene = async (filePath: string): Promise<SceneEnvelope> => {
  const response = await fetch(`${apiBase}/api/scene?file=${encodeURIComponent(filePath)}`);
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<SceneEnvelope>;
};

export const saveScene = async (
  filePath: string,
  scene: SceneSnapshot,
): Promise<SceneEnvelope> => {
  const response = await fetch(`${apiBase}/api/scene`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ filePath, scene }),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<SceneEnvelope>;
};

const readError = async (response: Response) => {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
};
