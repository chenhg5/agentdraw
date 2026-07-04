import {
  getStyleById,
  styleGroups,
  type AgentDrawStyle,
} from "@agentdraw/styles";
import { Download, FileJson, Image, Palette, Save } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ExcalidrawBoard } from "../board/excalidraw/ExcalidrawBoard";
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
  const [selectedStyleId, setSelectedStyleId] = useState(() => getStyleById(scene.styleId).id);
  const [replayProgress, setReplayProgress] = useState<BoardReplayProgress>({
    active: false,
    current: scene.elements.length,
    total: scene.elements.length,
  });
  const selectedStyle = getStyleById(selectedStyleId);
  const replayEnabled = useMemo(() => readReplayEnabledFromUrl(), []);
  const replayOptions = useMemo(
    () => ({
      enabled: replayEnabled,
      onProgress: setReplayProgress,
    }),
    [replayEnabled],
  );

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

  return (
    <main className="shell">
      <header className="topbar">
        <div className="title-block">
          <h1>{scene.title}</h1>
          <span title={filePath}>{filePath}</span>
        </div>
        <div className="actions">
          <ReplayStatus progress={replayProgress} enabled={replayEnabled} />
          <Status saveState={saveState} error={error} />
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
        </div>
      </header>
      <section className="canvas">
        <ExcalidrawBoard
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

const readReplayEnabledFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const animate = params.get("animate");
  const replay = params.get("replay");
  const instant = params.get("instant");
  return animate !== "0" && replay !== "0" && instant !== "1";
};
