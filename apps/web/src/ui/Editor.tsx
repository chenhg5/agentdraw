import {
  getStyleById,
  styleGroups,
  type AgentDrawStyle,
} from "@agentdraw/styles";
import {
  Check,
  Copy,
  Download,
  FileJson,
  Github,
  History,
  Image,
  Languages,
  Palette,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BoardRenderer } from "../board/BoardRenderer";
import {
  downloadBlob,
  type BoardHandle,
  type BoardReplayProgress,
  type BoardSnapshot,
} from "../board/types";
import type { AgentDrawScene, SaveState, SceneChangeOptions } from "../scene/types";

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
    options?: SceneChangeOptions,
  ) => void;
  onOpenFile: (filePath: string) => void;
};

export const Editor = ({
  filePath,
  scene,
  saveState,
  error,
  onSceneChange,
  onOpenFile,
}: EditorProps) => {
  const boardRef = useRef<BoardHandle | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState(() => getStyleById(scene.styleId).id);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(readLanguageCode);
  const [copiedPath, setCopiedPath] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentBoards, setRecentBoards] = useState<RecentBoard[]>(() => readRecentBoards());
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
  }, [scene.styleId]);

  useEffect(() => {
    setReplayEnabled(readReplayEnabledFromUrl(filePath));
    setReplayProgress({
      active: false,
      current: scene.elements.length,
      total: scene.elements.length,
    });
  }, [filePath]);

  useEffect(() => {
    setRecentBoards((current) => writeRecentBoards(addRecentBoard(current, {
      filePath,
      title: scene.title,
      openedAt: Date.now(),
    })));
  }, [filePath, scene.title]);

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

  const selectLanguage = (languageCode: string) => {
    const nextLanguageCode = supportedLanguageCodes.has(languageCode)
      ? languageCode
      : defaultLanguageCode;
    setSelectedLanguageCode(nextLanguageCode);
    window.localStorage.setItem(languageStorageKey, nextLanguageCode);
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
      const importFilePath = importedFilePath(filePath, file.name);
      setSelectedStyleId(nextStyleId);
      setImportError(null);
      onSceneChange(
        imported.elements,
        imported.appState,
        imported.files,
        nextStyleId,
        imported.providerId ?? scene.providerId,
        {
          replace: true,
          filePath: importFilePath,
          title: imported.title ?? titleFromFileName(file.name),
          updateUrl: true,
        },
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
          <div className="language-picker">
            <Languages size={16} />
            <select
              value={selectedLanguageCode}
              onChange={(event) => selectLanguage(event.target.value)}
              title="Language"
            >
              {supportedLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={paintScene} title="Apply style to board">
            <Palette size={17} />
          </button>
          <button type="button" onClick={exportJson} title="Export JSON">
            <FileJson size={17} />
          </button>
          <RecentBoardsPicker
            open={historyOpen}
            boards={recentBoards}
            currentFilePath={filePath}
            onToggle={() => setHistoryOpen((open) => !open)}
            onClose={() => setHistoryOpen(false)}
            onOpenFile={onOpenFile}
          />
          <button type="button" onClick={() => importInputRef.current?.click()} title="Import JSON">
            <Upload size={17} />
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
            href="https://github.com/agentdraw/agentdraw"
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
          key={`${filePath}:${scene.id}:${scene.providerId ?? "excalidraw"}`}
          ref={boardRef}
          scene={sceneSnapshot}
          style={selectedStyle}
          langCode={selectedLanguageCode}
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

const RecentBoardsPicker = ({
  open,
  boards,
  currentFilePath,
  onToggle,
  onClose,
  onOpenFile,
}: {
  open: boolean;
  boards: RecentBoard[];
  currentFilePath: string;
  onToggle: () => void;
  onClose: () => void;
  onOpenFile: (filePath: string) => void;
}) => {
  const openBoard = (filePath: string) => {
    onClose();
    if (filePath !== currentFilePath) {
      onOpenFile(filePath);
    }
  };

  return (
    <>
      <button type="button" onClick={onToggle} title="Recent boards">
        <History size={17} />
      </button>
      <aside className={`history-drawer${open ? " history-drawer--open" : ""}`}>
        <div className="history-drawer__header">
          <div>
            <h2>Recent Boards</h2>
            <p>{boards.length} local records</p>
          </div>
          <button type="button" onClick={onClose} title="Close recent boards">
            <X size={17} />
          </button>
        </div>
        <div className="history-list">
          {boards.length === 0 ? (
            <div className="history-empty">No recent boards yet.</div>
          ) : (
            boards.map((board) => (
              <button
                key={board.filePath}
                className={`history-item${
                  board.filePath === currentFilePath ? " history-item--active" : ""
                }`}
                type="button"
                onClick={() => openBoard(board.filePath)}
              >
                <span>{board.title}</span>
                <small>{compactPath(board.filePath)}</small>
              </button>
            ))
          )}
        </div>
      </aside>
      {open ? (
        <button
          className="history-backdrop"
          type="button"
          aria-label="Close recent boards"
          onClick={onClose}
        />
      ) : null}
    </>
  );
};

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

const defaultLanguageCode = "en";
const languageStorageKey = "agentdraw:language";
const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja-JP", label: "日本語" },
  { code: "es-ES", label: "Español" },
  { code: "pt-BR", label: "Português (BR)" },
  { code: "pt-PT", label: "Português (PT)" },
] as const;
const supportedLanguageCodes = new Set<string>(
  supportedLanguages.map((language) => language.code),
);

const readLanguageCode = () => {
  const stored = window.localStorage.getItem(languageStorageKey);
  if (stored && supportedLanguageCodes.has(stored)) {
    return stored;
  }
  const browserLanguage = navigator.language;
  if (supportedLanguageCodes.has(browserLanguage)) {
    return browserLanguage;
  }
  const normalizedBrowserLanguage = browserLanguage.toLowerCase();
  if (
    normalizedBrowserLanguage === "zh-hk" ||
    normalizedBrowserLanguage === "zh-mo" ||
    normalizedBrowserLanguage === "zh-tw"
  ) {
    return "zh-TW";
  }
  if (normalizedBrowserLanguage.startsWith("zh")) {
    return "zh-CN";
  }
  if (normalizedBrowserLanguage === "pt-pt") {
    return "pt-PT";
  }
  if (normalizedBrowserLanguage.startsWith("pt")) {
    return "pt-BR";
  }
  const prefixMatch = supportedLanguages.find((language) =>
    normalizedBrowserLanguage.startsWith(language.code.split("-")[0].toLowerCase()),
  );
  return prefixMatch?.code ?? defaultLanguageCode;
};

type RecentBoard = {
  filePath: string;
  title: string;
  openedAt: number;
};

const recentBoardsStorageKey = "agentdraw:recent-boards";
const maxRecentBoards = 12;

const readRecentBoards = (): RecentBoard[] => {
  try {
    const value = window.localStorage.getItem(recentBoardsStorageKey);
    if (!value) {
      return [];
    }
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isRecentBoard).slice(0, maxRecentBoards);
  } catch {
    return [];
  }
};

const writeRecentBoards = (boards: RecentBoard[]) => {
  window.localStorage.setItem(recentBoardsStorageKey, JSON.stringify(boards));
  return boards;
};

const addRecentBoard = (boards: RecentBoard[], board: RecentBoard) => {
  const nextBoards = [
    board,
    ...boards.filter((existing) => existing.filePath !== board.filePath),
  ].slice(0, maxRecentBoards);
  return nextBoards;
};

const isRecentBoard = (value: unknown): value is RecentBoard => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.filePath === "string" &&
    typeof record.title === "string" &&
    typeof record.openedAt === "number"
  );
};

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

