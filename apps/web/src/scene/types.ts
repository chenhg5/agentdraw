export type AgentDrawScene = {
  type: "agentdraw/scene";
  version: 1;
  id: string;
  title: string;
  styleId?: string;
  providerId?: string;
  updatedAt: string;
  elements: readonly unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type SceneEnvelope = {
  filePath: string;
  scene: AgentDrawScene;
};

export type SceneSnapshot = {
  title?: string;
  styleId?: string;
  providerId?: string;
  elements: readonly unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type SaveSceneOptions = {
  force?: boolean;
};

export type SceneChangeOptions = {
  replace?: boolean;
  filePath?: string;
  title?: string;
  updateUrl?: boolean;
};

export type SaveState = "idle" | "saving" | "saved" | "error";
