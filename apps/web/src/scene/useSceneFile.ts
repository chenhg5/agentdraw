import { useCallback, useEffect, useRef, useState } from "react";
import { loadScene, saveScene, SceneApiError } from "./api";
import type { AgentDrawScene, SaveState, SceneChangeOptions } from "./types";

export const useSceneFile = () => {
  const [filePath, setFilePath] = useState(() => readFilePathFromUrl());
  const [scene, setScene] = useState<AgentDrawScene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<number | null>(null);
  const latestSaveId = useRef(0);
  const baseUpdatedAt = useRef<string | null>(null);
  const saveInFlight = useRef(false);
  const pendingSave = useRef<{
    scene: AgentDrawScene;
    saveId: number;
    filePath: string;
    force: boolean;
    updateUrl: boolean;
  } | null>(null);
  const skipLoadForPath = useRef<string | null>(null);
  const lastSavedKey = useRef<string | null>(null);
  const lastQueuedKey = useRef<string | null>(null);

  useEffect(() => {
    if (skipLoadForPath.current === filePath) {
      skipLoadForPath.current = null;
      return;
    }
    let cancelled = false;
    setSaveState("idle");
    loadScene(filePath)
      .then((envelope) => {
        if (!cancelled) {
          setScene(envelope.scene);
          baseUpdatedAt.current = envelope.scene.updatedAt;
          lastSavedKey.current = saveKey(envelope.scene);
          lastQueuedKey.current = lastSavedKey.current;
          setError(null);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load scene.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [filePath]);

  const flushPendingSave = useCallback(() => {
    if (saveInFlight.current || !pendingSave.current) {
      return;
    }
    const pending = pendingSave.current;
    pendingSave.current = null;
    saveInFlight.current = true;
    const isCurrentFile = pending.filePath === filePath;
    const saveBaseUpdatedAt = isCurrentFile
      ? baseUpdatedAt.current ?? pending.scene.updatedAt
      : undefined;

    saveScene(
      pending.filePath,
      {
        styleId: pending.scene.styleId,
        providerId: pending.scene.providerId,
        title: pending.scene.title,
        elements: pending.scene.elements,
        appState: pending.scene.appState,
        files: pending.scene.files,
      },
      saveBaseUpdatedAt,
      { force: pending.force },
    )
      .then((envelope) => {
        baseUpdatedAt.current = envelope.scene.updatedAt;
        lastSavedKey.current = saveKey(envelope.scene);
        lastQueuedKey.current = lastSavedKey.current;
        if (latestSaveId.current === pending.saveId) {
          setScene(envelope.scene);
          if (pending.updateUrl || pending.filePath !== filePath) {
            skipLoadForPath.current = envelope.filePath;
            setFilePath(envelope.filePath);
            writeFilePathToUrl(envelope.filePath);
          }
          setSaveState(pendingSave.current ? "saving" : "saved");
          setError(null);
        }
      })
      .catch((saveError) => {
        lastQueuedKey.current = lastSavedKey.current;
        if (saveError instanceof SceneApiError && saveError.status === 409) {
          if (saveError.currentUpdatedAt) {
            baseUpdatedAt.current = saveError.currentUpdatedAt;
          }
          if (latestSaveId.current === pending.saveId) {
            setSaveState("idle");
            setError(null);
          }
          return;
        }
        if (latestSaveId.current === pending.saveId) {
          setSaveState("error");
          setError(saveError instanceof Error ? saveError.message : "Failed to save scene.");
        }
      })
      .finally(() => {
        saveInFlight.current = false;
        if (pendingSave.current) {
          setSaveState("saving");
          window.setTimeout(flushPendingSave, 0);
        }
      });
  }, [filePath]);

  const queueSave = useCallback(
    (
      elements: readonly unknown[],
      appState: Record<string, unknown>,
      files: Record<string, unknown>,
      styleId?: string,
      providerId?: string,
      options?: SceneChangeOptions,
    ) => {
      if (!scene) {
        return;
      }
      const sanitizedAppState = sanitizeAppState(appState);
      const targetFilePath = options?.filePath ?? filePath;
      const nextScene: AgentDrawScene = {
        ...scene,
        title: options?.title ?? scene.title,
        styleId: styleId ?? scene.styleId,
        providerId: providerId ?? scene.providerId,
        elements,
        appState: sanitizedAppState,
        files,
        updatedAt: new Date().toISOString(),
      };
      const nextSaveKey = saveKey(nextScene);
      const savesCurrentFile = targetFilePath === filePath;
      if (
        savesCurrentFile &&
        (nextSaveKey === lastSavedKey.current || nextSaveKey === lastQueuedKey.current)
      ) {
        return;
      }
      if (!options?.replace && scene.elements.length > 0 && elements.length === 0) {
        return;
      }
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
      setSaveState("saving");
      lastQueuedKey.current = nextSaveKey;
      const saveId = latestSaveId.current + 1;
      latestSaveId.current = saveId;

      if (options?.replace) {
        setScene(nextScene);
      }

      saveTimer.current = window.setTimeout(() => {
        pendingSave.current = {
          scene: nextScene,
          saveId,
          filePath: targetFilePath,
          force: options?.replace === true,
          updateUrl: options?.updateUrl === true,
        };
        flushPendingSave();
      }, 500);
    },
    [filePath, flushPendingSave, scene],
  );

  const openFile = useCallback(
    (nextFilePath: string) => {
      const trimmed = nextFilePath.trim();
      if (!trimmed || trimmed === filePath) {
        return;
      }
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      pendingSave.current = null;
      setScene(null);
      setError(null);
      setSaveState("idle");
      setFilePath(trimmed);
      writeFilePathToUrl(trimmed);
    },
    [filePath],
  );

  return {
    filePath,
    scene,
    error,
    saveState,
    queueSave,
    openFile,
  };
};

const readFilePathFromUrl = () => {
  const filePath = new URLSearchParams(window.location.search).get("file");
  return filePath?.trim() || ".agentdraw/untitled.agentdraw.json";
};

const writeFilePathToUrl = (filePath: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("file", filePath);
  window.history.replaceState(null, "", url);
};

const sanitizeAppState = (appState: Record<string, unknown>) => {
  const {
    collaborators,
    suggestedBindings,
    startBoundElement,
    cursorButton,
    scrollX,
    scrollY,
    zoom,
    offsetLeft,
    offsetTop,
    width,
    height,
    showWelcomeScreen,
    selectedElementIds,
    selectedGroupIds,
    previousSelectedElementIds,
    hoveredElementIds,
    editingTextElement,
    editingGroupId,
    newElement,
    activeEmbeddable,
    openMenu,
    openPopup,
    openSidebar,
    openDialog,
    toast,
    currentItemRoundness,
    ...persisted
  } = appState;
  void collaborators;
  void suggestedBindings;
  void startBoundElement;
  void cursorButton;
  void scrollX;
  void scrollY;
  void zoom;
  void offsetLeft;
  void offsetTop;
  void width;
  void height;
  void showWelcomeScreen;
  void selectedElementIds;
  void selectedGroupIds;
  void previousSelectedElementIds;
  void hoveredElementIds;
  void editingTextElement;
  void editingGroupId;
  void newElement;
  void activeEmbeddable;
  void openMenu;
  void openPopup;
  void openSidebar;
  void openDialog;
  void toast;
  void currentItemRoundness;
  return persisted;
};

const saveKey = (scene: AgentDrawScene) =>
  stableStringify({
    title: scene.title,
    styleId: scene.styleId,
    providerId: scene.providerId,
    elements: scene.elements,
    appState: sanitizeAppState(scene.appState),
    files: scene.files,
  });

const stableStringify = (value: unknown): string => JSON.stringify(stableValue(value));

const stableValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  const record = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    if (VOLATILE_ELEMENT_KEYS.has(key)) {
      continue;
    }
    output[key] = stableValue(record[key]);
  }
  return output;
};

const VOLATILE_ELEMENT_KEYS = new Set([
  "updated",
  "version",
  "versionNonce",
]);