const importedFilePath = (currentFilePath: string, importedFileName: string) => {
  const normalized = currentFilePath.replaceAll("\\", "/");
  const lastSlash = normalized.lastIndexOf("/");
  const directory = lastSlash >= 0 ? normalized.slice(0, lastSlash + 1) : "";
  return `${directory}${safeImportFileName(importedFileName)}`;
};

const safeImportFileName = (fileName: string) => {
  const normalized = fileName.replaceAll("\\", "/").split("/").pop()?.trim();
  return normalized || "imported.agentdraw.json";
};

const titleFromFileName = (fileName: string) =>
  safeImportFileName(fileName)
    .replace(/\.agentdraw\.json$/i, "")
    .replace(/\.json$/i, "")
    .replace(/[-_]+/g, " ")
    .trim() || "Imported Board";

const parseImportedScene = (
  rawJson: string,
): BoardSnapshot & { styleId?: string; title?: string } => {
  const parsed = JSON.parse(rawJson) as Record<string, unknown>;
  const source =
    parsed.scene && typeof parsed.scene === "object"
      ? (parsed.scene as Record<string, unknown>)
      : parsed;
  if (!Array.isArray(source.elements)) {
    throw new Error("Imported JSON must contain an elements array.");
  }
  return {
    title: typeof source.title === "string" ? source.title : undefined,
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
