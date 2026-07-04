import type { AgentDrawStyle } from "@agentdraw/styles";

export type BoardSnapshot = {
  providerId?: string;
  elements: readonly unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type BoardHandle = {
  getSnapshot: () => BoardSnapshot;
  setStyleDefaults: (style: AgentDrawStyle) => BoardSnapshot | null;
  applyStyleToBoard: (style: AgentDrawStyle) => BoardSnapshot | null;
  exportPng: (title: string) => Promise<void>;
  exportSvg: (title: string) => Promise<void>;
};

export type BoardProviderProps = {
  scene: BoardSnapshot;
  style: AgentDrawStyle;
  onChange: (snapshot: BoardSnapshot) => void;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
