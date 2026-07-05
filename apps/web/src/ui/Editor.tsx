import {
  getStyleById,
  styleGroups,
  type AgentDrawStyle,
} from "@agentdraw/styles";
import { Check, Copy, Download, FileJson, Github, Image, Palette, Save, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BoardRenderer } from "../board/BoardRenderer";
import {
  downloadBlob,
  type BoardHandle,
  type BoardReplayProgress,
  type BoardSnapshot,
} from "../board/types";
import type { AgentDrawScene, SaveState } from "../scene/types";

type EditorProps = {
  filePath: string;
  scene: AgentDrawScene;
  saveState: SaveState;
  error: string | null;
  onSceneChange: (
    elements: readonly unknown[],
    appState: Record<string, unknown>,
    files: Record<string, unknown>,
    styleId?: string,
    providerId?: string,
    options?: { replace?: boolean },
  ) => void;
};

export const Editor = ({
  filePath,
  scene,
  saveState,
  error,
  onSceneChange,
}: EditorProps) => {
  const boardRef = useRef<BoardHandle | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState(() => getStyleById(scene.styleId).id);
  const [boardInstanceKey, setBoardInstanceKey] = useState(() => scene.id);
  const [copiedPath, setCopiedPath] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [replayProgress, setReplayProgress] = useState<BoardReplayProgress>({
    active: false,
    current: scene.elements.length,
    total: scene.elements.length,
  });
  const selectedStyle = getStyleById(selectedStyleId);
  const replayStorageKey = useMemo(() => replaySessionStorageKey(filePath), [filePath]);
  const [replayEnabled, setReplayEnabled] = useState(() => readReplayEnabledFromUrl(filePath));
  const replayOptions = useMemo(
    () => ({
      enabled: replayEnabled,
      onProgress: setReplayProgress,
    }),
    [replayEnabled],
  );

  useEffect(() => {
    setSelectedStyleId(getStyleById(scene.styleId).id);
    setBoardInstanceKey(scene.id);
  }, [scene.id, scene.styleId]);

  useEffect(() => {
    setReplayEnabled(readReplayEnabledFromUrl(filePath));
    setReplayProgress({
      active: false,
      current: scene.elements.length,
      total: scene.elements.length,
    });
  }, [filePath]);

  useEffect(() => {
    if (
      replayEnabled &&
      replayProgress.total > 0 &&
      !replayProgress.active &&
      replayProgress.current >= replayProgress.total
    ) {
      window.sessionStorage.setItem(replayStorageKey, "1");
      setReplayEnabled(false);
    }
  }, [replayEnabled, replayProgress, replayStorageKey]);

  const sceneSnapshot: BoardSnapshot = {
    providerId: scene.providerId,
    elements: scene.elements,
    appState: scene.appState,
    files: scene.files,
  };

  const saveSnapshot = (snapshot: BoardSnapshot, styleId = selectedStyleId) => {
    onSceneChange(
      snapshot.elements,
      snapshot.appState,
      snapshot.files,
      styleId,
      snapshot.providerId ?? scene.providerId,
    );
  };

  const exportJson = () => {
    const snapshot = boardRef.current?.getSnapshot() ?? sceneSnapshot;
    const payload = {
      ...scene,
      styleId: selectedStyleId,
      providerId: scene.providerId,
      elements: snapshot.elements,
      appState: snapshot.appState,
      files: snapshot.files,
      updatedAt: new Date().toISOString(),
    };
    downloadBlob(
      new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
        type: "application/json",
      }),
      `${scene.title}.agentdraw.json`,
    );
  };

  const selectStyle = (styleId: string) => {
    const style = getStyleById(styleId);
    setSelectedStyleId(style.id);
    const snapshot = boardRef.current?.applyStyleToBoard(style);
    if (snapshot) {
      saveSnapshot(snapshot, style.id);
    }
  };

  const paintScene = () => {
    const snapshot = boardRef.current?.applyStyleToBoard(selectedStyle);
    if (snapshot) {
      saveSnapshot(snapshot, selectedStyle.id);
    }
  };

  const copyFilePath = async () => {
    await copyText(filePath);
    setCopiedPath(true);
    window.setTimeout(() => setCopiedPath(false), 1200);
  };

  const importJsonFile = async (file: File | null) => {
    if (!file) {
      return;
    }
    try {
      const imported = parseImportedScene(await file.text());
      const nextStyleId = imported.styleId ? getStyleById(imported.styleId).id : selectedStyleId;
      setSelectedStyleId(nextStyleId);
      setBoardInstanceKey(`import:${Date.now()}:${file.name}`);
      setImportError(null);
      onSceneChange(
        imported.elements,
        imported.appState,
        imported.files,
        nextStyleId,
        imported.providerId ?? scene.providerId,
        { replace: true },
      );
    } catch (importFailure) {
      setImportError(
        importFailure instanceof Error ? importFailure.message : "Failed to import JSON.",
      );
    }
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div className="title-block">
          <h1>{scene.title}</h1>
          <div className="path-row">
            <span title={filePath}>{compactPath(filePath)}</span>
            <button
              className="path-copy"
              type="button"
              onClick={copyFilePath}
              title={copiedPath ? "Copied path" : "Copy file path"}
            >
              {copiedPath ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        <div className="actions">
          <ReplayStatus progress={replayProgress} enabled={replayEnabled} />
          <Status saveState={saveState} error={error} />
          {importError ? <span className="status status--error">{importError}</span> : null}
          <div className="style-picker">
            <Swatches style={selectedStyle} />
            <select
              value={selectedStyleId}
              onChange={(event) => selectStyle(event.target.value)}
              title="Style"
            >
              {styleGroups.map((group) => (
                <optgroup key={group.level} label={group.level}>
                  {group.styles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button type="button" onClick={paintScene} title="Apply style to board">
            <Palette size={17} />
          </button>
          <button type="button" onClick={exportJson} title="Export JSON">
            <FileJson size={17} />
          </button>
          <button
            className="action-button action-button--label"
            type="button"
            onClick={() => importInputRef.current?.click()}
            title="Import JSON"
          >
            <Upload size={17} />
            <span>Import</span>
          </button>
          <input
            ref={importInputRef}
            className="file-input"
            type="file"
            accept=".json,.agentdraw.json,application/json"
            onChange={(event) => {
              void importJsonFile(event.currentTarget.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => boardRef.current?.exportSvg(scene.title)}
            title="Export SVG"
          >
            <Download size={17} />
          </button>
          <button
            type="button"
            onClick={() => boardRef.current?.exportPng(scene.title)}
            title="Export PNG"
          >
            <Image size={17} />
          </button>
          <a
            className="icon-link"
            href="https://github.com/chenhg5/agentdraw"
            target="_blank"
            rel="noreferrer"
            title="Open AgentDraw on GitHub"
          >
            <Github size={17} />
          </a>
        </div>
      </header>
      <section className="canvas">
        <BoardRenderer
          key={boardInstanceKey}
          ref={boardRef}
          scene={sceneSnapshot}
          style={selectedStyle}
          replay={replayOptions}
          onChange={(snapshot) => saveSnapshot(snapshot)}
        />
      </section>
    </main>
  );
};

const ReplayStatus = ({
  progress,
  enabled,
}: {
  progress: BoardReplayProgress;
  enabled: boolean;
}) => {
  if (!enabled || !progress.active) {
    return null;
  }
  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 100;
  return (
    <span className="status status--replay">
      Drawing {percent}%
    </span>
  );
};

const Status = ({ saveState, error }: { saveState: SaveState; error: string | null }) => {
  if (error) {
    return <span className="status status--error">{error}</span>;
  }
  if (saveState === "saving") {
    return <span className="status">Saving...</span>;
  }
  if (saveState === "saved") {
    return (
      <span className="status">
        <Save size={15} />
        Saved
      </span>
    );
  }
  return <span className="status">Ready</span>;
};

const Swatches = ({ style }: { style: AgentDrawStyle }) => (
  <div className="swatches" aria-hidden="true">
    <span style={{ background: style.palette.canvas }} />
    <span style={{ background: style.palette.accent }} />
    <span style={{ background: style.palette.accent2 }} />
    <span style={{ background: style.palette.accent3 }} />
  </div>
);

const readReplayEnabledFromUrl = (filePath: string) => {
  const params = new URLSearchParams(window.location.search);
  const animate = params.get("animate");
  const replay = params.get("replay");
  const instant = params.get("instant");
  if (animate === "0" || replay === "0" || instant === "1") {
    return false;
  }
  if (window.sessionStorage.getItem(replaySessionStorageKey(filePath)) === "1") {
    return false;
  }
  if (animate === "1" || replay === "1") {
    return true;
  }
  return false;
};

const replaySessionStorageKey = (filePath: string) => `agentdraw:replayed:${filePath}`;

const compactPath = (filePath: string) => {
  const normalized = filePath.replaceAll("\\", "/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length <= 4) {
    return filePath;
  }
  const prefix = normalized.startsWith("/") ? "/" : "";
  return `${prefix}${parts[0]}/.../${parts.slice(-3).join("/")}`;
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

const parseImportedScene = (rawJson: string): BoardSnapshot & { styleId?: string } => {
  const parsed = JSON.parse(rawJson) as Record<string, unknown>;
  const source =
    parsed.scene && typeof parsed.scene === "object"
      ? (parsed.scene as Record<string, unknown>)
      : parsed;
  if (!Array.isArray(source.elements)) {
    throw new Error("Imported JSON must contain an elements array.");
  }
  return {
    styleId: typeof source.styleId === "string" ? source.styleId : undefined,
    providerId: typeof source.providerId === "string" ? source.providerId : undefined,
    elements: source.elements,
    appState:
      source.appState && typeof source.appState === "object"
        ? (source.appState as Record<string, unknown>)
        : {},
    files:
      source.files && typeof source.files === "object"
        ? (source.files as Record<string, unknown>)
        : {},
  };
};
