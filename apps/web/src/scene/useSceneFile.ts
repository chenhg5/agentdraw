import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadScene, saveScene, SceneApiError } from "./api";
import type { AgentDrawScene, SaveState } from "./types";

export const useSceneFile = () => {
  const filePath = useMemo(() => readFilePathFromUrl(), []);
  const [scene, setScene] = useState<AgentDrawScene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<number | null>(null);
  const latestSaveId = useRef(0);
  const baseUpdatedAt = useRef<string | null>(null);
  const saveInFlight = useRef(false);
  const pendingSave = useRef<{ scene: AgentDrawScene; saveId: number; force: boolean } | null>(null);
  const lastSavedKey = useRef<string | null>(null);
  const lastQueuedKey = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
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
    const saveBaseUpdatedAt = baseUpdatedAt.current ?? pending.scene.updatedAt;

    saveScene(
      filePath,
      {
        styleId: pending.scene.styleId,
        providerId: pending.scene.providerId,
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
      options?: { replace?: boolean },
    ) => {
      if (!scene) {
        return;
      }
      const sanitizedAppState = sanitizeAppState(appState);
      const nextScene: AgentDrawScene = {
        ...scene,
        styleId: styleId ?? scene.styleId,
        providerId: providerId ?? scene.providerId,
        elements,
        appState: sanitizedAppState,
        files,
        updatedAt: new Date().toISOString(),
      };
      const nextSaveKey = saveKey(nextScene);
      if (nextSaveKey === lastSavedKey.current || nextSaveKey === lastQueuedKey.current) {
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
        pendingSave.current = { scene: nextScene, saveId, force: options?.replace === true };
        flushPendingSave();
      }, 500);
    },
    [flushPendingSave, scene],
  );

  return {
    filePath,
    scene,
    error,
    saveState,
    queueSave,
  };
};

const readFilePathFromUrl = () => {
  const filePath = new URLSearchParams(window.location.search).get("file");
  return filePath?.trim() || ".agentdraw/untitled.agentdraw.json";
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
